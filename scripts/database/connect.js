define(['mysql'
], function(mysql) {

  var DATABASE = "capstone";
  var TABLE = "CityPops";
  var TABLE2 = "CityTrips";
  var TABLE3 = "CityUsers";

 
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
          } else {
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


  function queryTrips(geoID, callback, context){
    connection.query('select tripBlob from ' + TABLE2 + ' where tractID = "' + geoID + '"',
      function(err, result) {
        if (err){
           throw err;
        } else {
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

  function authSession(sessionID, callback, context){
    connection.query('select sessionName from ' + TABLE3 + ' where sessionName = "' + sessionID + '"',
      function(err, result){
          if(err) {
            throw err;
          } else {
            if(result.length === 0) {
              callback.call(context||this, false);
            } else {
              callback.call(context||this, true);
            }
          }
      });
  }

  function querySession(sessionID, callback, context){
    var that = this;
    connection.query('select routeCollection, cityFips, gtfs from ' + TABLE3 + ' where sessionName = "' + sessionID + '"',
      function(err, result) {
          if (err) {
            throw err;
          } else {
            if(result.length === 0){
              callback.call(context||that, false);
            } else {
              var fips = result[0].cityFips;
              queryTracts(fips, function(tractResult) {
                  if(tractResult === false) {
                      console.log("MAJOR ISSUE NO TRACTS FOR SESSION "+ fips);
                      callback.call(context||that, false);
                  } else {
                      console.log("Hit for "+ fips);
                      var strRC = result[0].routeCollection.toString();
                      var finRoute = strRC.substring(1, strRC.length-1);
                      var strGTFS = result[0].result[0].gtfs.toString();
                      var finGTFS = strGTFS.substring(1, strGTFS.length-1);
                      callback.call(context||that, {
                            tracts: tractResult,
                            routeCollection: JSON.parse(finRoute),
                            gtfs: JSON.parse(finGTFS)
                      });
                    }
              }, this);
            }
          }
      });
  }

  function writeSession(sessionID, routeCol, fips, graph, gtfs){
    var jsonRoute = stringifyJSON(routeCol);
    var jsonGTFS = stringifyJSON(gtfs);
    authSession(sessionID, function(result){
        if(result === false) {
            var query = connection.query('INSERT INTO ' + TABLE3 + ' (sessionName, routeCollection, cityFips, simGraph, gtfs) VALUES ("' 
            + sessionID + '", "' + connection.escape(jsonRoute) + '", "' + fips + '", "' + graph + '" ,"' + connection.escape(jsonGTFS) +'")', 
              function(err, result) {
                if (err) {
                  console.log("An error occurred!", err);
                  process.exit(1);
                }
            });
        } else {
          //Update route and gtfs...
          var query = connection.query('UPDATE ' + TABLE3 + ' SET routeCollection = ' + jsonRoute + ', gtfs = ' + jsonGTFS + ' WHERE sessionName = ' +sessionID, 
            function(err, result){
              if(err){
                console.log("An error occurred!", err);
                process.exit(1);
              }
            });
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
    makeTripWrite: writeTrips,
    makeSessAuth: authSession,
    makeSessWrite: writeSession,
    makeSessQuery: querySession
  }
});