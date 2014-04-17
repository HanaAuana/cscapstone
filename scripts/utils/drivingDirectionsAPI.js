/**
 * Created by Nathan P on 4/9/2014.
 */

define(['http', 'scripts/utils/globalvars'], function(http, globalvars) {
    
    function routeGraphhopper(waypoints, callback, context) {
        var url = "http://transit.pugetsound.edu:8989/route?"
            + "instructions=false&type=json&points_encoded=true";
        for (var i = 1; i < waypoints.length; i++) {
            var coordinate = waypoints[i];
            url += "&point=" + coordinate[0] + "," + coordinate[1];
        }

        var body ='';
        http.get(url, function(res) {
            // concatenate data chunks
            res.on('data', function(chunk) {
                body += chunk;
                // do callback when transmission has finished
            }).on('end', function() {

                console.log(body);

                var responseJson = JSON.parse(body);
                var parsedJson = {
                    time: responseJson.paths[0].time,
                    distance: responseJson.paths[0].distance
                };

                // ADAPTED FROM GRAPHHOPPER CODE
                // convert encoded polyline stuff to normal json
                if (json.paths[0].points) {
//                    var tmpArray = decodePath(json.route.coordinates, true);
                    var tmpArray = decodePath(json.paths[0].points, true);
                    parsedJson.routeShape = {
                        "type": "LineString",
                        "coordinates": tmpArray
                    };
                } else
                    console.log("No encoded polyline data");

                callback.call(context||this, parsedJson);
            })
        }).on('error', function() {
            callback.call(context||this, false);
        })
    }

    function routeMapquest(waypoints, callback, context) {
        var key = globalvars.mapquestKey;
        var url = 'http://open.mapquestapi.com/directions/v2/route?key=' + key
                + '&ambiguities=ignore&outFormat=json&generalize=0'
                + '&outShapeFormat=raw';

        for (var i = 0; i < waypoints.length; i++) {
            var coordinate = waypoints[i];
            if(i === 0)
                url += "&from=";
            else
                url += '&to=';
            url += coordinate[1] + "," + coordinate[0]
        }

        console.log(url);
        var body ='';
        http.get(url, function(res) {
            // concatenate data chunks
            res.on('data', function(chunk) {
                body += chunk;
                // do callback when transmission has finished
            }).on('end', function() {

                var responseJson = JSON.parse(body);
                var parsedJson = false;

                // Check for a vaild response
                if(responseJson.info.statuscode !== 0) {
                    console.log('Response ' + responseJson.info.statuscode
                                    + ". " + responseJson.info.messages);
                } else {
                    parsedJson = {
                        time: responseJson.time,
                        distance: responseJson.distance,
                        routeShape: {
                            type: "LineString",
                            coordinates: []
                        }
                    };

                    var points = responseJson.route.shape.shapePoints;
                    for (var i = 1; i < points.length; i+=2) {
                        var coord = [points[i], points[i-1]];
                        parsedJson.routeShape.coordinates.push(coord);
                    }
                }
                callback.call(context||this, parsedJson);
            })
        }).on('error', function(err) {
            console.log(err);
            callback.call(context||this, false);
        })
    }

    /**
     * From Graphhopper, for decoding paths into GeoJSON
     * @param encoded The encoded string
     * @param geoJson True if output coordinate array should be formatted
     *                for GeoJSON
     * @returns {Array}
     */
    function decodePath(encoded, geoJson) {
        var start = new Date().getTime();
        var len = encoded.length;
        var index = 0;
        var array = [];
        var lat = 0;
        var lng = 0;

        while (index < len) {
            var b;
            var shift = 0;
            var result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            var deltaLat = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lat += deltaLat;

            shift = 0;
            result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            var deltaLon = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lng += deltaLon;

            if(geoJson)
                array.push([lng * 1e-5, lat * 1e-5]);
            else
                array.push([lat * 1e-5, lng * 1e-5]);
        }
        var end = new Date().getTime();
        console.log("decoded " + len + " coordinates in " + ((end - start)/1000)+ "s");
        return array;
    }

    return {
//        getRoute: routeGraphhopper
        getRoute: routeMapquest
    };

});