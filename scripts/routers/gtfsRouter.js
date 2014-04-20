/**
 * Created by Nathan P on 4/18/2014.
 */

define(['fs',
    'url',
    'path',
    'child_process',
    'adm-zip',
    'scripts/utils/globalvars'
], function(fs, url, path, childProcess, AdmZip, globalvars) {

    function updateRidership(request, response) {

        console.log(request.query);

        writeRiderDB(request, function(result) {

        });

        updateGraphAndRidership(request);


        response.send();
    }

    function writeRiderDB(request, callback) {
        callback.call(this, true);
    }

    function updateGraphAndRidership(request) {

        var dir = path.join(globalvars.sessionsDir, request.query.session);

        // Make directory to the session
        fs.mkdir(dir,0777,function() {

            // Write the gtfs file to this session's directory
            writeAndZipGtfs(dir, request.body.gtfs);

            // Link the appropriate OSM map to this session's directory
            linkOsmMap(request.query.state, dir, function() {
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
                });
            });
        });

//

//         /path/to/downloads/pdx
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

    function linkOsmMap(stateID, sessionDir, callback) {
        // Find the osm file corresponding to the state to the session directory
        fs.readdir(globalvars.osmDir, function(err, files) {
            if(err)
                throw err;

            for(var i = 0; i < files.length; i++) {
                if(RegExp('^' + stateID).test(files[i])) {

                    var from = path.join(globalvars.osmDir, files[i]); // Linking from here
                    var to = path.join(sessionDir, stateID + '.osm.pbf'); // To here
                    console.log(from + "   " + to);

                    childProcess.exec('ln ' + from + ' ' + to, {},
                        function(err, stdout, stderr) {
                            if(err)
                                throw err;

                            callback.call(this);
                        }
                    );
                }
            }
        });
    }


    return {
        updateRidershipRoute: updateRidership
    }
});