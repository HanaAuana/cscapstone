/**
 * Created by Nathan P on 4/18/2014.
 */

define(['fs',
    'url',
    'child_process'
], function(fs, url, childProcess) {

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

    }


    return {
        updateRidership: updateRidership
    }
});