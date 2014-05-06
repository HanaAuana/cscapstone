/**
 * Created by Nathan P on 4/22/2014.
 */

define(['http',
    'xml2js',
    'json!config'
], function(http, xml2js, config) {

    var baseUrl = config.otpUrl;
    var otpPort = config.otpPort;
    var date = '2050-02-21';
    var time = '9%3A20%20am';

    function doRoute(session, origin, dest, callback, context) {
        var finished = false;
        var url = 'http://' + baseUrl + ':' + otpPort + '/otp-rest-servlet/ws/plan'
                    + '?routerId=' + session
                    + '&fromPlace=' + origin[1] + ',' + origin[0]
                    + '&toPlace=' + dest[1] + ',' + dest[0]
                    + '&date=' + date
                    + '&time=' + time;
        // console.log(url);    
        var body = '';
        var request = http.get(url, function(res) {
            // concatenate data chunks
            res.on('data', function(chunk) {
                body += chunk;
            }).on('end', function() {
                finished = true;
                callback.call(context||this, JSON.parse(body));
            });
        }).on('error', function(err) {
            console.log(err);
            finished = true;
            callback.call(context||this, false);
        });

        // Ensure a callback occurs
        setTimeout(function() {
            if(!finished) {
                console.log("Multimodal route request timeout");
                request.abort();
                callback.call(context||this, false);
            }
        }, 2000);
    }

    /**
     * Requests OTP to load/reload the graph for the specified session
     * @param routeId Session to reload graph
     * @param callback
     */
    function reloadRoute(routeId, callback, context) {

        var options = {
            hostname: baseUrl,
            port: otpPort,
            path: '/otp-rest-servlet/ws/routers/' + routeId,
            method: 'PUT'
        };

        console.log('Requesting OTP graph reload at: ' + options.path);
        var req = http.request(options, function(res) {
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function(data) {
      
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
