define(['scripts/database/connect', 
		'weighted',
		'clipper',
		'scripts/models/Trip',
		'scripts/models/citytracts',
		'geojson-utils',
        'fs'
], function(connect, weighted, clipper, Trip, citytracts, geojsonUtils, fs) {


	//Check to see if there are trips already generated...
	function checkTrips(cityTract, callback){
//		var that = this;
//		connect.makeTripQuery(cityTract, function(result){
//			if(result === false){
//	            callback.call(that, false);
//			} else{
//	            callback.call(that, result);
//	          }
//	    }, this);
        callback.call(this, false);
	}

	function genTrips(cityTracts, fips, callback, context){
		checkTrips(fips, function(result){
			if(result === false) {
				var popList = {};
				var empList = {};
				var features = cityTracts.features;
				for(var ii = 0; ii < features.length; ii++){
					var feature = features[ii];
					var tractID = feature.properties.COUNTYFP + feature.properties.TRACTCE;
					popList[tractID] =  parseInt(feature.properties.population);
					empList[tractID] =  parseInt(feature.properties.employment);
				}

                result = generateEndpoints(features, popList, empList);
			}

            writeTripPoints(result);

            console.log("trip gen complete");
			callback.call(context||this, result);
		});
	}

	function randomPointInPolygon(geojson){
		var coords = (geojson.geometry.type == "Polygon") ? [geojson.geometry.coordinates] : geojson.geometry.coordinates;
		var bboxes = [];
		for (var i = 0; i < coords.length; i++) {
      		bboxes.push(geojsonUtils.boundingBoxAroundPolyCoords(coords[i]));
    	}
		var hit = false;
		while(!hit){
			var box = bboxes[Math.floor(Math.random() * bboxes.length)];
			var point = {
				type: "Point",
				coordinates: [
					((Math.random() * (box[1][1] - box[0][1])) + box[0][1]),
					((Math.random() * (box[1][0] - box[0][0])) + box[0][0])
				]
			};
			var result;
			if(geojson.geometry.type == "Polygon"){
				result = geojsonUtils.pointInPolygon(point, geojson.geometry);
			} else {
				result = geojsonUtils.pointInMultiPolygon(point, geojson.geometry);
			}
			if(result)
				return point;
		}
	}

    function generateEndpoints(features, popList, empList) {
        var trips = [];
        for(var j = 0; j < 1000; j++){
            var currTrip = new Trip(j, weighted.select(popList), weighted.select(empList));
            trips.push(currTrip);
        }

        for(var k = 0; k < trips.length; k++){
            var curTrip = trips[k];
            var tract1Bound = null;
            var tract2Bound = null;

            for(var l = 0; l < features.length; l++){
                var feat = features[l];
                var tractID = feat.properties.COUNTYFP + feat.properties.TRACTCE;
                if(tractID === curTrip.tract1){
                    tract1Bound = feat;
                }
                if(tractID === curTrip.tract2){
                    tract2Bound = feat;
                }
                if(tract1Bound !== null && tract2Bound !== null){
                    break;
                }
            }
            curTrip.origin = randomPointInPolygon(tract1Bound);
            curTrip.dest = randomPointInPolygon(tract2Bound);
        }
        return trips;
    }

    function writeTripPoints(trips) {
        var points = {
            type: 'FeatureCollection',
            features: []
        };
        console.log(trips.length);
        for(var i = 0; i < trips.length; i++) {
            var feature1 = {
                type: "Feature",
                geometry: result[i].origin,
                properties: {}
            };

            var feature2 = {
                type: "Feature",
                geometry: trips[i].dest,
                properties: {}
            };
            points.features.push(feature1);
            points.features.push(feature2);
        }
        fs.writeFileSync('./tmp/tripPoints.json', JSON.stringify(points));
    }

	return {
		makeTrips : genTrips,
		testPointNPoly : randomPointInPolygon
	}

});