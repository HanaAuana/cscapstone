/**
 * Created by Nathan P on 3/7/14.
 */

define(['https',
    'json!config'
], function(https, globalvars) {

    function getTimezone(latLng, callback, context) {

        var timeSec = new Date().getTime() / 1000;

        var url = 'https://maps.googleapis.com/maps/api/timezone/json?location='
                    + latLng.d + ',' + latLng.e + '&sensor=false&timestamp='
                    + Math.floor(timeSec) + '&key=' + globalvars.gApiKey;
        var body ='';
        https.get(url, function(res) {
            // concatenate data chunks
            res.on('data', function(chunk) {
                body += chunk;
            // do callback when transmission has finished
            }).on('end', function() {
                callback.call(context||this, JSON.parse(body));
            })
        }).on('error', function() {
            callback.call(context||this, false);
        })
    };

    return {
        getTimezone: getTimezone
    };

});
