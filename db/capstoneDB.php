<?php
	$db_hostname = "localhost";
	$db_database = "capstone";
	$db_username = "root";
	$db_password = "root";

	// Connect to server.
	$db_server = mysql_connect($db_hostname, $db_username, $db_password)
    	or die("Unable to connect to MySQL: " . mysql_error());

    // Select the database.
	mysql_select_db($db_database)
    	or die("Unable to select database: " . mysql_error());

    //Create a table if it doesn't exist and drop if it does and recreate it.
	$myQuery = "DROP TABLE IF EXISTS CityPops";
    mysql_query($myQuery, $db_server);
    echo "Creating table 'CityPops'<br />";
             
    // Create the table
    $myQuery = "CREATE TABLE CityPops (tractID   VARCHAR(10),
			                    tractBlob LONGTEXT,
								PRIMARY KEY (tractID)
								)";
	mysql_query($myQuery, $db_server) or die("Failed to create table " . mysql_error());
	echo "Table created...<br />";

	$myQuery2 = "CREATE TABLE CityTrips (tractID   VARCHAR(10),
			                    tripBlob LONGTEXT,
								PRIMARY KEY (tractID)
								)";
	mysql_query($myQuery2, $db_server) or die("Failed to create table " . mysql_error());
	echo "Table created...<br />";

	$myQuery3 = "CREATE TABLE CityUsers (sessionName   VARCHAR(10),
			                    routeCollection LONGTEXT,
			                    cityFips	VARCHAR(20),
			                    simGraph	LONGTEXT,
			                    gtfs 		LONGTEXT,
								PRIMARY KEY (sessionName)
								)";
	mysql_query($myQuery3, $db_server) or die("Failed to create table " . mysql_error());
	echo "Table created...<br />";


	mysql_close($db_server);     // close the connection

?>



