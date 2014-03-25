<?php
//database login shit.
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

	// Create a new table
    // because this is a demo to be run many times, delete any old copies
	//
	$myQuery = "DROP TABLE IF EXISTS States";
    mysql_query($myQuery, $db_server);
    echo "Creating table 'States'<br />";

    // this is the data we want to store
    $stateList = array( array( "01", "AL"),
    					array("02", "AK"),
    					array("03", "AZ"),
    					array("04", "AR"),
    					array("05", "CA"),
    					array("06", "CO"),
    					array("07", "CT"),
    					array("08", "DE"),
    					array("09", "FL"),
    					array("10", "GA"),
    					array("11", "HI"),
    					array("12", "ID"),
    					array("13", "IL"),
    					array("14", "IN"),
    					array("15", "IA"),
    					array("16", "KS"),
    					array("17", "KY"),
    					array("18", "LA"),
    					array("19", "ME"),
    					array("20", "MD"),
    					array("21", "MA"),
    					array("22", "MI"),
    					array("23", "MN"),
    					array("24", "MS"),
    					array("25", "MO"),
    					array("26", "MT"),
    					array("27", "NE"),
    					array("28", "NV"),
    					array("29", "NH"),
    					array("30", "NJ"),
    					array("31", "NM"),
    					array("32", "NY"),
    					array("33", "NC"),
    					array("34", "ND"),
    					array("35", "OH"),
    					array("36", "OK"),
    					array("37", "OR"),
    					array("38", "PA"),
    					array("39", "RI"),
    					array("40", "SC"),
    					array("41", "SD"),
    					array("42", "TN"),
    					array("43", "TX"),
    					array("44", "UT"),
    					array("45", "VT"),
    					array("46", "VA"),
    					array("47", "WA"),
    					array("48", "WV"),
    					array("49", "WI"),
    					array("50", "WY"),

    	);
             
    // Create the table
    $myQuery = "CREATE TABLE States (stateID   VARCHAR(10),
			                    stateName VARCHAR(20),
								PRIMARY KEY (stateID)
								)";
	mysql_query($myQuery, $db_server) or die("Failed to create table " . mysql_error());
			echo "Table created...<br />";

     for($i = 0; $i < count($stateList); $i++)
             {
				$myQuery = "INSERT INTO States VALUES ('". $stateList[$i][0]."'";
			    //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
				for ($j = 1; $j < count($stateList[$i]); $j++)
				{
			         //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
					 $myQuery  .= ", '".$stateList[$i][$j]. "'";
				}
		  	    $myQuery .= ")";
			    echo "Preparing to insert. Query is: " . $myQuery . "<br />";
			    mysql_query($myQuery, $db_server) or die("Failed to insert..." . mysql_error());			
			}

	$myQuery2 = "DROP TABLE IF EXISTS Cities";
    mysql_query($myQuery2, $db_server);
    echo "Creating table 'Cities'<br />";

	 $cityList = array( array( "47", "Tacoma", "01"),
	 	);

	$myQuery2 = "CREATE TABLE Cities (stateID   VARCHAR(10),
			                    cityName VARCHAR(20),
			                    cityPopID VARCHAR(20),
								PRIMARY KEY (cityPopID)
								)";
	mysql_query($myQuery2, $db_server) or die("Failed to create table " . mysql_error());
	echo "Table created...<br />";

		for($i = 0; $i < count($cityList); $i++)
             {
				$myQuery2 = "INSERT INTO Cities VALUES ('". $cityList[$i][0]."'";
			    //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
				for ($j = 1; $j < count($cityList[$i]); $j++)
				{
			         //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
					 $myQuery2  .= ", '".$cityList[$i][$j]. "'";
				}
		  	    $myQuery2 .= ")";
			    echo "Preparing to insert. Query is: " . $myQuery2 . "<br />";
			    mysql_query($myQuery2, $db_server) or die("Failed to insert..." . mysql_error());			
			}


	$myQuery3 = "DROP TABLE IF EXISTS CityPopTots";
    mysql_query($myQuery3, $db_server);
    echo "Creating table 'CityPopTots'<br />";

	 $cityPopListTots = array( array("47", "Tacoma", "01", "WA602", "1793"),
	 	  					array( "47", "Tacoma", "01", "WA603", "3357"),
	 	  					array( "47", "Tacoma", "01", "WA604", "3896"),
	 	  					array( "47", "Tacoma", "01", "WA605", "3923"),
	 	  					array( "47", "Tacoma", "01", "WA606", "5262"),
	 	  					array( "47", "Tacoma", "01", "WA607", "6253"),
	 	  					array( "47", "Tacoma", "01", "WA608", "4940"),
	 	  					array( "47", "Tacoma", "01", "WA609.03", "3043"),
	 	  					array( "47", "Tacoma", "01", "WA609.04", "5015"),
	 	  					array( "47", "Tacoma", "01", "WA609.05", "6359"),
	 	  					array( "47", "Tacoma", "01", "WA609.06", "2045"),
	 	  					array( "47", "Tacoma", "01", "WA610.01", "3791"),
	 	  					array( "47", "Tacoma", "01", "WA610.02", "4187"),
	 	  					array( "47", "Tacoma", "01", "WA611", "6200"),
	 	  					array( "47", "Tacoma", "01", "WA612", "4968"),
	 	  					array( "47", "Tacoma", "01", "WA613", "4808"),
	 	  					array( "47", "Tacoma", "01", "WA614", "4442"),
	 	  					array( "47", "Tacoma", "01", "WA615", "4742"),
	 	  					array( "47", "Tacoma", "01", "WA616.01", "1824"),
	 	  					array( "47", "Tacoma", "01", "WA616.02", "956"),
	 	  					array( "47", "Tacoma", "01", "WA617", "4578"),
	 	  					array( "47", "Tacoma", "01", "WA618", "2880"),
	 	  					array( "47", "Tacoma", "01", "WA619", "1961"),
	 	  					array( "47", "Tacoma", "01", "WA620", "4228"),
	 	  					array( "47", "Tacoma", "01", "WA623", "5244"),
	 	  					array( "47", "Tacoma", "01", "WA624", "5471"),
	 	  					array( "47", "Tacoma", "01", "WA625", "7073"),
	 	  					array( "47", "Tacoma", "01", "WA626", "2977"),
	 	  					array( "47", "Tacoma", "01", "WA628.01", "6130"),
	 	  					array( "47", "Tacoma", "01", "WA628.02", "4097"),
	 	  					array( "47", "Tacoma", "01", "WA629", "7365"),
	 	  					array( "47", "Tacoma", "01", "WA630", "2956"),
	 	  					array( "47", "Tacoma", "01", "WA631", "4270"),
	 	  					array( "47", "Tacoma", "01", "WA632", "4855"),
	 	  					array( "47", "Tacoma", "01", "WA633", "7852"),
	 	  					array( "47", "Tacoma", "01", "WA634", "7592"),
	 	  					array( "47", "Tacoma", "01", "WA635.01", "4164"),
	 	  					array( "47", "Tacoma", "01", "WA635.02", "5179"),
	 	  					array( "47", "Tacoma", "01", "WA716", "59"),
	 	  					array( "47", "Tacoma", "01", "WA717.03", "2181"),
	 	  					array( "47", "Tacoma", "01", "WA717.04", "0"),
	 	  					array( "47", "Tacoma", "01", "WA717.05", "55"),
	 	  					array( "47", "Tacoma", "01", "WA718", "7"),
	 	  					array( "47", "Tacoma", "01", "WA723.05", "0"),
	 	  					array( "47", "Tacoma", "01", "WA723.09", "1502"),
	 	  					array( "47", "Tacoma", "01", "WA723.10", "109"),
	 	  					array( "47", "Tacoma", "01", "WA723.11", "16"),
	 	  					array( "47", "Tacoma", "01", "WA723.12", "1167"),
	 	  					array( "47", "Tacoma", "01", "WA9400.01", "773"),
	 	  					array( "47", "Tacoma", "01", "WA9400.02", "176"),
	 	  					array( "47", "Tacoma", "01", "WA9400.04", "4"),
	 	  					array( "47", "Tacoma", "01", "WA9400.05", "5839"),
	 	  					array( "47", "Tacoma", "01", "WA9400.06", "2447"),
	 	  					array( "47", "Tacoma", "01", "WA9400.07", "3122"),
	 	  					array( "47", "Tacoma", "01", "WA9400.08", "5902"),
	 	  					array( "47", "Tacoma", "01", "WA9400.11", "4092")

	 	);

		$myQuery3= "CREATE TABLE CityPopTots (stateID   VARCHAR(10),
			                    cityName VARCHAR(20),
			                    cityPopID VARCHAR(20),
			                    censusTract	VARCHAR(20),
			                    cityPop VARCHAR(30),
								PRIMARY KEY (censusTract)
								)";


	mysql_query($myQuery3, $db_server) or die("Failed to create table " . mysql_error());
	echo "Table created...<br />";

		for($i = 0; $i < count($cityPopListTots); $i++)
             {
				$myQuery3 = "INSERT INTO CityPopTots VALUES ('". $cityPopListTots[$i][0]."'";
			    //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
				for ($j = 1; $j < count($cityPopListTots[$i]); $j++)
				{
			         //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
					 $myQuery3 .= ", '".$cityPopListTots[$i][$j]. "'";
				}
		  	    $myQuery3 .= ")";
			    echo "Preparing to insert. Query is: " . $myQuery3 . "<br />";
			    mysql_query($myQuery3, $db_server) or die("Failed to insert..." . mysql_error());			
			}

	$myQuery4 = "DROP TABLE IF EXISTS CityEmpCR";
    mysql_query($myQuery4, $db_server);
    echo "Creating table 'CityEmpCR'<br />";

	$cityEmpListCR = array( array("47", "Tacoma", "01", "WA602", "589"),
	 	  					array( "47", "Tacoma", "01", "WA603", "59"),
	 	  					array( "47", "Tacoma", "01", "WA604", "13"),
	 	  					array( "47", "Tacoma", "01", "WA605", "0"),
	 	  					array( "47", "Tacoma", "01", "WA606", "31"),
	 	  					array( "47", "Tacoma", "01", "WA607", "16"),
	 	  					array( "47", "Tacoma", "01", "WA608", "51"),
	 	  					array( "47", "Tacoma", "01", "WA609.03", "12"),
	 	  					array( "47", "Tacoma", "01", "WA609.04", "0"),
	 	  					array( "47", "Tacoma", "01", "WA609.05", "0"),
	 	  					array( "47", "Tacoma", "01", "WA609.06", "0"),
	 	  					array( "47", "Tacoma", "01", "WA610.01", "0"),
	 	  					array( "47", "Tacoma", "01", "WA610.02", "0"),
	 	  					array( "47", "Tacoma", "01", "WA611", "0"),
	 	  					array( "47", "Tacoma", "01", "WA612", "48"),
	 	  					array( "47", "Tacoma", "01", "WA613", "0"),
	 	  					array( "47", "Tacoma", "01", "WA614", "0"),
	 	  					array( "47", "Tacoma", "01", "WA615", "65"),
	 	  					array( "47", "Tacoma", "01", "WA616.01", "95"),
	 	  					array( "47", "Tacoma", "01", "WA616.02", "210"),
	 	  					array( "47", "Tacoma", "01", "WA617", "246"),
	 	  					array( "47", "Tacoma", "01", "WA618", "5"),
	 	  					array( "47", "Tacoma", "01", "WA619", "0"),
	 	  					array( "47", "Tacoma", "01", "WA620", "14"),
	 	  					array( "47", "Tacoma", "01", "WA623", "0"),
	 	  					array( "47", "Tacoma", "01", "WA624", "0"),
	 	  					array( "47", "Tacoma", "01", "WA625", "67"),
	 	  					array( "47", "Tacoma", "01", "WA626", "905"),
	 	  					array( "47", "Tacoma", "01", "WA628.01", "258"),
	 	  					array( "47", "Tacoma", "01", "WA628.02", "123"),
	 	  					array( "47", "Tacoma", "01", "WA629", "0"),
	 	  					array( "47", "Tacoma", "01", "WA630", "0"),
	 	  					array( "47", "Tacoma", "01", "WA631", "0"),
	 	  					array( "47", "Tacoma", "01", "WA632", "13"),
	 	  					array( "47", "Tacoma", "01", "WA633", "0"),
	 	  					array( "47", "Tacoma", "01", "WA634", "29"),
	 	  					array( "47", "Tacoma", "01", "WA635.01", "0"),
	 	  					array( "47", "Tacoma", "01", "WA635.02", "4"),
	 	  					array( "47", "Tacoma", "01", "WA716", "104"),
	 	  					array( "47", "Tacoma", "01", "WA717.03", "0"),
	 	  					array( "47", "Tacoma", "01", "WA717.04", "84"),
	 	  					array( "47", "Tacoma", "01", "WA717.05", "149"),
	 	  					array( "47", "Tacoma", "01", "WA718", "146"),
	 	  					array( "47", "Tacoma", "01", "WA723.05", "29"),
	 	  					array( "47", "Tacoma", "01", "WA723.09", "0"),
	 	  					array( "47", "Tacoma", "01", "WA723.10", "4"),
	 	  					array( "47", "Tacoma", "01", "WA723.11", "111")

	 	);

		$myQuery4= "CREATE TABLE CityEmpCR (stateID   VARCHAR(10),
			                    cityName VARCHAR(20),
			                    cityEmpID VARCHAR(20),
			                    censusTract	VARCHAR(20),
			                    empPop VARCHAR(30),
								PRIMARY KEY (censusTract)
								)";


	mysql_query($myQuery4, $db_server) or die("Failed to create table " . mysql_error());
	echo "Table created...<br />";

		for($i = 0; $i < count($cityEmpListCR); $i++)
             {
				$myQuery4 = "INSERT INTO CityEmpCR VALUES ('". $cityEmpListCR[$i][0]."'";
			    //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
				for ($j = 1; $j < count($cityEmpListCR[$i]); $j++)
				{
			         //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
					 $myQuery4 .= ", '".$cityEmpListCR[$i][$j]. "'";
				}
		  	    $myQuery4 .= ")";
			    echo "Preparing to insert. Query is: " . $myQuery4 . "<br />";
			    mysql_query($myQuery4, $db_server) or die("Failed to insert..." . mysql_error());			
			}


	$myQuery5 = "DROP TABLE IF EXISTS CityEmpFire";
    mysql_query($myQuery5, $db_server);
    echo "Creating table 'CityEmpFire'<br />";

	$cityEmpListFire = array( array("47", "Tacoma", "01", "WA602", "129"),
	 	  					array( "47", "Tacoma", "01", "WA603", "0"),
	 	  					array( "47", "Tacoma", "01", "WA604", "3"),
	 	  					array( "47", "Tacoma", "01", "WA605", "67"),
	 	  					array( "47", "Tacoma", "01", "WA606", "90"),
	 	  					array( "47", "Tacoma", "01", "WA607", "32"),
	 	  					array( "47", "Tacoma", "01", "WA608", "39"),
	 	  					array( "47", "Tacoma", "01", "WA609.03", "43"),
	 	  					array( "47", "Tacoma", "01", "WA609.04", "20"),
	 	  					array( "47", "Tacoma", "01", "WA609.05", "50"),
	 	  					array( "47", "Tacoma", "01", "WA609.06", "40"),
	 	  					array( "47", "Tacoma", "01", "WA610.01", "23"),
	 	  					array( "47", "Tacoma", "01", "WA610.02", "155"),
	 	  					array( "47", "Tacoma", "01", "WA611", "370"),
	 	  					array( "47", "Tacoma", "01", "WA612", "48"),
	 	  					array( "47", "Tacoma", "01", "WA613", "20"),
	 	  					array( "47", "Tacoma", "01", "WA614", "24"),
	 	  					array( "47", "Tacoma", "01", "WA615", "117"),
	 	  					array( "47", "Tacoma", "01", "WA616.01", "2493"),
	 	  					array( "47", "Tacoma", "01", "WA616.02", "792"),
	 	  					array( "47", "Tacoma", "01", "WA617", "0"),
	 	  					array( "47", "Tacoma", "01", "WA618", "0"),
	 	  					array( "47", "Tacoma", "01", "WA619", "30"),
	 	  					array( "47", "Tacoma", "01", "WA620", "0"),
	 	  					array( "47", "Tacoma", "01", "WA623", "0"),
	 	  					array( "47", "Tacoma", "01", "WA624", "52"),
	 	  					array( "47", "Tacoma", "01", "WA625", "0"),
	 	  					array( "47", "Tacoma", "01", "WA626", "514"),
	 	  					array( "47", "Tacoma", "01", "WA628.01", "78"),
	 	  					array( "47", "Tacoma", "01", "WA628.02", "63"),
	 	  					array( "47", "Tacoma", "01", "WA629", "169"),
	 	  					array( "47", "Tacoma", "01", "WA630", "0"),
	 	  					array( "47", "Tacoma", "01", "WA631", "0"),
	 	  					array( "47", "Tacoma", "01", "WA632", "23"),
	 	  					array( "47", "Tacoma", "01", "WA633", "39"),
	 	  					array( "47", "Tacoma", "01", "WA634", "98"),
	 	  					array( "47", "Tacoma", "01", "WA635.01", "24"),
	 	  					array( "47", "Tacoma", "01", "WA635.02", "0"),
	 	  					array( "47", "Tacoma", "01", "WA716", "45"),
	 	  					array( "47", "Tacoma", "01", "WA717.03", "54"),
	 	  					array( "47", "Tacoma", "01", "WA717.04", "17"),
	 	  					array( "47", "Tacoma", "01", "WA717.05", "55"),
	 	  					array( "47", "Tacoma", "01", "WA718", "244"),
	 	  					array( "47", "Tacoma", "01", "WA723.05", "225"),
	 	  					array( "47", "Tacoma", "01", "WA723.09", "18"),
	 	  					array( "47", "Tacoma", "01", "WA723.10", "63"),
	 	  					array( "47", "Tacoma", "01", "WA723.11", "210")

	 	);

		$myQuery5= "CREATE TABLE CityEmpFire (stateID   VARCHAR(10),
			                    cityName VARCHAR(20),
			                    cityEmpID VARCHAR(20),
			                    censusTract	VARCHAR(20),
			                    empPop VARCHAR(30),
								PRIMARY KEY (censusTract)
								)";


	mysql_query($myQuery5, $db_server) or die("Failed to create table " . mysql_error());
	echo "Table created...<br />";

		for($i = 0; $i < count($cityEmpListFire); $i++)
             {
				$myQuery5 = "INSERT INTO CityEmpFire VALUES ('". $cityEmpListFire[$i][0]."'";
			    //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
				for ($j = 1; $j < count($cityEmpListFire[$i]); $j++)
				{
			         //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
					 $myQuery5 .= ", '".$cityEmpListFire[$i][$j]. "'";
				}
		  	    $myQuery5 .= ")";
			    echo "Preparing to insert. Query is: " . $myQuery5 . "<br />";
			    mysql_query($myQuery5, $db_server) or die("Failed to insert..." . mysql_error());			
			}		

