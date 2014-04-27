/**
 * Created by Nathan P on 4/18/2014.
 */

define(['fs',
    'url',
    'path',
    'child_process',
    'http',
    'adm-zip',
    'scripts/utils/globalvars',
    'scripts/database/connect',
    'scripts/utils/multimodalRoutingAPI'
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

    function writeRiderDB(request, callback) {
        // TODO
        callback.call(this, true);
    }

    function updateOTPGraph(request, callback) {

        var dir = path.join(globalvars.sessionsDir, request.query.session);

        // Make directory to the session
        fs.mkdir(dir,0777,function() {

            // Write the gtfs file to this session's directory
            writeAndZipGtfs(dir, request.body.gtfs);

            // Link the appropriate OSM map to this session's directory
            linkOsmMap(request.query.state, request.query.session, dir,
                function() {
                    // Rebuild the graph with the new GTFS feed
                    var child = childProcess.spawn('java', [
                    '-Xmx2g',
                    '-jar',
                    globalvars.otpJarPath,
                    '--build',
                    dir]);

                    child.stdout.on('data', function (data) {
                        console.log('child: ' + data);
                    });

                    child.stderr.on('data', function (data) {
                        console.log('child: ' + data);
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

    function linkOsmMap(stateID, session, sessionDir, callback) {
        // Find the osm file corresponding to the state to the session directory
        fs.readdir(globalvars.osmDir, function(err, files) {
            if(err)
                throw err;

            for(var i = 0; i < files.length; i++) {
                if(RegExp('^' + stateID).test(files[i])) {

                    // Create a link from the OSM file location to the session
                    // folder. OTP needs the GTFS and OSM in the same folder
                    var from = path.join(globalvars.osmDir, files[i]); // Linking from here
                    var to = path.join(sessionDir, stateID + '.osm.pbf'); // To here
                    console.log(from + "   " + to);

                    childProcess.exec('ln ' + from + ' ' + to, {},
                        function(err, stdout, stderr) {
                            if(err)
                                console.log(stderr);

                            callback.call(this, to);
                            return;
                        }
                    );
                }
            }
            console.log("Error: No OSM data for state " + stateID);
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
                var globalStats = resetRidership(transitRoutes);

                updateRidershipSeq(query, transitRoutes, trips, 0, globalStats);
            }
        }, this);        
    }

    var tripsCompleted = 0;
    function updateRidershipSeq(query, transitRoutes, trips, seqNum, globalStats) {

        if(seqNum == 0) tripsCompleted = 0;
        console.log("updateRidershipSeq: " + seqNum);

        routeAPIWrapper(query.session, trips[seqNum], 
            function(trip, result) 
        {

            console.log("Got wrapper response for " + seqNum);

            if(handleRouteResponse(trip, result, transitRoutes.routes))
                ++globalStats.totalSatisfied;
            else
                ++globalStats.totalUnsatisfied;

            console.log("Through route response");

            // Evict the graph when finished to reduce memory
            // footprint, and write the updated route collection to
            // the db
            if(++tripsCompleted === trips.length) {
                multimodalRoute.evictRoute(query.session);
                
                transitRoutes.globalStats = globalStats;
                console.log(transitRoutes);

                connect.makeRouteUpdate(query.session, transitRoutes);
            } else if(tripsCompleted % 100 == 0)
                console.log('On trip ' + tripsCompleted);

            if(++seqNum !== trips.length)
                updateRidershipSeq(query, transitRoutes, trips, seqNum, globalStats);                
        });
    }

    function resetRidership(transitRoutes) {
        // Reset ridership numbers for each route
        for(var i = 0; i < transitRoutes; i++) {
            transitRoutes[i].ridership = 0;
        }

        // Return empty global statistics
        return {
            totalSatisfied: 0,
            totalUnsatisfied: 0
        };   
    }

    function handleRouteResponse(trip, result, transitRoutes) {
        var itineraries = result.plan.itineraries;
        var bestRoute = null;
        // Get the quickest route
        for(var i = 0; i < itineraries.length; i++) {
            if(bestRoute === null
                || bestRoute.duration > itineraries[i].duration)
                bestRoute = itineraries[i];
        }

        var satisfied = false;
        // If there is no route, trip was not satisfed
        if(bestRoute !== null) {          
            // Loop through all trip legs, keeping track of which transit routes
            // were used
            var legs = bestRoute.legs;
            for(var i = 0; i < legs.length; i++) {
                var curLeg = legs[i];
                if(curLeg.transitLeg) {
                    // If this leg used transit, we consider the trip "satisifed"
                    // This satisfied/not satisfied boolean is a bit weak. It 
                    // might be better for each trip get a satisfied rating, based
                    // on how much of the route is walking and how much is transit
                    satisfied = true;

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
            }
        }
        return satisfied;
    }

    /**
     * Wraps the multimodal routing API, so that we can hold on to
     * references to the trip (otherwise we'd lose them in the async
     * for loop of doUpdateRidership() )
     */
    function routeAPIWrapper(session, trip, callback) {
        console.log("Routing trip " + trip.tripId);
        multimodalRoute.doRoute(session, 
                                trip.origin.coordinates, 
                                trip.dest.coordinates,
                                function(result) 
        {
            if(result.error == null) {
                console.log("RouteAPIWrapper: Calling back, response for trip " + trip.tripId);
                callback.call(this, trip, result);
            } else {
                console.log("Recursing on trip " + trip.tripId);
                routeAPIWrapper(session, trip, callback);
            }
        }, this);
    }

    return {
        updateRidershipRoute: updateRidershipRoute
    }
});