/**
 * Created by Nathan P on 4/22/2014.
 */

define(['http',
    'xml2js'
], function(http, xml2js) {

    var date = '2014-02-21';
    var time = '9%3A20%20am';

    function doRoute(session, origin, dest, callback, context) {
        var url = 'http://transit.pugetsound.edu:8080/otp-rest-servlet/ws/plan'
                    + '?routerId=' + session
                    + '&fromPlace=' + origin[0] + ',' + origin[1]
                    + '&toPlace=' + dest[0] + ',' + dest[1] 
                    + '&date=' + date
                    + '&time=' + time;
        console.log(url);    
        var body = '';
        http.get(url, function(res) {
            // concatenate data chunks
            res.on('data', function(chunk) {
                body += chunk;
            }).on('end', function() {

                console.log(body);

                xml2js.parseString(body, function(err, result) {
                    if(err)
                        throw err

                    console.log(result);
                    callback.call(context||this, result);
                });
            });
        }).on('error', function(err) {
            console.log(err);
            callback.call(context||this, false);
        });
    }

    return {
        doRoute : doRoute
    }
});