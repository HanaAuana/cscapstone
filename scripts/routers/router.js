/**
 * Created by Nathan P on 1/25/14.
 */

var tag = "router";

define(['fs',
        'scripts/utils/capcon'],
       function(fs, capcon) {

    function route(pathname) {
        capcon.log(tag, "Routing pathname " + pathname);

        // If pathname specifies a file, serve up that file synchronously
        if(pathname.split(".").length > 1) {
            return fs.readFileSync(".." + pathname, 'utf-8');
        }
    }

    // These are the exports
    return {
        route: route
    };

});