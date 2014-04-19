define(['mysql'
], function(mysql) {

  var DATABASE = "capstone";
  var TABLE = "CityPops";
  var TABLE2 = "CityTrips";

 
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : DATABASE,
    port     : 8889
  });


  function queryTracts(cityTract, callback, context){
    connection.query('select tractBlob from ' + TABLE + ' where tractID = ' + cityTract,
    function(err, result) {
        if (err){
           throw err;
        }
        else {
          // console.log(result[0].tractBlob);
            for (var i =0; i < result.length; i++) {
               var tract = result[i];
               var str = tract.tractBlob.toString();
               var test = str.substring(1, str.length-1);
               callback.call(context||this, JSON.parse(test));
               return;
            }
            callback.call(context||this, false);
        }
    });
  }
  
  function writeTracts(cityTract, cityBlob){  
   var jsonString = stringifyJSON(cityBlob);  
    var query = connection.query('INSERT INTO ' + TABLE + ' (tractID, tractBlob) VALUES ("' + cityTract + '", "' + connection.escape(jsonString) + '")', function(err, result) {
        if (err) {
        console.log("An error occurred!", err);
        process.exit(1);
    }
    });
  }

    function queryTrips(cityTract, callback, context){
    connection.query('select tripBlob from ' + TABLE2 + ' where tractID = ' + cityTract,
    function(err, result) {
        if (err){
           throw err;
        }
        else {
          // console.log(result[0].tractBlob);
            for (var i =0; i < result.length; i++) {
               var trip = result[i];
               var str = trip.tripBlob.toString();
               var test = str.substring(1, str.length-1);
               callback.call(context||this, JSON.parse(test));
               return;
            }
            callback.call(context||this, false);
        }
    });
  }

   function writeTrips(cityTract, tripBlob){  
   var jsonString = stringifyJSON(tripBlob);  
    var query = connection.query('INSERT INTO ' + TABLE2 + ' (tractID, tripBlob) VALUES ("' + cityTract + '", "' + connection.escape(jsonString) + '")', function(err, result) {
        if (err) {
        console.log("An error occurred!", err);
        process.exit(1);
    }
    });
  }

  function stringifyJSON(jsonObject){
    var obj = JSON.stringify(jsonObject);
    var safeObj = obj.replace("'","\'");
    return safeObj;
  }


  return {
    makeQuery: queryTracts,
    makeWrite: writeTracts,
    makeTripQuery: queryTrips,
    makeTripWrite: writeTrips 
  }
});