define(['mysql',
  'json!config'
], function(mysql, config) {

  var DATABASE = "capstone";
  var TABLE = "CityPops";
  var TABLE2 = "CityTrips";
  var TABLE3 = "CityUsers";

  var connection = mysql.createConnection({
    host     : config.mysqlHost,
    user     : config.mysqlUser,
    password : config.mysqlPassword,
    database : DATABASE,
    port     : config.mysqlPort
  });

  function queryTracts(cityTract, callback, context){
    connection.query('select tractBlob from ' + TABLE + ' where tractID = ' + cityTract,
      function(err, result) {
          if (err){
             throw err;
          } else {
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
    connection.query('select routeCollection, cityFips, gtfs, city from ' + TABLE3 + ' where sessionName = "' + sessionID + '"',
      function(err, result) {
          if (err) {
            throw err;
          } else {
            if(result.length === 0){
              callback.call(context||that, false);
            } else {
              console.log("Hit for session " + sessionID);
              var fips = result[0].cityFips; 
              
              var strRC = result[0].routeCollection;
              var finRoute = strRC.substring(1, strRC.length-1);
              var strGTFS = result[0].gtfs;
              var finGTFS = strGTFS.substring(1, strGTFS.length-1);
              var strCity = result[0].city;
              var finCity = strCity.substring(1, strCity.length-1);

              callback.call(context||that, {
                    routeCollection: JSON.parse(finRoute),
                    gtfs: JSON.parse(finGTFS),
                    fips: fips,
                    city: JSON.parse(finCity)
              });
            }
          }
      });
  }

  function writeSession(sessionID, routeCol, fips, gtfs, city){
    var jsonRoute = stringifyJSON(routeCol);
    var jsonGTFS = stringifyJSON(gtfs);
    var jsonCity = stringifyJSON(city);
    authSession(sessionID, function(result){
        if(result === false) {
            var query = connection.query('INSERT INTO ' + TABLE3 + ' (sessionName, routeCollection, cityFips, gtfs, city) VALUES ("' 
            + sessionID + '", "' + connection.escape(jsonRoute) + '", "' + fips + '" ,"' + connection.escape(jsonGTFS) +'" ,"' + connection.escape(jsonCity) +'")', 
              function(err, result) {
                if (err) {
                  throw err;
                }
            });
        } else {
          //Update route and gtfs...
          var query = connection.query('UPDATE ' + TABLE3 + ' SET routeCollection = "' + connection.escape(jsonRoute) 
                                        + '", gtfs = "' + connection.escape(jsonGTFS) 
                                        + '" WHERE sessionName = "' + sessionID + '"', 
            function(err, result){
              if(err){
                throw err;
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

  function updateRoutes(sessionID, routeCol){
    var jsonRoute = stringifyJSON(routeCol);
    authSession(sessionID, function(result){
      if(result === false){
        console.log("No session found for this user..");
      } else {
        var query = connection.query('UPDATE ' + TABLE3 
                    + ' SET routeCollection = "' + connection.escape(jsonRoute) 
                    + '" WHERE sessionName = "' + sessionID + '"',
          function(err, result){
            if(err)
              throw err;
          });
      }
    });
  }


  return {
    makeQuery: queryTracts,
    makeWrite: writeTracts,
    makeTripQuery: queryTrips,
    makeTripWrite: writeTrips,
    makeSessAuth: authSession,
    makeSessWrite: writeSession,
    makeSessQuery: querySession,
    makeRouteUpdate: updateRoutes
  }
});
