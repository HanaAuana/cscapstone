/**
 * Created by Nathan P on 4/18/2014.
 */

define(['fs',
    'url',
    'path',
    'child_process',
    'http',
    'adm-zip',
    'json!config',
    'database/connect',
    'api/multimodalRoutingAPI'
], function(fs,
            url,
            path,
            childProcess,
            http,
            AdmZip,
            globalvars,
            connect,
            multimodalRoute) 
{
    function updateRidershipRoute(request, response) {

        var query = request.query;
        var body = request.body;
        delete body.city.cityBoundary;
        delete body.city.tracts;
        var geoID = query.state + query.place;

        connect.makeSessWrite(query.session, 
                                body.routes, 
                                geoID, 
                                body.gtfs, 
                                body.city,
                                function(result) {

        });

        // Update the graph with new GTFS
        updateOTPGraph(request, function(sessionDir) {

            // We also need to link the OTP graphs folder, because it's
            // not letting us change the base path. Stupid!
            var pathToOtpGraph = path.join(globalvars.otpGraphPath, request.query.session);
            var pathToOSMGraph = path.join(sessionDir, 'Graph.obj');
            var to = path.join(pathToOtpGraph, 'Graph.obj'); // To here

            // So make a directory for this session and symlink the OSM graphh
            fs.mkdir(pathToOtpGraph, 0777, function() {
                console.log(pathToOSMGraph + " " + to);
                childProcess.exec('ln ' + pathToOSMGraph + ' ' + to, {},
                    function(err, stdout, stderr) {
                        if(err)
                            console.log(stderr);

                        // Inform OTP server of new graph
                        multimodalRoute.reloadRoute(request.query.session, function() {
                            // Everything is ready! Do routing
                            doUpdateRidership(request.query, body.routes);
                        });
                    }
                );
            });
        });

        response.send();
    }

    function updateOTPGraph(request, callback) {

        var dir = path.join(globalvars.sessionsDir, request.query.session);

        // Make directory to the session
        fs.mkdir(dir,0777,function() {

            // Write the gtfs file to this session's directory
            writeAndZipGtfs(dir, request.body.gtfs);

            // Link the appropriate OSM map to this session's directory
            linkOsmMap(request.query.state, request.query.place, request.query.session, dir,
                function() {
                    // Rebuild the graph with the new GTFS feed
                    var child = childProcess.spawn('java', [
                    '-Xmx2g',
                    '-jar',
                    globalvars.otpJarPath,
                    '--build',
                    dir]);

                    child.stdout.on('data', function (data) {
                        console.log('OTP: ' + data);
                    });

                    child.stderr.on('data', function (data) {
                        console.log('OTP: ' + data);
                    });

                    child.on('close', function(code) {
                        console.log('Graph compilation finished with exit code: ' + code);
                        callback.call(this, dir);
                    });
            });
        });
    }

    function writeAndZipGtfs(dir, gtfsJson) {

        var zip = new AdmZip();
        // Add all files to the zip buffer. The key is the correct file name
        for (var key in gtfsJson)
            zip.addFile(key, new Buffer(gtfsJson[key]));

        var gtfsZip = path.join(dir, 'gtfs.zip');
        console.log("Writing gtfs zip at " + gtfsZip);
        zip.writeZip(gtfsZip);
    }

    function linkOsmMap(stateID, placeID, session, sessionDir, callback) {
  
	findOSMMap(stateID, placeID, function(osmFile) {
	
	    if(!osmFile)
		throw "No OSM data found for state " + stateID;

    	    // Create a link from the OSM file location to the session
            // folder. OTP needs the GTFS and OSM in the same 
            var from = path.join(globalvars.osmDir, osmFile); // Linking from here
            var to = path.join(sessionDir, stateID + '.osm.pbf'); // To here
            console.log(from + "   " + to);
            childProcess.exec('ln ' + from + ' ' + to, {},
                function(err, stdout, stderr) {
                   if(err)
                       console.log(stderr);
 
                   callback.call(this, to);
                }
            );
 	});
    } 

    function findOSMMap(stateID, placeID, callback) {
	var geoID = stateID + '' + placeID;

	// First check to see if there is an OSM map for the city
	fs.readdir(globalvars.osmDir, function(err, placeFiles) {
	    if(err)
            throw err;
	     
	    for(var i = 0; i < placeFiles.length; i++) {

    		if(RegExp('^' + geoID + '_').test(placeFiles[i])) {
    		    console.log("Found OSM for place at: " + placeFiles[i]);
    		    callback.call(this, placeFiles[i]);
    		    return;
    		}
	    }

        // If we couldn't find an OSM map for the city, find the OSM
	    // file corresponding to the state 
        fs.readdir(globalvars.osmDir, function(err, stateFiles) {
         	if(err)
               throw err;

        	for(var i = 0; i < stateFiles.length; i++) {
               if(RegExp('^' + stateID + '_').test(stateFiles[i])) {
	       console.log("Found OSM for state at: " + stateFiles[i]);
	       callback.call(this, stateFiles[i]);
	       return;
               }	
            }
            callback.call(this, false);
                console.log("Error: No OSM data for state " + stateID);
            });
	   });
    }

    function doUpdateRidership(query, transitRoutes) {

        var geoID = query.state + query.place;
        var tripsCompleted = 0;

        // Get all the trips
        connect.makeTripQuery(geoID, function(trips) {
            if(trips === false) {
                console.log('NO TRIPS FOUND FOR GEOID ' + geoID);
            } else {
                console.log("Updating ridership...");
                resetRidership(transitRoutes);

                updateRidershipSeq(query, transitRoutes, trips, 0);
            }
        }, this);        
    }

    var tripsCompleted = 0;
    function updateRidershipSeq(query, transitData, trips, seqNum) {

        if(seqNum == 0) tripsCompleted = 0;

        routeAPIWrapper(query.session, trips[seqNum], 
            function(trip, result) 
        {
            // Anaylze the OTP's routing response
            var routeResponse = handleRouteResponse(trip, 
                                                    result, 
                                                    transitData.routes);
            var globalStats = transitData.globalStats;
            if(routeResponse.satisfied)
                ++globalStats.totalSatisfied;
            else
                 ++globalStats.totalUnsatisfied;

            // Keep running total of satisfaction percents. We'll average these
            // at the end
            globalStats.totalPctSatisfied += routeResponse.pctSatisfied;

            // When completed...
            if(++tripsCompleted === trips.length) {
                console.log("Ridership update complete");

                // Evict the graph to reduc memory footprint
                multimodalRoute.evictRoute(query.session);
                
                // Calculate total pct satisfied
                globalStats.totalPctSatisfied /= trips.length;
                console.log(globalStats);

                // Write session update to database
                connect.makeRouteUpdate(query.session, transitData);
            } else if(tripsCompleted % 100 == 0)
                console.log('On trip ' + tripsCompleted);

            if(++seqNum !== trips.length)
                updateRidershipSeq(query, transitData, trips, seqNum);                
        });
    }

    function resetRidership(transitRoutes) {

        var routes = transitRoutes.routes;

        // Reset ridership numbers for each route
        for(var i = 0; i < routes.length; i++) {
            routes[i].ridership = 0;
        }

        transitRoutes.globalStats = {
            totalSatisfied: 0,
            totalUnsatisfied: 0,
            totalPctSatisfied: 0
        }
    }

    function handleRouteResponse(trip, result, transitRoutes) {

        var response = {
            satisfied: false,
            pctSatisfied: 0
        }

        if(result.error != null) {
            return response;
        }

        var itineraries = result.plan.itineraries;
        var bestRoute = null;
        // Get the quickest route
        for(var i = 0; i < itineraries.length; i++) {
            if(bestRoute === null
                || bestRoute.duration > itineraries[i].duration)
                bestRoute = itineraries[i];
        }


        // If there is no route, trip was not satisfed
        if(bestRoute !== null) {         

            var totalRouteDistance = 0;
            var totalTransitDistance = 0; 
            // Loop through all trip legs, keeping track of which transit routes
            // were used
            var legs = bestRoute.legs;
            for(var i = 0; i < legs.length; i++) {
                var curLeg = legs[i];
                if(curLeg.transitLeg) {

                    response.satisfied = true;
                    totalTransitDistance += curLeg.distance;

                    // Increment ridership count for the route on which this
                    // leg occurred
                    var routeId = curLeg.routeId;
                    for(var j = 0; j < transitRoutes.length; j++) {
                        if(transitRoutes[j].id == routeId) {
                            ++transitRoutes[j].ridership;
                            break;
                        }
                    }
                }
                // Incerement total distance traveled
                totalRouteDistance += curLeg.distance;  
            }

            response.pctSatisfied = 100 * totalTransitDistance / totalRouteDistance;
        }

        return response;
    }

    /**
     * Wraps the multimodal routing API, so that we can hold on to
     * references to the trip (otherwise we'd lose them in the async
     * for loop of doUpdateRidership() )
     */
    function routeAPIWrapper(session, trip, callback) {
        multimodalRoute.doRoute(session, 
                                trip.origin.coordinates, 
                                trip.dest.coordinates,
                                function(result) 
        {
            if(result.error == null) {
                callback.call(this, trip, result);
            } else {
                if(result.error.msg.indexOf("Trip is not possible.") >= 0) {
                    callback.call(this, trip, result);
                } else {
                    console.log('ERROR: %j', result.error);
                    routeAPIWrapper(session, trip, callback);
                }
            }
        }, this);
    }

    return {
        updateRidershipRoute: updateRidershipRoute
    }
});
