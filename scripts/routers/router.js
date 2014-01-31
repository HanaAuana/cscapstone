/**
 * Created by Nathan P on 1/25/14.
 */


define(['fs'], function(fs) {

    function route(pathname) {
        console.log("Routing pathname " + pathname);

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

//var fs = require('fs');
//function route(pathname) {
//    console.log("Routing pathname " + pathname);
//
//    // If pathname specifies a file, serve up that file synchronously
//    if(pathname.split(".").length > 1) {
//        return fs.readFileSync(".." + pathname, 'utf-8');
//    }
//}
//
//exports.route = route;