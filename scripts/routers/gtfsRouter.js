/**
 * Created by Nathan P on 4/18/2014.
 */

define(['fs',
    'url',
    'path',
    'child_process',
    'scripts/utils/globalvars'
], function(fs, url, path, childProcess, globalvars) {

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

        writeGtfsToFile(request.query.session, request.body.gtfs, function() {

        });

//        var child = childProcess.spawn();
    }

    function writeGtfsToFile(session, gtfsJson, callback) {
        var dir = path.join(globalvars.sessionsDir, session);
        // Make directory to the session
        var filesLeft = 6;
        fs.mkdir(dir,0777,function() {
            var gtfsDir = path.join(dir, 'gtfs');
            // Make directory to the gtfs feed
            fs.mkdir(gtfsDir, 0777, function() {

                for(var key in gtfsJson) {
                    writeGtfsTxt(gtfsDir, key, gtfsJson[key], function() {
                        if(--filesLeft === 0)
                            callback.call(this);
                    });
                }
            });
        });
    }

    function writeGtfsTxt(gtfsDir, key, fileString, callback) {
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
        fs.writeFile(path.join(gtfsDir, filename), fileString, callback);
    }


    return {
        updateRidership: updateRidership
    }
});