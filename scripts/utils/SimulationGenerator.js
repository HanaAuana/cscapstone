define(['scripts/database/connect', 
		'weighted',
		'clipper',
		'scripts/models/Trip',
		'scripts/models/citytracts',
		'geojson-utils',
		'scripts/utils/drivingDirectionsAPI',
		'fs'
], function(connect, weighted, clipper, Trip, citytracts, geojsonUtils, drivingDirections, fs) {
	var MIN_TRIP_TIME = 420; // 7 mins
    var NUM_TRIPS = 1000;

	//Check to see if there are trips already generated...
	function checkTrips(cityTract, callback){
		var that = this;
		connect.makeTripQuery(cityTract, function(result){
			if(result === false){
				console.log("MISS");
	            callback.call(that, false);
			} else{
	            callback.call(that, result);
	          }
	    }, this);
	}

	function initTripGeneration(cityTracts, stateID, placeID, callback, context){
        var fips = stateID + '' + placeID;
		checkTrips(fips, function(result){

			if(result === false) {

				var popList = {};
				var empList = {};
				var features = cityTracts.features;
				for(var ii = 0; ii < features.length; ii++){
					var feature = features[ii];
					var tractID = feature.properties.COUNTYFP + feature.properties.TRACTCE;
					popList[tractID] =  parseInt(feature.properties.population, 10);
					empList[tractID] =  parseInt(feature.properties.employment, 10);
				}

                var trips = [];
                var numTripsCompleted = 0;

                // Load the state OSM graph into memory for OTP and begin routing
            	drivingDirections.requestGraphLoad(stateID, function() {
	                for(var j = 0; j < NUM_TRIPS; j++){
	                    var curTrip = new Trip(j);
	                    trips.push(curTrip);
	                    generateEndpoints(stateID, curTrip, features, popList, empList, function() {
	                        if(++numTripsCompleted === NUM_TRIPS) {
	                            console.log('Trip generation complete');
	                            callback.call(context||this, trips);
	                			connect.makeTripWrite(fips, trips);

	                			// Evict graph to reduce memory usage
	            				drivingDirections.requestGraphEviction(stateID);
	                        } else if(numTripsCompleted % 100 === 0)
	                        	console.log("Routing trip " + numTripsCompleted);
	                    });
	                }
                });
			} else {
                console.log("trip gen completed: found in cache");
                callback.call(context||this, result);
            }
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

    function generateEndpoints(stateID, curTrip, features, popList, empList, callback) {

        curTrip.tract1 =  weighted.select(popList);
        curTrip.tract2 =  weighted.select(empList);

        var tract1Bound = null;
        var tract2Bound = null;

        for(var l = 0; l < features.length; l++){
            var feat = features[l];
            var tractID = feat.properties.COUNTYFP + feat.properties.TRACTCE;
            if(tractID == curTrip.tract1){
                tract1Bound = feat;
            }
            if(tractID == curTrip.tract2){
                tract2Bound = feat;
            }
            if(tract1Bound !== null && tract2Bound !== null){
                break;
            }
        }
        curTrip.origin = randomPointInPolygon(tract1Bound);
        curTrip.dest = randomPointInPolygon(tract2Bound);
        drivingDirections.getRouteLimited(stateID, 
                                          [curTrip.origin.coordinates,    
                                            curTrip.dest.coordinates], 
                                          function(result) {
          	// console.log(result);
            if(result !== false && result.time >= MIN_TRIP_TIME){
                callback.call(this, curTrip);
            } else {
                generateEndpoints(stateID, curTrip, features, popList, empList, callback);
            }
        }, this);
    }

	return {
		makeTrips : initTripGeneration
	}

});