/**
 * Created by Nathan P on 1/25/14.
 */

define(['scripts/utils/censusAPI',
    'scripts/utils/googleStaticAPI'
], function(censusAPI, googleStaticAPI) {

    var completedAPIs;

    function checkCallsFinished(request, response, cityModel) {
        for(var i = 0; i < completedAPIs.length; i++) {
            if(!completedAPIs[i])
                return;
        }

        var results = {
            city: cityModel,
            sessionID: request.sessionID
        };

        // Send back the modified body
        response.send(JSON.stringify(results));
        console.log('sent sim session response');
    }

    function onBoundaryResponse(cityModel, request, appResponse, res, context) {

        if(res === false) {
            console.log("boundary fails");
            appResponse.writeHead(404);
            appResponse.send();
            return;
        }

        var geoObj = res.objects[0];
        cityModel.cityName = geoObj.name;
        console.log('setting name: ' + cityModel.cityName);
        // swap lat/lng for consistency
        cityModel.centroid = [geoObj.centroid.coordinates[1],
            geoObj.centroid.coordinates[0]];
        cityModel.stateID = geoObj.metadata.STATEFP10;
        console.log('setting centroid: ' + cityModel.centroid.toString());

        completedAPIs[0] = true;
        checkCallsFinished(request, appResponse, cityModel)
    }

    function onTzResponse(cityModel, request, appResponse, res, context) {
        if(res === false) {
            console.log("tz fails");
            appResponse.writeHead(404);
            appResponse.send();
            return;
        }

        // If successful, grab the timezone
        cityModel.timezone = res.timeZoneId;
        console.log('setting tz: ' + cityModel.timezone);

        completedAPIs[1] = true;
        checkCallsFinished(request, appResponse, cityModel);
    }

    function simSessionRoute(req, response) {

        completedAPIs = [false, false];

//        response.writeHead(200, {'Content-Type': 'application/json'});

        var that = this;
        // A put means this is a new model. We nee to do all the initializing
        // stuff, including setting the city, getting all geo, and generating
        // trips
        if(req.route.method === 'put') {
            console.log('handling put');

            var cityModel = req.body.city;

            // get the city name, boundary and centroid
            censusAPI.getBoundaryLocation(req.body.city.location, function(res) {
                onBoundaryResponse(cityModel, req, response, res, that)
            }, this);

            // get the timezone
            googleStaticAPI.getTimezone(req.body.city.location, function(res) {
                onTzResponse(cityModel, req, response, res, that);
            }, this);

        } else if(req.route.method === 'post') {
            console.log('handle post');
        }
    }

    // These are the exports
    return {
        simSession: simSessionRoute
    };

});