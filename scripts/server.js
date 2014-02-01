/**
 * Created by Nathan P on 1/24/14.
 */

var tag = "server";

define(['http',
        'url',
        'fs',
        'scripts/utils/capcon'],
        function(http, url, fs, capcon) {

            // Starts the server with a router instance
            function start(route) {

                fs.readFile("../index.html", 'utf-8', function(error, html) {

                    if(error)
                        // uh oh, where's the index file?
                        throw error;

                    // Build the server. This is an http module function. Here
                    // the http response logic is specified as an (anonymous)
                    // function that we pass in to the method
                    http.createServer(function (req, res)
                    {
                        var pathname = url.parse(req.url).pathname;

                        // This needs to be cleaned up. For now, if the router
                        // returns an object that in turn becomes the text of
                        // the http response. Otherwise we server the index page
                        var routeResult = route(pathname);
                        if(routeResult !== undefined) {
                            res.writeHead(200, {
                                'Content-Type': 'text/javascript'
                            });
                            capcon.log(tag, "Writing js");
                            res.write(routeResult);
                        } else {
                            res.writeHead(200, {'Content-Type': 'text/html'});
                            // Serve up the static home page for now
                            res.write(html);
                        }
                        res.end();

                        // Send back an HTTP ack
                        capcon.log(tag, 'Received a request for ' + pathname);
                    }).listen(1337, '127.0.0.1');
                });
                capcon.log(tag, 'Server running at http://127.0.0.1:1337/');
            }

            // This is the requirejs "export". Anything returned via define()
            // constitutes what other scripts can do with this module.
            return {
                start: start // the start function
            };
        });