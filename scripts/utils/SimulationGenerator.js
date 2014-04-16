define(['scripts/database/connect', 
		'weighted',
		'clipper',
		'scripts/models/Trip',
		'scripts/models/citytracts',
		'geojson-utils'], function(connect, weighted, clipper, Trip, citytracts, geojsonUtils) {


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
				var popList = {};
				var empList = {};
				var features = cityTracts.features;
				for(var i = 0; i < features.length; i++){
					var feat = features[i];
					var tractID = feat.properties.COUNTYFP + feat.properties.TRACTCE;
					popList[tractID] =  parseInt(feat.properties.population);
					empList[tractID] =  parseInt(feat.properties.employment);
				}
				var trips = [];
				for(var j = 0; j < 1000; j++){
					var currTrip = new Trip(j, weighted.select(popList), weighted.select(empList));
					trips.push(currTrip);
				}
				for(var k = 0; k < trips.length; k++){
					//if(k%100 === 0){
						console.log(k);
					//}
					var curTrip = trips[k];
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
						if(tract1Bound !== undefined && tract2Bound !== undefined){
							break;
						}
					}
					curTrip.origin = randomPointInPolygon(tract1Bound);
					curTrip.dest = randomPointInPolygon(tract2Bound);
				}
			}
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
				console.log("Success!");
				return point;
			}
		}
	}	

	return {
		makeTrips : genTrips,
		testPointNPoly : randomPointInPolygon
	}

});