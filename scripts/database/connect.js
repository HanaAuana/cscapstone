var mysql = require('mysql');
var DATABASE = "capstone";
var TABLE = "Cities";
var TABLE2 = "CityPopTots";
var TABLE3 = "StateShapes";


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : DATABASE,
  port     : 8889
});


function getState(city, callback){
  connection.query('select cityPopID, stateID from ' + TABLE + " where cityName = ? ", [city], function(err, result) {
    if(err){
      callback(err, null);
    }
    else {
        callback(null, result[0].stateID);
    }
  });
}

