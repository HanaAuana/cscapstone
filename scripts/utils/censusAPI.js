/*
 * Created by Nathan P on 3/6/14.
 *
 * Provides access to the census API
 *
 * The flow of API calls here might be confusing, some are dependent on others
 *      ---------------------
 *      getBoundaryLocation()
 *          Given a lat/lng coordinate, provides encompassing census geographies
 *          Allows for and explicitly calls:
 *          ---------------------------
 *          getCensusTractPopulations()
 *              Given state, county, county subdivision and place geoIDS,
 *              gets populations for all census tracts in the place.
 *              Allows for, but doesn't call:
*       -------------------
*       getStateTracts()
*       Gets a shapefile of all census tracts for a specified state
*       THIS IS EXPENSIVE! Cache these results as best as possible
 */

define(['http',
    'scripts/utils/globalvars',
    'jsftp'
], function(http, globalvars, jsftp) {

    // defined at:
    // https://www.census.gov/developers/data/acs_5yr_2010_var.xml
    var totalRace = 'B02001_001E';
    var totalPop = 'B01003_001E';

    function getCensusTractPopulations(stateID, countyID,
                             countySubdivID, placeID, callback, context) {

        // put all the geoIDs into the url
        var url = 'http://api.census.gov/data/2010/acs5?key=' + globalvars.censusKey
            + '&get=' + totalRace + '&for=tract:*&in=state:' + stateID
            + '+county:' + countyID + '+county+subdivision:' + countySubdivID
            + '+place:' + placeID;

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


    function getStateTracts(stateID, callback, context) {

        var path = 'geo/tiger/TIGER2013/TRACT/';
        var filePre = 'tl2013_';
        var filePost = '_tract.zip';

        var ftp = new jsftp({
            host: 'ftp2.census.gov'
        });

        console.log("made ftp connection");

        var file = ""; // Will store the contents of the file
        ftp.get(path + filePre + stateID + filePost, function(err, socket) {
            if (err) return;

            socket.on("data", function(d) {
                file += d.toString();
            });
            socket.on("close", function(hadErr) {
                if (hadErr)
                    console.error('There was an error retrieving the file.');
            });
            socket.resume();
        });
    };

    // Parses the the boundary response, extracting the information that
    // we'll need
    function parseBoundaryResponse(responseBody) {
        var parsedObj = {
            stateID: '',
            countyID: '',
            countySubdivID: '',
            placeID: '',
            cityName: '',
            centroid: null
        }
        var boundaryObj = JSON.parse(responseBody);

        for(var i = 0; i < boundaryObj.objects.length; i++) {
            var curGeoObj = boundaryObj.objects[i];
            // Process the place object
            if(curGeoObj.kind == "Place") {
                parsedObj.cityName = curGeoObj.name;
                parsedObj.placeID = curGeoObj.metadata.PLACEFP10;
                parsedObj.centroid = [curGeoObj.centroid.coordinates[1],
                    curGeoObj.centroid.coordinates[0]]
            // Process the county subdivision object
            } else if(curGeoObj.kind == "County Subdivision") {
                parsedObj.stateID = curGeoObj.metadata.STATEFP10;
                parsedObj.countyID = curGeoObj.metadata.COUNTYFP10;
                parsedObj.countySubdivID = curGeoObj.metadata.COUSUBFP10;
            }
        }
        return parsedObj;
    };

    return {
        getStateTracts: getStateTracts,
        getBoundaryLocation: getBoundaryLocation,
        getCensusTractPopulations: getCensusTractPopulations
    };

});
