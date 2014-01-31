/**
 * Created by Nathan P on 1/24/14.
 */

//var http = require('http'); // Require the http module (like an import)
//var url = require("url");
//var file = require("fs"); // The file module
//
//function start(route) {
//
//    file.readFile("../index.html", 'utf-8', function(error, html) {
//
//        if(error)
//            throw error;
//
//        // Build the server! This is an http module function. Here the http
//        // response logic is specified as an (anonymous) function that we
//        // pass in to the method
//        http.createServer(function (req, res)
//        {
//            var pathname = url.parse(req.url).pathname;
//
//            var routeResult = route(pathname);
//            if(routeResult !== undefined) {
//                res.writeHead(200, {'Content-Type': 'text/javascript'});
//                console.log("Writing js");
//                res.write(routeResult);
//            } else {
//                res.writeHead(200, {'Content-Type': 'text/html'});
//                // Serve up the static home page for now
//                res.write(html);
//            }
//            res.end();
//
//            // Send back an HTTP ack
//            console.log('Received a request for ' + pathname);
//        }).listen(1337, '127.0.0.1');
//    });
//    console.log('Server running at http://127.0.0.1:1337/');
//}
//
//// Make start a "public" attribute of this module.
//exports.start = start;

define(['http',
        'url',
        'fs'],
        function(http, url, fs) {

            function start(route) {

                fs.readFile("../index.html", 'utf-8', function(error, html) {

                    if(error)
                        throw error;

                    // Build the server! This is an http module function. Here the http
                    // response logic is specified as an (anonymous) function that we
                    // pass in to the method
                    http.createServer(function (req, res)
                    {
                        var pathname = url.parse(req.url).pathname;

                        var routeResult = route(pathname);
                        if(routeResult !== undefined) {
                            res.writeHead(200, {'Content-Type': 'text/javascript'});
                            console.log("Writing js");
                            res.write(routeResult);
                        } else {
                            res.writeHead(200, {'Content-Type': 'text/html'});
                            // Serve up the static home page for now
                            res.write(html);
                        }
                        res.end();

                        // Send back an HTTP ack
                        console.log('Received a request for ' + pathname);
                    }).listen(1337, '127.0.0.1');
                });
                console.log('Server running at http://127.0.0.1:1337/');
            }

            return {
                start: start
            };
        });