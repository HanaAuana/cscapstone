/**
 * Created by Nathan P on 1/24/14.
 */

var tag = "server";

define(['http',
    'url',
    'fs',
    'express',
    'scripts/utils/capcon'],
    function (http, url, fs, express, capcon) {

        // Starts the server with a router instance
        function start(route) {
            capcon.log(tag, "server has started");

            var app = express();

            app.use(express.logger());
            app.use(express.cookieParser());
            app.use(express.session({secret: '1234567890QWERTY'}));

            // app.VERB methods are strung together as middleware.
            // Check this out for a good explanation of the framework:
            // http://evanhahn.com/understanding-express-js/
            app.get('/', function (req, res) {
                // Serve the homepage asynchronously
                res.writeHead(200, {'Content-Type': 'text/html'});
                fs.readFile("index.html",
                    'utf-8',
                    function (error, html) {
                        if (error)
                        // uh oh, where's the index file?
                            throw error;
                        res.end(html);
                    });
            });

            app.get('/scripts/*', function (req, res) {
                // Serve up a script
                res.writeHead(200, {'Content-Type': 'text/javascript'});

                // Parse out the pathname
                var pathname = url.parse(req.url).pathname;
                capcon.log(tag, "serving .." + pathname);

                fs.readFile('./' + pathname, function(error, js) {
                    if(error)
                        throw error;
                    res.end(js);
                });
            });

            app.listen(1337, '127.0.0.1');
        };


        // This is the requirejs "export". Anything returned via define()
        // constitutes what other scripts can do with this module.
        return {
            start: start // the start function
        };
    });