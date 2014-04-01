/*
 * Created by Nathan P on 3/6/14.
 *
 * Provides access to the census API
 */

define(['http',
    'scripts/utils/globalvars',
    'jsftp',
    'fs'
], function(http, globalvars, Jsftp, fs) {

//    var ftp;
    var host = 'ftp2.census.gov';
    var path = '/geo/tiger/TIGER2013/TRACT/';
    var filePre = 'tl_2013_';
    var filePost = '_tract.zip';

    // defined at:
    // https://www.census.gov/developers/data/acs_5yr_2010_var.xml
    var totalRace = 'B02001_001E';
    var totalPop = 'B01003_001E';

    function getCensusTractPopulations(stateID, countyID,
                             countySubdivID, placeID, callback, context) {

        // put all the geoIDs into the url
        var url = 'http://api.census.gov/data/2010/acs5?key=' + globalvars.censusKey
            + '&get=' + totalRace + '&for=tract:*&in=state:' + stateID
            + '+county:*';

        console.log(url);
        var body = '';
        http.get(url, function(res) {
            // concatenate data chunks
            res.on('data', function (chunk) {
                body += chunk;
                // make the callback when all data is in
            }).on('end', function() {
                callback.call(context||this, JSON.parse(body));
            })
        }).on('error', function() {
            callback.call(context||this, false);
        });
    }

    // The experimental census boundary location api, defined at:
    // http://census.ire.org/docs/boundary.html
    function getBoundaryLocation (longLat, callback, context) {
        var lat = longLat.d;
        var lng = longLat.e;
        var url = 'http://census.ire.org/geo/1.0/boundary/?contains=' + lat + ','
            + lng + '&sets=places,county-subdivisions'

        // make the call, send result back to the caller if success, send
        // false if failure
        console.log(url);
        var body = '';
        http.get(url, function(res) {
            // concatenate data chunks
            res.on('data', function (chunk) {
                body += chunk;
            // make the callback when all data is in
            }).on('end', function() {
                callback.call(context||this, parseBoundaryResponse(body));
            })
        }).on('error', function() {
            callback.call(context||this, false);
        });
    };

    /**
     * Gets all census tracts for the specified state
     * @param stateID FIPS code of state
     * @param callback Called when tracts have been received
     * @param context optional callback context
     */
    function getStateTracts(stateID, callback, context) {

        var ftp = new Jsftp({
            host: host
        });
        makeCall();
        ftp.keepAlive();


//        closeConnections(function() {
//            // make the FTP connection
//            ftp = new Jsftp({
//                host: host
//            });
//            makeCall();
//            ftp.keepAlive(15000);
//        });

        function makeCall() {
            // change to the appropriate directory. for some reason we can't do
            // the GET from the root directory
            ftp.raw.cwd(path, function(err) {

                if(err) {
                    console.log(err);
                }

                // all state FIPS codes are 2 digits, add a leading 0 if necessary
                var filename = filePre;
                if(stateID < 10)
                    filename += '0' + stateID;
                else
                    filename += stateID;
                filename += filePost;

                console.log("making ftp get at: " + host + path + filename);
                fs.mkdir('./tmp', 0700, function(err) {});
                ftp.get(filename,'./tmp/' + stateID +'.zip', function(err) {
                    console.log('get has returned');
                    if (err) {
                        console.log('There was an error retrieving state '
                            + stateID + ' geo: ' + err);
                        stateID = false;
                    }
                    callback.call(context||this, stateID);
                });
            });
        }
    };

    // Parses the the boundary response, extracting the information that
    // we'll need
    function parseBoundaryResponse(responseBody) {
        var parsedObj = {};
        var boundaryObj = JSON.parse(responseBody);

        for(var i = 0; i < boundaryObj.objects.length; i++) {
            var curGeoObj = boundaryObj.objects[i];
            // Process the place object
            if(curGeoObj.kind == "Place") {
                parsedObj.cityName = curGeoObj.name;
                parsedObj.placeID = curGeoObj.metadata.PLACEFP10;
                parsedObj.centroid = [curGeoObj.centroid.coordinates[1],
                    curGeoObj.centroid.coordinates[0]];
            // Process the county subdivision object
            } else if(curGeoObj.kind == "County Subdivision") {
                parsedObj.stateID = curGeoObj.metadata.STATEFP10;
            }
        }
        return parsedObj;
    };

    function closeConnections(callback) {
//        console.log("closing connections");
//        if(ftp !== undefined) {
//            ftp.destroy();
//            finishUp();
//        } else {
//            finishUp();
//        }
//
//        function finishUp() {
//            ftp = undefined;
//            if(callback)
//                callback.call(this);
//        }
        if(callback)
            callback.call(this);
    }

    return {
        closeConnections: closeConnections,
        getStateTracts: getStateTracts,
        getBoundaryLocation: getBoundaryLocation,
        getCensusTractPopulations: getCensusTractPopulations
    };

});
