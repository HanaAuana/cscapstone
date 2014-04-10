define(['connect', 
		'weighted'], function(conenct, weighted) {

	});

	function checkTrips(cityTract, callback){
		var that = this;
		connect.tripQuery(cityTract, function(result)){
			if(result === false){
				console.log("Miss for "+ cityTract);
	            callback.call(that, false);
			} else{
	            console.log("Hit for "+ cityTract);
	            callback.call(that, result);
	          }
	    }, this);
	}

	function genTrips(cityTracts, fips, callback, context){
		checkTrips(fips function(result){
			if(result === false){
				var popList = {};
				var empList = {};
				var features = cityTracts.features;
				for(var i = 0; i < features.length; i++){
					var feat = feature[i];
					var tractID = feat.properties.COUNTYFP + feat.properties.TRACTCE;
					popList[tractID] = feat.properties.population;
					empList[tractID] = feat.properties.employment;
				}
				var trips = [];
				for(var j = 0; j < 10000; j++){
					var currTrip = new Trip(j, weighted.select(popList), weighted.select(empList))
					trips.push(currTrip);
				}
			}
			callback.call(context||this, result
		});
	}