$myQuery6 = "DROP TABLE IF EXISTS CityEmpManu";
    mysql_query($myQuery6, $db_server);
    echo "Creating table 'CityEmpManu'<br />";

	$cityEmpListManu = array( array("47", "Tacoma", "01", "WA602", "3787"),
	 	  					array( "47", "Tacoma", "01", "WA603", "0"),
	 	  					array( "47", "Tacoma", "01", "WA604", "0"),
	 	  					array( "47", "Tacoma", "01", "WA605", "0"),
	 	  					array( "47", "Tacoma", "01", "WA606", "0"),
	 	  					array( "47", "Tacoma", "01", "WA607", "8"),
	 	  					array( "47", "Tacoma", "01", "WA608", "0"),
	 	  					array( "47", "Tacoma", "01", "WA609.03", "0"),
	 	  					array( "47", "Tacoma", "01", "WA609.04", "0"),
	 	  					array( "47", "Tacoma", "01", "WA609.05", "0"),
	 	  					array( "47", "Tacoma", "01", "WA609.06", "0"),
	 	  					array( "47", "Tacoma", "01", "WA610.01", "0"),
	 	  					array( "47", "Tacoma", "01", "WA610.02", "0"),
	 	  					array( "47", "Tacoma", "01", "WA611", "0"),
	 	  					array( "47", "Tacoma", "01", "WA612", "0"),
	 	  					array( "47", "Tacoma", "01", "WA613", "0"),
	 	  					array( "47", "Tacoma", "01", "WA614", "0"),
	 	  					array( "47", "Tacoma", "01", "WA615", "0"),
	 	  					array( "47", "Tacoma", "01", "WA616.01", "96"),
	 	  					array( "47", "Tacoma", "01", "WA616.02", "240"),
	 	  					array( "47", "Tacoma", "01", "WA617", "0"),
	 	  					array( "47", "Tacoma", "01", "WA618", "0"),
	 	  					array( "47", "Tacoma", "01", "WA619", "0"),
	 	  					array( "47", "Tacoma", "01", "WA620", "0"),
	 	  					array( "47", "Tacoma", "01", "WA623", "0"),
	 	  					array( "47", "Tacoma", "01", "WA624", "0"),
	 	  					array( "47", "Tacoma", "01", "WA625", "0"),
	 	  					array( "47", "Tacoma", "01", "WA626", "1680"),
	 	  					array( "47", "Tacoma", "01", "WA628.01", "274"),
	 	  					array( "47", "Tacoma", "01", "WA628.02", "100"),
	 	  					array( "47", "Tacoma", "01", "WA629", "0"),
	 	  					array( "47", "Tacoma", "01", "WA630", "261"),
	 	  					array( "47", "Tacoma", "01", "WA631", "0"),
	 	  					array( "47", "Tacoma", "01", "WA632", "0"),
	 	  					array( "47", "Tacoma", "01", "WA633", "0"),
	 	  					array( "47", "Tacoma", "01", "WA634", "0"),
	 	  					array( "47", "Tacoma", "01", "WA635.01", "0"),
	 	  					array( "47", "Tacoma", "01", "WA635.02", "0"),
	 	  					array( "47", "Tacoma", "01", "WA716", "89"),
	 	  					array( "47", "Tacoma", "01", "WA717.03", "0"),
	 	  					array( "47", "Tacoma", "01", "WA717.04", "79"),
	 	  					array( "47", "Tacoma", "01", "WA717.05", "71"),
	 	  					array( "47", "Tacoma", "01", "WA718", "168"),
	 	  					array( "47", "Tacoma", "01", "WA723.05", "0"),
	 	  					array( "47", "Tacoma", "01", "WA723.09", "0"),
	 	  					array( "47", "Tacoma", "01", "WA723.10", "37"),
	 	  					array( "47", "Tacoma", "01", "WA723.11", "45")

	 	);

		$myQuery6= "CREATE TABLE CityEmpManu (stateID   VARCHAR(10),
			                    cityName VARCHAR(20),
			                    cityEmpID VARCHAR(20),
			                    censusTract	VARCHAR(20),
			                    empPop VARCHAR(30),
								PRIMARY KEY (censusTract)
								)";


	mysql_query($myQuery6, $db_server) or die("Failed to create table " . mysql_error());
	echo "Table created...<br />";

		for($i = 0; $i < count($cityEmpListManu); $i++)
             {
				$myQuery6 = "INSERT INTO CityEmpManu VALUES ('". $cityEmpListManu[$i][0]."'";
			    //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
				for ($j = 1; $j < count($cityEmpListManu[$i]); $j++)
				{
			         //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
					 $myQuery6 .= ", '".$cityEmpListManu[$i][$j]. "'";
				}
		  	    $myQuery6 .= ")";
			    echo "Preparing to insert. Query is: " . $myQuery6 . "<br />";
			    mysql_query($myQuery6, $db_server) or die("Failed to insert..." . mysql_error());			
			}

	$myQuery7 = "DROP TABLE IF EXISTS CityEmpRet";
    mysql_query($myQuery7, $db_server);
    echo "Creating table 'CityEmpRet'<br />";

	$cityEmpListRet = array( array("47", "Tacoma", "01", "WA602", "274"),
	 	  					array( "47", "Tacoma", "01", "WA603", "22"),
	 	  					array( "47", "Tacoma", "01", "WA604", "0"),
	 	  					array( "47", "Tacoma", "01", "WA605", "105"),
	 	  					array( "47", "Tacoma", "01", "WA606", "8"),
	 	  					array( "47", "Tacoma", "01", "WA607", "160"),
	 	  					array( "47", "Tacoma", "01", "WA608", "219"),
	 	  					array( "47", "Tacoma", "01", "WA609.03", "203"),
	 	  					array( "47", "Tacoma", "01", "WA609.04", "0"),
	 	  					array( "47", "Tacoma", "01", "WA609.05", "55"),
	 	  					array( "47", "Tacoma", "01", "WA609.06", "239"),
	 	  					array( "47", "Tacoma", "01", "WA610.01", "17"),
	 	  					array( "47", "Tacoma", "01", "WA610.02", "336"),
	 	  					array( "47", "Tacoma", "01", "WA611", "778"),
	 	  					array( "47", "Tacoma", "01", "WA612", "56"),
	 	  					array( "47", "Tacoma", "01", "WA613", "98"),
	 	  					array( "47", "Tacoma", "01", "WA614", "45"),
	 	  					array( "47", "Tacoma", "01", "WA615", "142"),
	 	  					array( "47", "Tacoma", "01", "WA616.01", "107"),
	 	  					array( "47", "Tacoma", "01", "WA616.02", "157"),
	 	  					array( "47", "Tacoma", "01", "WA617", "90"),
	 	  					array( "47", "Tacoma", "01", "WA618", "65"),
	 	  					array( "47", "Tacoma", "01", "WA619", "120"),
	 	  					array( "47", "Tacoma", "01", "WA620", "0"),
	 	  					array( "47", "Tacoma", "01", "WA623", "5"),
	 	  					array( "47", "Tacoma", "01", "WA624", "178"),
	 	  					array( "47", "Tacoma", "01", "WA625", "194"),
	 	  					array( "47", "Tacoma", "01", "WA626", "4209"),
	 	  					array( "47", "Tacoma", "01", "WA628.01", "324"),
	 	  					array( "47", "Tacoma", "01", "WA628.02", "16"),
	 	  					array( "47", "Tacoma", "01", "WA629", "510"),
	 	  					array( "47", "Tacoma", "01", "WA630", "552"),
	 	  					array( "47", "Tacoma", "01", "WA631", "158"),
	 	  					array( "47", "Tacoma", "01", "WA632", "79"),
	 	  					array( "47", "Tacoma", "01", "WA633", "91"),
	 	  					array( "47", "Tacoma", "01", "WA634", "318"),
	 	  					array( "47", "Tacoma", "01", "WA635.01", "205"),
	 	  					array( "47", "Tacoma", "01", "WA635.02", "0"),
	 	  					array( "47", "Tacoma", "01", "WA716", "243"),
	 	  					array( "47", "Tacoma", "01", "WA717.03", "0"),
	 	  					array( "47", "Tacoma", "01", "WA717.04", "16"),
	 	  					array( "47", "Tacoma", "01", "WA717.05", "149"),
	 	  					array( "47", "Tacoma", "01", "WA718", "479"),
	 	  					array( "47", "Tacoma", "01", "WA723.05", "44"),
	 	  					array( "47", "Tacoma", "01", "WA723.09", "12"),
	 	  					array( "47", "Tacoma", "01", "WA723.10", "284"),
	 	  					array( "47", "Tacoma", "01", "WA723.11", "153")

	 	);

		$myQuery7= "CREATE TABLE CityEmpRet (stateID   VARCHAR(10),
			                    cityName VARCHAR(20),
			                    cityEmpID VARCHAR(20),
			                    censusTract	VARCHAR(20),
			                    empPop VARCHAR(30),
								PRIMARY KEY (censusTract)
								)";


	mysql_query($myQuery7, $db_server) or die("Failed to create table " . mysql_error());
	echo "Table created...<br />";

		for($i = 0; $i < count($cityEmpListRet); $i++)
             {
				$myQuery7 = "INSERT INTO CityEmpRet VALUES ('". $cityEmpListRet[$i][0]."'";
			    //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
				for ($j = 1; $j < count($cityEmpListRet[$i]); $j++)
				{
			         //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
					 $myQuery7 .= ", '".$cityEmpListRet[$i][$j]. "'";
				}
		  	    $myQuery7 .= ")";
			    echo "Preparing to insert. Query is: " . $myQuery7 . "<br />";
			    mysql_query($myQuery7, $db_server) or die("Failed to insert..." . mysql_error());			
			}

	$myQuery8 = "DROP TABLE IF EXISTS CityEmpSer";
    mysql_query($myQuery8, $db_server);
    echo "Creating table 'CityEmpSer'<br />";

	$cityEmpListSer = array( array("47", "Tacoma", "01", "WA602", "1682"),
	 	  					array( "47", "Tacoma", "01", "WA603", "497"),
	 	  					array( "47", "Tacoma", "01", "WA604", "255"),
	 	  					array( "47", "Tacoma", "01", "WA605", "879"),
	 	  					array( "47", "Tacoma", "01", "WA606", "468"),
	 	  					array( "47", "Tacoma", "01", "WA607", "1435"),
	 	  					array( "47", "Tacoma", "01", "WA608", "257"),
	 	  					array( "47", "Tacoma", "01", "WA609.03", "201"),
	 	  					array( "47", "Tacoma", "01", "WA609.04", "384"),
	 	  					array( "47", "Tacoma", "01", "WA609.05", "724"),
	 	  					array( "47", "Tacoma", "01", "WA609.06", "332"),
	 	  					array( "47", "Tacoma", "01", "WA610.01", "244"),
	 	  					array( "47", "Tacoma", "01", "WA610.02", "1784"),
	 	  					array( "47", "Tacoma", "01", "WA611", "3779"),
	 	  					array( "47", "Tacoma", "01", "WA612", "635"),
	 	  					array( "47", "Tacoma", "01", "WA613", "742"),
	 	  					array( "47", "Tacoma", "01", "WA614", "5839"),
	 	  					array( "47", "Tacoma", "01", "WA615", "7193"),
	 	  					array( "47", "Tacoma", "01", "WA616.01", "5545"),
	 	  					array( "47", "Tacoma", "01", "WA616.02", "1557"),
	 	  					array( "47", "Tacoma", "01", "WA617", "2123"),
	 	  					array( "47", "Tacoma", "01", "WA618", "185"),
	 	  					array( "47", "Tacoma", "01", "WA619", "827"),
	 	  					array( "47", "Tacoma", "01", "WA620", "227"),
	 	  					array( "47", "Tacoma", "01", "WA623", "92"),
	 	  					array( "47", "Tacoma", "01", "WA624", "310"),
	 	  					array( "47", "Tacoma", "01", "WA625", "241"),
	 	  					array( "47", "Tacoma", "01", "WA626", "4201"),
	 	  					array( "47", "Tacoma", "01", "WA628.01", "624"),
	 	  					array( "47", "Tacoma", "01", "WA628.02", "469"),
	 	  					array( "47", "Tacoma", "01", "WA629", "339"),
	 	  					array( "47", "Tacoma", "01", "WA630", "358"),
	 	  					array( "47", "Tacoma", "01", "WA631", "782"),
	 	  					array( "47", "Tacoma", "01", "WA632", "317"),
	 	  					array( "47", "Tacoma", "01", "WA633", "509"),
	 	  					array( "47", "Tacoma", "01", "WA634", "1076"),
	 	  					array( "47", "Tacoma", "01", "WA635.01", "488"),
	 	  					array( "47", "Tacoma", "01", "WA635.02", "153"),
	 	  					array( "47", "Tacoma", "01", "WA716", "247"),
	 	  					array( "47", "Tacoma", "01", "WA717.03", "543"),
	 	  					array( "47", "Tacoma", "01", "WA717.04", "272"),
	 	  					array( "47", "Tacoma", "01", "WA717.05", "559"),
	 	  					array( "47", "Tacoma", "01", "WA718", "687"),
	 	  					array( "47", "Tacoma", "01", "WA723.05", "618"),
	 	  					array( "47", "Tacoma", "01", "WA723.09", "141"),
	 	  					array( "47", "Tacoma", "01", "WA723.10", "461"),
	 	  					array( "47", "Tacoma", "01", "WA723.11", "1214")

	 	);

		$myQuery8= "CREATE TABLE CityEmpSer (stateID   VARCHAR(10),
			                    cityName VARCHAR(20),
			                    cityEmpID VARCHAR(20),
			                    censusTract	VARCHAR(20),
			                    empPop VARCHAR(30),
								PRIMARY KEY (censusTract)
								)";


	mysql_query($myQuery8, $db_server) or die("Failed to create table " . mysql_error());
	echo "Table created...<br />";

		for($i = 0; $i < count($cityEmpListSer); $i++)
             {
				$myQuery8 = "INSERT INTO CityEmpSer VALUES ('". $cityEmpListSer[$i][0]."'";
			    //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
				for ($j = 1; $j < count($cityEmpListSer[$i]); $j++)
				{
			         //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
					 $myQuery8 .= ", '".$cityEmpListSer[$i][$j]. "'";
				}
		  	    $myQuery8 .= ")";
			    echo "Preparing to insert. Query is: " . $myQuery8 . "<br />";
			    mysql_query($myQuery8, $db_server) or die("Failed to insert..." . mysql_error());			
			}

	$myQuery9 = "DROP TABLE IF EXISTS CityEmpWTU";
    mysql_query($myQuery9, $db_server);
    echo "Creating table 'CityEmpWTU'<br />";

	$cityEmpListWTU = array( array("47", "Tacoma", "01", "WA602", "2446"),
	 	  					array( "47", "Tacoma", "01", "WA603", "6"),
	 	  					array( "47", "Tacoma", "01", "WA604", "0"),
	 	  					array( "47", "Tacoma", "01", "WA605", "13"),
	 	  					array( "47", "Tacoma", "01", "WA606", "30"),
	 	  					array( "47", "Tacoma", "01", "WA607", "7"),
	 	  					array( "47", "Tacoma", "01", "WA608", "6"),
	 	  					array( "47", "Tacoma", "01", "WA609.03", "0"),
	 	  					array( "47", "Tacoma", "01", "WA609.04", "0"),
	 	  					array( "47", "Tacoma", "01", "WA609.05", "0"),
	 	  					array( "47", "Tacoma", "01", "WA609.06", "0"),
	 	  					array( "47", "Tacoma", "01", "WA610.01", "13"),
	 	  					array( "47", "Tacoma", "01", "WA610.02", "38"),
	 	  					array( "47", "Tacoma", "01", "WA611", "74"),
	 	  					array( "47", "Tacoma", "01", "WA612", "0"),
	 	  					array( "47", "Tacoma", "01", "WA613", "40"),
	 	  					array( "47", "Tacoma", "01", "WA614", "61"),
	 	  					array( "47", "Tacoma", "01", "WA615", "0"),
	 	  					array( "47", "Tacoma", "01", "WA616.01", "22"),
	 	  					array( "47", "Tacoma", "01", "WA616.02", "49"),
	 	  					array( "47", "Tacoma", "01", "WA617", "0"),
	 	  					array( "47", "Tacoma", "01", "WA618", "104"),
	 	  					array( "47", "Tacoma", "01", "WA619", "0"),
	 	  					array( "47", "Tacoma", "01", "WA620", "0"),
	 	  					array( "47", "Tacoma", "01", "WA623", "0"),
	 	  					array( "47", "Tacoma", "01", "WA624", "0"),
	 	  					array( "47", "Tacoma", "01", "WA625", "0"),
	 	  					array( "47", "Tacoma", "01", "WA626", "0"),
	 	  					array( "47", "Tacoma", "01", "WA628.01", "1665"),
	 	  					array( "47", "Tacoma", "01", "WA628.02", "85"),
	 	  					array( "47", "Tacoma", "01", "WA629", "28"),
	 	  					array( "47", "Tacoma", "01", "WA630", "28"),
	 	  					array( "47", "Tacoma", "01", "WA631", "351"),
	 	  					array( "47", "Tacoma", "01", "WA632", "0"),
	 	  					array( "47", "Tacoma", "01", "WA633", "0"),
	 	  					array( "47", "Tacoma", "01", "WA634", "38"),
	 	  					array( "47", "Tacoma", "01", "WA635.01", "0"),
	 	  					array( "47", "Tacoma", "01", "WA635.02", "19"),
	 	  					array( "47", "Tacoma", "01", "WA716", "0"),
	 	  					array( "47", "Tacoma", "01", "WA717.03", "47"),
	 	  					array( "47", "Tacoma", "01", "WA717.04", "0"),
	 	  					array( "47", "Tacoma", "01", "WA717.05", "164"),
	 	  					array( "47", "Tacoma", "01", "WA718", "49"),
	 	  					array( "47", "Tacoma", "01", "WA723.05", "72"),
	 	  					array( "47", "Tacoma", "01", "WA723.09", "0"),
	 	  					array( "47", "Tacoma", "01", "WA723.10", "0"),
	 	  					array( "47", "Tacoma", "01", "WA723.11", "77")

	 	);

		$myQuery9= "CREATE TABLE CityEmpWTU (stateID   VARCHAR(10),
			                    cityName VARCHAR(20),
			                    cityEmpID VARCHAR(20),
			                    censusTract	VARCHAR(20),
			                    empPop VARCHAR(30),
								PRIMARY KEY (censusTract)
								)";


	mysql_query($myQuery9, $db_server) or die("Failed to create table " . mysql_error());
	echo "Table created...<br />";

		for($i = 0; $i < count($cityEmpListWTU); $i++)
             {
				$myQuery9 = "INSERT INTO CityEmpWTU VALUES ('". $cityEmpListWTU[$i][0]."'";
			    //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
				for ($j = 1; $j < count($cityEmpListWTU[$i]); $j++)
				{
			         //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
					 $myQuery9 .= ", '".$cityEmpListWTU[$i][$j]. "'";
				}
		  	    $myQuery9 .= ")";
			    echo "Preparing to insert. Query is: " . $myQuery9 . "<br />";
			    mysql_query($myQuery9, $db_server) or die("Failed to insert..." . mysql_error());			
			}

	$myQuery10 = "DROP TABLE IF EXISTS CityEmpGov";
    mysql_query($myQuery10, $db_server);
    echo "Creating table 'CityEmpGov'<br />";

	$cityEmpListGov = array( array("47", "Tacoma", "01", "WA602", "732"),
	 	  					array( "47", "Tacoma", "01", "WA603", "136"),
	 	  					array( "47", "Tacoma", "01", "WA604", "16"),
	 	  					array( "47", "Tacoma", "01", "WA605", "47"),
	 	  					array( "47", "Tacoma", "01", "WA606", "32"),
	 	  					array( "47", "Tacoma", "01", "WA607", "83"),
	 	  					array( "47", "Tacoma", "01", "WA608", "1"),
	 	  					array( "47", "Tacoma", "01", "WA609.03", "6"),
	 	  					array( "47", "Tacoma", "01", "WA609.04", "16"),
	 	  					array( "47", "Tacoma", "01", "WA609.05", "0"),
	 	  					array( "47", "Tacoma", "01", "WA609.06", "218"),
	 	  					array( "47", "Tacoma", "01", "WA610.01", "21"),
	 	  					array( "47", "Tacoma", "01", "WA610.02", "94"),
	 	  					array( "47", "Tacoma", "01", "WA611", "637"),
	 	  					array( "47", "Tacoma", "01", "WA612", "38"),
	 	  					array( "47", "Tacoma", "01", "WA613", "130"),
	 	  					array( "47", "Tacoma", "01", "WA614", "1230"),
	 	  					array( "47", "Tacoma", "01", "WA615", "16"),
	 	  					array( "47", "Tacoma", "01", "WA616.01", "1303"),
	 	  					array( "47", "Tacoma", "01", "WA616.02", "224"),
	 	  					array( "47", "Tacoma", "01", "WA617", "509"),
	 	  					array( "47", "Tacoma", "01", "WA618", "5"),
	 	  					array( "47", "Tacoma", "01", "WA619", "688"),
	 	  					array( "47", "Tacoma", "01", "WA620", "40"),
	 	  					array( "47", "Tacoma", "01", "WA623", "0"),
	 	  					array( "47", "Tacoma", "01", "WA624", "23"),
	 	  					array( "47", "Tacoma", "01", "WA625", "39"),
	 	  					array( "47", "Tacoma", "01", "WA626", "3271"),
	 	  					array( "47", "Tacoma", "01", "WA628.01", "214"),
	 	  					array( "47", "Tacoma", "01", "WA628.02", "0"),
	 	  					array( "47", "Tacoma", "01", "WA629", "96"),
	 	  					array( "47", "Tacoma", "01", "WA630", "0"),
	 	  					array( "47", "Tacoma", "01", "WA631", "13"),
	 	  					array( "47", "Tacoma", "01", "WA632", "10"),
	 	  					array( "47", "Tacoma", "01", "WA633", "48"),
	 	  					array( "47", "Tacoma", "01", "WA634", "0"),
	 	  					array( "47", "Tacoma", "01", "WA635.01", "27"),
	 	  					array( "47", "Tacoma", "01", "WA635.02", "0"),
	 	  					array( "47", "Tacoma", "01", "WA716", "38"),
	 	  					array( "47", "Tacoma", "01", "WA717.03", "36"),
	 	  					array( "47", "Tacoma", "01", "WA717.04", "0"),
	 	  					array( "47", "Tacoma", "01", "WA717.05", "0"),
	 	  					array( "47", "Tacoma", "01", "WA718", "0"),
	 	  					array( "47", "Tacoma", "01", "WA723.05", "73"),
	 	  					array( "47", "Tacoma", "01", "WA723.09", "9"),
	 	  					array( "47", "Tacoma", "01", "WA723.10", "0"),
	 	  					array( "47", "Tacoma", "01", "WA723.11", "216")

	 	);

		$myQuery10= "CREATE TABLE CityEmpGov (stateID   VARCHAR(10),
			                    cityName VARCHAR(20),
			                    cityEmpID VARCHAR(20),
			                    censusTract	VARCHAR(20),
			                    empPop VARCHAR(30),
								PRIMARY KEY (censusTract)
								)";


	mysql_query($myQuery10, $db_server) or die("Failed to create table " . mysql_error());
	echo "Table created...<br />";

		for($i = 0; $i < count($cityEmpListGov); $i++)
             {
				$myQuery10 = "INSERT INTO CityEmpGov VALUES ('". $cityEmpListGov[$i][0]."'";
			    //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
				for ($j = 1; $j < count($cityEmpListGov[$i]); $j++)
				{
			         //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
					 $myQuery10 .= ", '".$cityEmpListGov[$i][$j]. "'";
				}
		  	    $myQuery10 .= ")";
			    echo "Preparing to insert. Query is: " . $myQuery10 . "<br />";
			    mysql_query($myQuery10, $db_server) or die("Failed to insert..." . mysql_error());			
			}


	$myQuery11 = "DROP TABLE IF EXISTS CityEmpEd";
    mysql_query($myQuery11, $db_server);
    echo "Creating table 'CityEmpEd'<br />";

	$cityEmpListEd = array( array("47", "Tacoma", "01", "WA602", "0"),
	 	  					array( "47", "Tacoma", "01", "WA603", "0"),
	 	  					array( "47", "Tacoma", "01", "WA604", "60"),
	 	  					array( "47", "Tacoma", "01", "WA605", "38"),
	 	  					array( "47", "Tacoma", "01", "WA606", "124"),
	 	  					array( "47", "Tacoma", "01", "WA607", "60"),
	 	  					array( "47", "Tacoma", "01", "WA608", "113"),
	 	  					array( "47", "Tacoma", "01", "WA609.03", "51"),
	 	  					array( "47", "Tacoma", "01", "WA609.04", "82"),
	 	  					array( "47", "Tacoma", "01", "WA609.05", "107"),
	 	  					array( "47", "Tacoma", "01", "WA609.06", "223"),
	 	  					array( "47", "Tacoma", "01", "WA610.01", "32"),
	 	  					array( "47", "Tacoma", "01", "WA610.02", "888"),
	 	  					array( "47", "Tacoma", "01", "WA611", "260"),
	 	  					array( "47", "Tacoma", "01", "WA612", "52"),
	 	  					array( "47", "Tacoma", "01", "WA613", "140"),
	 	  					array( "47", "Tacoma", "01", "WA614", "483"),
	 	  					array( "47", "Tacoma", "01", "WA615", "205"),
	 	  					array( "47", "Tacoma", "01", "WA616.01", "0"),
	 	  					array( "47", "Tacoma", "01", "WA616.02", "502"),
	 	  					array( "47", "Tacoma", "01", "WA617", "94"),
	 	  					array( "47", "Tacoma", "01", "WA618", "303"),
	 	  					array( "47", "Tacoma", "01", "WA619", "0"),
	 	  					array( "47", "Tacoma", "01", "WA620", "181"),
	 	  					array( "47", "Tacoma", "01", "WA623", "65"),
	 	  					array( "47", "Tacoma", "01", "WA624", "137"),
	 	  					array( "47", "Tacoma", "01", "WA625", "222"),
	 	  					array( "47", "Tacoma", "01", "WA626", "54"),
	 	  					array( "47", "Tacoma", "01", "WA628.01", "31"),
	 	  					array( "47", "Tacoma", "01", "WA628.02", "292"),
	 	  					array( "47", "Tacoma", "01", "WA629", "219"),
	 	  					array( "47", "Tacoma", "01", "WA630", "131"),
	 	  					array( "47", "Tacoma", "01", "WA631", "0"),
	 	  					array( "47", "Tacoma", "01", "WA632", "71"),
	 	  					array( "47", "Tacoma", "01", "WA633", "62"),
	 	  					array( "47", "Tacoma", "01", "WA634", "76"),
	 	  					array( "47", "Tacoma", "01", "WA635.01", "172"),
	 	  					array( "47", "Tacoma", "01", "WA635.02", "107"),
	 	  					array( "47", "Tacoma", "01", "WA716", "60"),
	 	  					array( "47", "Tacoma", "01", "WA717.03", "0"),
	 	  					array( "47", "Tacoma", "01", "WA717.04", "0"),
	 	  					array( "47", "Tacoma", "01", "WA717.05", "59"),
	 	  					array( "47", "Tacoma", "01", "WA718", "553"),
	 	  					array( "47", "Tacoma", "01", "WA723.05", "96"),
	 	  					array( "47", "Tacoma", "01", "WA723.09", "68"),
	 	  					array( "47", "Tacoma", "01", "WA723.10", "348"),
	 	  					array( "47", "Tacoma", "01", "WA723.11", "65")

	 	);

		$myQuery11= "CREATE TABLE CityEmpEd(stateID   VARCHAR(10),
			                    cityName VARCHAR(20),
			                    cityEmpID VARCHAR(20),
			                    censusTract	VARCHAR(20),
			                    empPop VARCHAR(30),
								PRIMARY KEY (censusTract)
								)";


	mysql_query($myQuery11, $db_server) or die("Failed to create table " . mysql_error());
	echo "Table created...<br />";

		for($i = 0; $i < count($cityEmpListEd); $i++)
             {
				$myQuery11 = "INSERT INTO CityEmpEd VALUES ('". $cityEmpListEd[$i][0]."'";
			    //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
				for ($j = 1; $j < count($cityEmpListEd[$i]); $j++)
				{
			         //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
					 $myQuery11 .= ", '".$cityEmpListEd[$i][$j]. "'";
				}
		  	    $myQuery11 .= ")";
			    echo "Preparing to insert. Query is: " . $myQuery11 . "<br />";
			    mysql_query($myQuery11, $db_server) or die("Failed to insert..." . mysql_error());			
			}

	$myQuery12 = "DROP TABLE IF EXISTS StateShapes";
    mysql_query($myQuery12, $db_server);
    echo "Creating table 'StateShapes'<br />";

    $myQuery12= "CREATE TABLE StateShapes(stateID   VARCHAR(10),
			                    cityName VARCHAR(20),
			                  	shapeFile VARCHAR(20),
								PRIMARY KEY (shapeFile)
								)";

	mysql_query($myQuery12, $db_server) or die("Failed to create table " . mysql_error());
	echo "Table created...<br />";

	mysql_close($db_server);     // close the connection

?>



