/**
 * Created by Nathan P on 1/24/14.
 */

define(['http',
    'url',
    'fs',
    'express'
], function (http, url, fs, express) {

    // Starts the server with a router instance
    function start(route) {
        console.log("server : server has started");

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

        // TODO: make this regex
        app.get('/assets/sampleGeoJson.json', function(req, res) {

            res.writeHead(200, {'Content-Type': 'application/json'});

            // Parse out the pathname
            var pathname = url.parse(req.url).pathname;
            console.log("server : serving " + pathname);

            fs.readFile('./' + pathname, function(error, json) {
                if(error)
                    throw error;
                res.end(json);
            });
        });

        app.get('/scripts/*', function (req, res) {
            // Serve up a script
            res.writeHead(200, {'Content-Type': 'text/javascript'});

            // Parse out the pathname
            var pathname = url.parse(req.url).pathname;
            console.log("server : serving " + pathname);

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