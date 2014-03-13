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

    function onBoundaryResponse(cityModel, request, appResponse, geoObj, context) {

        if(cityModel === false) {
            console.log("boundary fails");
            appResponse.writeHead(404);
            appResponse.send();
            return;
        }

        cityModel.cityName = geoObj.cityName;
        console.log('setting name: ' + cityModel.cityName);
        cityModel.centroid = geoObj.centroid;
        cityModel.stateID = geoObj.stateID;
        cityModel.countyID = geoObj.countyID;
        cityModel.countySubdivID = geoObj.countySubdivID;
        cityModel.placeID = geoObj.placeID;
        console.log('setting centroid: ' + cityModel.centroid.toString());

        completedAPIs[0] = true;

        // Now get the census tract population info
        censusAPI.getCensusTractPopulations(cityModel.stateID,
            cityModel.countyID, cityModel.countySubdivID, cityModel.placeID,
            function(res) {
                onCensusTractPopResponse(cityModel, request, appResponse,
                    geoObj, context)
            });
    }

    function onTzResponse(cityModel, request, appResponse, res, context) {
        if(cityModel === false) {
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

    function onCensusTractPopResponse(cityModel, request, appResponse, res, context) {

//        console.log("about to do state tracts call");

//        censusAPI.getStateTracts(cityModel.stateID, function(res) {
//            console.log('got state tract callback');
//
//            completedAPIs[3] = true;
//            checkCallsFinished(request, appResponse, cityModel)
//        }, context);

        completedAPIs[2] = true;
        checkCallsFinished(request, appResponse, cityModel)
    }

    function simSessionRoute(req, response) {

        // keep track of how many calbacks have returned
        completedAPIs = [false, false, false];

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