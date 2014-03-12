/**
 * Created by Nathan P on 3/6/14.
 */

define(['http'
], function(http) {

    // The experimental census boundary location api, defined at:
    // http://census.ire.org/docs/boundary.html
    function getBoundaryLocation (longLat, callback, context) {
        var lat = longLat.d;
        var lng = longLat.e;
        var url = 'http://census.ire.org/geo/1.0/boundary/?contains=' + lat + ','
            + lng + '&sets=places'

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
                callback.call(context||this, JSON.parse(body));
            })
        }).on('error', function() {
            callback.call(context||this, false);
        });
    };

    return {
        getBoundaryLocation: getBoundaryLocation
    };

});
