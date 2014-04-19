/**
 * Created by Nathan P on 1/24/14.
 */

define(['http',
    'url',
    'fs',
    'express',
    'scripts/routers/router',
    'scripts/routers/gtfsRouter'
], function (http, url, fs, express, router, gtfsRouter) {

    // Starts the server with a router instance
    function start(route) {
        console.log("server : server has started");

        var app = express();

        app.use(express.logger());
        app.use(express.cookieParser());
        app.use(express.session({secret: '1234567890QWERTY'}));
        app.use(express.bodyParser({limit: '5mb'}));
        // Express will serve up anything in the following folders as static
        // assets
        app.use(express.static('scripts'));
        app.use(express.static('assets'));
        app.use(express.static('templates'));

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

        app.get('/map', function (req, res) {
            // Serve the homepage asynchronously
            res.writeHead(200, {'Content-Type': 'text/html'});
            fs.readFile("./map/index.html",
                'utf-8',
                function (error, html) {
                    if (error)
                    // uh oh, where's the index file?
                        throw error;
                    res.end(html);
                });
        });

        // All saves/fetches for the simulation model
        app.all('/sim_session/*', function(req, response) {
            router.simSession(req, response);
        });

        app.all('/route_sync/*', function(req, response) {
            router.routeSync(req, response);
        });

        app.all(/^\/update_ridership/, function(req, response) {

            gtfsRouter.updateRidership(req, response);
            console.log("got update ridership request");
        });

        app.listen(1337, '127.0.0.1');
    };


    // This is the requirejs "export". Anything returned via define()
    // constitutes what other scripts can do with this module.
    return {
        start: start // the start function
    };
});
