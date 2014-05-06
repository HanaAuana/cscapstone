/**
 * Created by Nathan P on 3/13/14.
 *
 * A utility for pulling and cleaning geographic data via the census API
 * This should run in the background periodically, to check for any updates
 * to the data.
 */

define(['api/censusAPI',
    'fs',
    'utils/shp2json',
    'memorystream',
    'stream'
], function(censusAPI, fs, shp2json, MemoryStream, stream) {

    var MAX_TRIES = 3;
    var stateIDs = [01, 02, 04, 05, 06, 08, 09, 10, 11, 12, 13, 15, 16, 17, 18,
        19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
        37, 38, 39, 40, 41, 42, 44, 45, 46, 47, 48, 49, 50, 51, 53, 54, 55, 56];

    /**
     * Checks entire state geography table in database to ensure that all states
     * are present. If not, it pulls the appropriate geo data from the census
     * API
     */
    function checkGeographies(stateIdx) {
        if(!stateIdx)
            stateIdx = 8;
        else if(stateIdx >= 11) {//stateIDs.length)
            console.log('ending recursion');
            censusAPI.closeConnections();
            return;
        }

        // Check if state is already in database
        var result = checkDatabaseForState(stateIDs[stateIdx]);
        // If the state is already in the database, move on to the next state.
        // Otherwise, get the state geo via the API. It's callback will handle
        // recursing this method
        if(result === true) {
            checkGeographies(++stateIdx);
        } else {
            getStateGeoFromAPI(stateIdx, 0);
        }
    }

    /**
     * Checks the database for the specified state. Returns false if no match,
     * or the geoJson if there is a match
     * @param stateID ID of state, as specified by census bureau
     */
    function checkDatabaseForState(stateID) {
        console.log("checking db for stateID " + stateID)
        return false;
    }

    function getStateGeoFromAPI(stateIdx, tryNum) {
        var that = this;
        var stateID = stateIDs[stateIdx];
        censusAPI.getStateTracts(stateID, function(res) {
            onStateGeoReceived(stateID, stateIdx, res, tryNum);
        }, that);
    }

    function onStateGeoReceived(stateID, stateIdx, res, tryNum) {
        if(res === false) {
            if(tryNum === MAX_TRIES) {
                console.log('unable to retrieve geo for state ID ' + stateID);
            } else {
                console.log("retrying state " + stateID
                    + " retrieval, try " + tryNum);
                getStateGeoFromAPI(stateID, ++tryNum);
            }
        } else {
            console.log("state geo received");
            shpToJson(stateID, function(geoJson) {
                persistStateGeo(stateID, geoJson);

                // Check the next state
                checkGeographies(++stateIdx);
            });

        }
    }

    function persistStateGeo(stateID, geoJson) {
        fs.writeFile('./tmp/' + stateID + '.json', geoJson, function(err) {
            if(err)
                console.log("error writing to file: " + err);
        });
    }

    function shpToJson(stateID, callback) {

        // get the zip file
        var inStream = fs.createReadStream('./tmp/' + stateID + '.zip');

        var outStream = new stream.Stream;
        outStream.writable = true;

        var data = '';
        outStream.write = function (buf) {
            data += buf;
        };

        outStream.end = function () {
            // delete the temp shp zip file
            fs.unlinkSync('./tmp/' + stateID + '.zip');
            callback(data);
            outStream = null;
            inStream = null;
        };

        shp2json(inStream).pipe(outStream);
    }

    return {
        checkGeographies: checkGeographies
    };
});
