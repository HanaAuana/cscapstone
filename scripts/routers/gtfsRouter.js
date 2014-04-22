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
            multimodalRoute) {

    function updateRidershipRoute(request, response) {

        console.log(request.query);

        writeRiderDB(request, function(result) {

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
                        reloadGraph(request.query.session, function() {
                            // Everything is ready! Do routing
                            prepareUpdateRidership(request.query);
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
                        console.log('child closed: ' + code);
                        callback.call(this, dir);
                    });
            });
        });
    }

    function writeAndZipGtfs(dir, gtfsJson) {

        var zip = new AdmZip();
        // Add all files to the zip buffer
        for(var key in gtfsJson)
            addGtfsFileToZip(zip, key, gtfsJson[key]);

        var gtfsZip = path.join(dir, 'gtfs.zip');
        console.log("Writing gtfs zip at " + gtfsZip);
        zip.writeZip(gtfsZip);
    }

    function addGtfsFileToZip(zip, key, fileString) {
        var filename;
        switch(key) {
            case 'agencyTxt':
                filename = 'agency.txt';
                break;
            case 'routesTxt':
                filename = 'routes.txt';
                break;
            case 'stopsTxt':
                filename = 'stops.txt';
                break;
            case 'calendarTxt':
                filename = 'calendar.txt';
                break;
            case 'tripsTxt':
                filename = 'trips.txt';
                break;
            case 'stopTimesTxt':
                filename =  'stop_times.txt';
                break;
        }
        zip.addFile(filename, new Buffer(fileString));
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
                        }
                    );
                }
            }
        });
    }

    /**
     * Requests OTP to load/reload the graph for the specified session
     * @param session Session to reload graph
     * @param callback
     */
    function reloadGraph(session, callback) {

        var options = {
            hostname: 'localhost',
            port: 8080,
            path: '/otp-rest-servlet/ws/routers/' + session,
            method: 'PUT'
        };

		console.log('Requesting OTP graph reload at: ' + options.path);
        var req = http.request(options, function(res) {
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function(data) {
                console.log(data);
            }).on('end', function() {
                console.log('Graph registration complete, code ' + res.statusCode);
                callback.call(this);
            });
        });
		req.end();
    }

    /**
     * Gets the data needed to update ridership for session of the specified
     * query.
     * @param query
     */
    function prepareUpdateRidership(query) {
        var steps = 2;
        var geoID = query.state + query.place;
        var trips = null;
        var routeCollection = null;
        // Get all the trips
        connect.makeTripQuery(geoID, function(tripResult) {
            if(tripResult === false)
                console.log('NO TRIPS FOUND FOR GEOID ' + geoID);

            trips = tripResult;
            if(--steps === 0) {
                doUpdateRidership(query.session, trips, routeCollection);
            }
        }, this);

        connect.makeSessQuery(query.session, function(seshResult) {
            if(seshResult === false)
                console.log("NO SESSION DATA FOR " + query.session);

            routeCollection = seshResult.routeCollection;
            if(--steps === 0) {
                doUpdateRidership(query.session, trips, routeCollection);
            }
        }, this)
    }

    function doUpdateRidership(session, trips, routeCollection) {
        // TODO update ridership
        console.log("Updating ridership...");
        for(var i = 0; i < trips.length; i++) {
            routeAPIWrapper(session, result[i], function(trip, result) {
                // Handle result
            });
        }
    }

    function routeAPIWrapper(session, trip, callback) {
        multimodalRoute.doRoute(session, trip.origin, trip.dest,
            function(result) {
                callback.call(this, trip, result);
        }, this);
    }

    return {
        updateRidershipRoute: updateRidershipRoute
    }
});