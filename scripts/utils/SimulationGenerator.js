define(['scripts/database/connect', 
		'weighted',
		'clipper',
		'scripts/models/Trip',
		'scripts/models/citytracts',
		'geojson-utils',
		'scripts/utils/drivingDirectionsAPI',
		'fs'
], function(connect, weighted, clipper, Trip, citytracts, geojsonUtils, drivingDirections, fs) {
	var MIN_TRIP_TIME = 480;

	//Check to see if there are trips alread generated...
	function checkTrips(cityTract, callback){

		var that = this;
		connect.makeTripQuery(cityTract, function(result){
			if(result === false){
	            callback.call(that, false);
			} else{
	            callback.call(that, result);
	          }
	    }, this);
	}

	function genTrips(cityTracts, fips, callback, context){
		checkTrips(fips, function(result){
			if(result === false){
				var testSet = [];
				var popList = {};
				var empList = {};
				var features = cityTracts.features;
				for(var i = 0; i < features.length; i++){
					var feat = features[i];
					var tractID = feat.properties.COUNTYFP + feat.properties.TRACTCE;
					popList[tractID] =  parseInt(feat.properties.population);
					empList[tractID] =  parseInt(feat.properties.employment);
				}
				//console.log(popList);
				//console.log(empList);
				var trips = [];
				for(var j = 0; j < 10; j++){
					trips.push(new Trip(j));
				}
					var isValid = false;
					var curTrip = new Trip(j);
					while(!isValid) {
						curTrip.tract1 =  weighted.select(popList);
						curTrip.tract2 =  weighted.select(popList);
						if(testSet.indexOf(curTrip.tract1) < 0){
							testSet.push(curTrip.tract1);
						}if(testSet.indexOf(curTrip.tract2) < 0){
							testSet.push(curTrip.tract2);
						}
						console.log("Tract1:" + curTrip.tract1);
						console.log("Tract2:" + curTrip.tract2);
						var tract1Bound;
						var tract2Bound;					

						for(var l = 0; l < features.length; l++){
							var feat = features[l];
							var tractID = feat.properties.COUNTYFP + feat.properties.TRACTCE;
							if(tractID == curTrip.tract1){
								tract1Bound = feat;
							}
							if(tractID == curTrip.tract2){
								tract2Bound = feat;
							}
							if(tract1Bound === null && tract2Bound === null){
								break;
							}
						}
						curTrip.origin = randomPointInPolygon(tract1Bound);
						curTrip.dest = randomPointInPolygon(tract2Bound);
						drivingDirections.getRoute([curTrip.origin.coordinates, curTrip.dest.coordinates], function(result){
							if(result !== false){
								console.log(result.time);
								if(result.time >= MIN_TRIP_TIME){
									isValid = true;
								}
							}
							else{
								console.log("error");
							}
						}, this);
					}
				console.log("Success");
				trips.push(curTrip);
			}
				console.log(testSet.length + " " + features.length);
				result = trips;
			}
			var points = {
                type: 'FeatureCollection',
                features: []
            }
            for(var i = 0; i < result.length; i++) {
                var feature1 = {
                    type: "Feature",
                    geometry: result[i].origin,
                    properties: {}
                };

                var feature2 = {
                    type: "Feature",
                    geometry: result[i].dest,
                    properties: {}
                }
                points.features.push(feature1);
                points.features.push(feature2);
            }
            fs.writeFileSync('./temp/tripPoints.json', JSON.stringify(points));
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
			}
			else{
				result = geojsonUtils.pointInMultiPolygon(point, geojson.geometry);
			}
			if(result){
				return point;
			}
		}
	}	


	return {
		makeTrips : genTrips,
		testPointNPoly : randomPointInPolygon
	}

});