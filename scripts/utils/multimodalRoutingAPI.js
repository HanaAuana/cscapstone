/**
 * Created by Nathan P on 4/22/2014.
 */

define(['http',
    'xml2js'
], function(http, xml2js) {

    var baseUrl = 'transit.pugetsound.edu'
    var date = '2014-02-21';
    var time = '9%3A20%20am';

    function doRoute(session, origin, dest, callback, context) {
        var url = 'http://' + baseUrl + ':8080/otp-rest-servlet/ws/plan'
                    + '?routerId=' + session
                    + '&fromPlace=' + origin[1] + ',' + origin[0]
                    + '&toPlace=' + dest[1] + ',' + dest[0]
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
                        console.log("XML Parsing error: " + err);

                    console.log(result);
                    callback.call(context||this, result);
                });
            });
        }).on('error', function(err) {
            console.log(err);
            callback.call(context||this, false);
        });
    }

    /**
     * Requests OTP to load/reload the graph for the specified session
     * @param routeId Session to reload graph
     * @param callback
     */
    function reloadRoute(routeId, callback, context) {

        var options = {
            hostname: baseUrl,
            port: 8080,
            path: '/otp-rest-servlet/ws/routers/' + routeId,
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
                if(callback)
                    callback.call(context||this, res.statusCode);
            });
        });
        req.end();
    }

    /**
     * Requests a graph eviction for the specified graph to minimize OTP's
     * memory footprint
     * @param routeId evict specified routeId's graph
     */
    function evictRoute(routeId, callback, context) {
        var options = {
            hostname: baseUrl,
            port: 8080,
            path: '/otp-rest-servlet/ws/routers/' + routeId,
            method: 'DELETE'
        };

        console.log('Requesting OTP graph eviction at: ' + options.path);
        var req = http.request(options, function(res) {

            res.setEncoding('utf8');
            res.on('data', function(data) {
                //console.log(data);
            }).on('end', function() {
                console.log('Graph eviction complete, code ' + res.statusCode);
                if(callback)
                    callback.call(context||this, res.statusCode);
            });
        });
        req.end();
    }

    return {
        evictRoute: evictRoute,
        reloadRoute: reloadRoute,
        doRoute : doRoute
    }
});