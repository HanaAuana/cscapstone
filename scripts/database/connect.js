var mysql = require('mysql');
var DATABASE = "capstone";
var TABLE = "CityPops";
//Test to see if it writes..
var post  = {tractIDvariable:01, tractBlobVariable:20};

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : DATABASE,
  port     : 8889
});

//Need to wrap this inside a function.
//Need to change 01 to varaible being passed in....
connection.query('select tractBlob from ' + TABLE + ' where tractID = 01',
function(err, result) {
    if (err) throw err;
    else {
        for (var i in result) {
            var tract = result[i];
            console.log('01 : '+ tract.tractBlob);
        }
    }
});
//Need to wrap this inside a function.
//Write to the database.
connection.query('INSERT INTO messages VALUES ?', post, function(err, result) {

});