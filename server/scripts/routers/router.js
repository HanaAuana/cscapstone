/**
 * Created by Nathan P on 1/25/14.
 *
 * The flow of logic here might be confusing
 *      ---------------------
 *      getBoundaryLocation()
 *      - gets geodata associated with the lat/lng arg
 *          |
 *          getCensusTractPopulations()
 *          - gets the populations broken down by census tract in the place
 *              |
 *              getCityTractGeo()
 *              - returns a GeoJson containg shapes of all census tracts in
 *                the place, along with population and employment density *
 *      -------------------
 *      getStateTracts()
 *      - gets timezone for specified lat/lng
 *
 * Each of these methods checks if it's the last to complete. Only then is the
 * HTTP response sent
 */

define(['api/censusAPI',
    'api/googleStaticAPI',
    'fs',
    'sim/citytracts',
    'sim/SimulationGenerator',
    'api/drivingDirectionsAPI',
    'database/connect'
], function(censusAPI, 
            googleStaticAPI, 
            fs, 
            cityTracts, 
            SimulationGenerator, 
            drivingDirections, 
            connect) {

    var completedSteps;
    var SUBWAY_SPEED_KPH = 40;

    function checkCallsFinished(request, response, cityModel) {

        // Wait until all steps have completed
        for(var step in completedSteps) {
            if(completedSteps[step] === false) {
                return;
            }
        }

        var results = {
            city: cityModel,
            sessionID: request.sessionID
        };

        // Send back the modified body
        response.send(JSON.stringify(results));
        console.log('sent sim session response');

        SimulationGenerator.makeTrips(cityModel.censusTracts,
                                      cityModel.stateID,
                                      cityModel.placeID,
                                      function(result) {
            // Trips have been generated
        });
    }

    function onBoundaryResponse(cityModel, request, appResponse, geoObj, context) {

        if(geoObj === false) {
            console.log("boundary fails");
            appResponse.writeHead(404);
            appResponse.send();
            return;
        }

        cityModel.cityName = geoObj.cityName;
        cityModel.centroid = geoObj.centroid;
        cityModel.stateID = geoObj.stateID;
        cityModel.placeID = geoObj.placeID;
        console.log('setting geo data: \r\n ' + JSON.stringify(geoObj));

        cityTracts.getCityTractsGeo(cityModel.stateID, cityModel.placeID,
            function(result) {
                // TODO handle city geo json
                cityModel.censusTracts = result.cityTracts;
                cityModel.boundary = result.cityBoundary;
                completedSteps.cityTracts = true;
                checkCallsFinished(request, appResponse, cityModel)
            }, this);
    }

    function onCensusTractPopResponse(cityModel, request,
                                      appResponse, cityPops, context) {

        if(cityPops === false) {
            completedSteps.cityTracts = true;
            checkCallsFinished(request, appResponse, cityModel);
            return;
        }

        cityTracts.getCityTractsGeo(cityModel.stateID, cityModel.countyID,
            cityModel.placeID, cityPops, function(geoJson) {
                // TODO handle city geo json
                cityModel.censusTracts = geoJson;
                completedSteps.cityTracts = true;
                checkCallsFinished(request, appResponse, cityModel);
            }, this);
    }

    function onStateTractResponse(cityModel, request, appResponse, res, context) {
        if(res === false) {
            console.log("error retrieving state census tractrs")
        } else {
            console.log('got state tract callback, file length ' + res.length);
            fs.writeFile('./tract.zip', res, function(err) {
                if(err)
                    console.log("error writing file")
                else
                    console.log("file saved");
            });
        }

        completedSteps.stateTracts = true;
        checkCallsFinished(request, appResponse, cityModel)
    }

    function simSessionRoute(request, response) {

        // keep track of how many calbacks have returned
        completedSteps = {
            timezone: false,
            cityTracts: false
        };

        var that = this;
        // A put means this is a new model. We nee to do all the initializing
        // stuff, including setting the city, getting all geo, and generating
        // trips
        if(request.route.method === 'put') {
            console.log('handling put');

            var cityModel = request.body.city;

            // get the city name, boundary and centroid
            censusAPI.getBoundaryLocation(cityModel.location, function(res) {
                onBoundaryResponse(cityModel, request, response, res, that);
            }, this);

            // get the timezone
            googleStaticAPI.getTimezone(cityModel.location, function(res) {
                if(res === false) {
                    console.error("TZ fails");
                    // TODO error handling
                } else {
                    // If successful, grab the timezone
                    cityModel.timezone = res.timeZoneId;
                    console.log('Setting TZ: ' + cityModel.timezone);
                }
            	completedSteps.timezone = true;
            	checkCallsFinished(request, response, cityModel);
            }, this);

        } else if(req.route.method === 'post') {
            console.log('handle post');
        }
    }

    /**
     * Called when syncing transit routes
     * @param request
     * @param response
     */
    function routeSyncRoute(request, response) {

        // Pull out the route feature
        var routeFeature = null;
        var routeFeatureIdx = -1;
        var features = request.body.geoJson.features;
        for(var i = 0; i < features.length; i++) {
            if(features[i].properties.geoType === "route") {
                routeFeature = features[i];
                routeFeatureIdx = i;
                break;
            }
        }

        console.log("Route Feature \r\n %j", routeFeature);
        // Snap that route to roads by getting driving directions between each
        // pair of points
        drivingDirections.getRoute(routeFeature.geometry.coordinates,
                                    function(result) {
            if(!result) {
                response.statusCode = 500;
                response.send();
            } else {
                // Put the new route in the geoJSON
                routeFeature.geometry = result.routeShape;

                // Stringify and send the response
                response.send(JSON.stringify(features));
            }
            console.log('sent route sync response');
        }, this);
    }

    function authRoute(request, response){
        var that = this;
        var sessionID = request.query.session;
        var isNew = request.query.isNew;
        if(isNew){
            connect.makeSessAuth(sessionID, function(result){
                if(result === true){
                    response.send({
                        result: "duplicate_session",
                        code: 0
                    });
                }
                else{
                    response.send({
                        result: "no_session",
                        code: 1
                    });
                }
            });
        } else {
            connect.makeSessAuth(sessionID, function(result){
                if(result === false){
                    response.send({
                        result: "no_session",
                        code: 1
                    });
                } else {
                    handleSessionRestore(request, response, sessionID);
                }
            });
        }
    }

    function handleSessionRestore(request, response, sessionID) {

        var sessionData = {};

        connect.makeSessQuery(sessionID, function(queryResult) {

            if(queryResult === false){
                console.log("MAJOR ERROR");
                response.writeHead(500, {});
                response.send();
            } else {
                sessionData = queryResult;
                var geoID = sessionData.fips;

                // Get city tract and boundary data
                var stateID = geoID.substring(0, 2);
                var placeID = geoID.substring(2, geoID.length);
                cityTracts.getCityTractsGeo(stateID, placeID, function(cityResult) {
                    sessionData.city.censusTracts = cityResult.cityTracts;
                    sessionData.city.cityBoundary = cityResult.cityBoundary;
                    response.send(JSON.stringify(sessionData));
                }, this);                
            }
        }, this);
    }

    function newStopRoute(request, response) {
        // Grab origin and destination points
        var from = request.query.from.split(',');
        var to = request.query.to.split(',');
        var mode = request.query.mode;

        var responseBody = {
            inboundTime: null,
            outboundTime: null
        }

        switch(mode) {
            case 'bus':
                console.log("New stop: doing bus routing");
                // Get the outbound time
                drivingDirections.getRoute([from, to], function(result) {
                    if(result === false) {
                        console.log('Unable to route between ' + from + ' and ' + to);
                        response.writeHead(500, {});
                        response.send();
                    } else {
                        responseBody.outboundTime = result.time;
                        if(responseBody.inboundTime !== null)
                            response.send(JSON.stringify(responseBody));
                    }
                }, this);

                // And get the inbound time
                drivingDirections.getRoute([to, from], function(result) {
                    if(result === false) {
                        console.log('Unable to route between ' + from + ' and ' + to);
                        response.writeHead(500, {});
                        response.send();
                    } else {
                        responseBody.inboundTime = result.time;
                        if(responseBody.outboundTime !== null)
                            response.send(JSON.stringify(responseBody));
                    }
                }, this);
                break;
            case 'subway':
                console.log("New stop: doing subway routing");
                var distanceKm = getDistanceFromLatLonInKm(from[1], from[0],
                                                             to[1], to[0]);
                // Calculate time and convert to seconds
                var timeSec = (distanceKm / SUBWAY_SPEED_KPH) * 3600;
                responseBody.inboundTime = timeSec;
                responseBody.outboundTime = timeSec;
                response.send(JSON.stringify(responseBody));
                break;
        }   
        
    }

    // Convert the distance between lat/lng points to kilometers
    // From: http://stackoverflow.com/questions/27928/how-do-i-calculate-distance-between-two-latitude-longitude-points
    function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLon = deg2rad(lon2-lon1); 
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) 
                + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2))
                * Math.sin(dLon/2) * Math.sin(dLon/2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI/180)
    }

    // These are the exports
    return {
        simSession: simSessionRoute,
        routeSync: routeSyncRoute,
        routeAuth: authRoute,
        newStop: newStopRoute
    };

});
