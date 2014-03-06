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


	$myQuery3 = "DROP TABLE IF EXISTS CityPop14";
    mysql_query($myQuery3, $db_server);
    echo "Creating table 'CityPop14'<br />";

	 $cityPopList14 = array( array("47", "Tacoma", "01", "WA602", "17"),
	 	  					array( "47", "Tacoma", "01", "WA603", "431"),
	 	  					array( "47", "Tacoma", "01", "WA604", "703"),
	 	  					array( "47", "Tacoma", "01", "WA605", "675"),
	 	  					array( "47", "Tacoma", "01", "WA606", "840"),
	 	  					array( "47", "Tacoma", "01", "WA607", "768"),
	 	  					array( "47", "Tacoma", "01", "WA608", "839"),
	 	  					array( "47", "Tacoma", "01", "WA609.03", "404"),
	 	  					array( "47", "Tacoma", "01", "WA609.04", "1014"),
	 	  					array( "47", "Tacoma", "01", "WA609.05", "931"),
	 	  					array( "47", "Tacoma", "01", "WA609.06", "296"),
	 	  					array( "47", "Tacoma", "01", "WA610.01", "505"),
	 	  					array( "47", "Tacoma", "01", "WA610.02", "561"),
	 	  					array( "47", "Tacoma", "01", "WA611", "1056"),
	 	  					array( "47", "Tacoma", "01", "WA612", "856"),
	 	  					array( "47", "Tacoma", "01", "WA613", "1146"),
	 	  					array( "47", "Tacoma", "01", "WA614", "599"),
	 	  					array( "47", "Tacoma", "01", "WA615", "317"),
	 	  					array( "47", "Tacoma", "01", "WA616.01", "131"),
	 	  					array( "47", "Tacoma", "01", "WA616.02", "61"),
	 	  					array( "47", "Tacoma", "01", "WA617", "972"),
	 	  					array( "47", "Tacoma", "01", "WA618", "635"),
	 	  					array( "47", "Tacoma", "01", "WA619", "340"),
	 	  					array( "47", "Tacoma", "01", "WA620", "894"),
	 	  					array( "47", "Tacoma", "01", "WA623", "1295"),
	 	  					array( "47", "Tacoma", "01", "WA624", "1134"),
	 	  					array( "47", "Tacoma", "01", "WA625", "1456"),
	 	  					array( "47", "Tacoma", "01", "WA626", "669"),
	 	  					array( "47", "Tacoma", "01", "WA628.01", "1405"),
	 	  					array( "47", "Tacoma", "01", "WA628.02", "926"),
	 	  					array( "47", "Tacoma", "01", "WA629", "1577"),
	 	  					array( "47", "Tacoma", "01", "WA630", "648"),
	 	  					array( "47", "Tacoma", "01", "WA631", "802"),
	 	  					array( "47", "Tacoma", "01", "WA632", "950"),
	 	  					array( "47", "Tacoma", "01", "WA633", "1994"),
	 	  					array( "47", "Tacoma", "01", "WA634", "1623"),
	 	  					array( "47", "Tacoma", "01", "WA635.01", "824"),
	 	  					array( "47", "Tacoma", "01", "WA635.02", "1211"),
	 	  					array( "47", "Tacoma", "01", "WA716", "21"),
	 	  					array( "47", "Tacoma", "01", "WA717.03", "520"),
	 	  					array( "47", "Tacoma", "01", "WA717.04", "0"),
	 	  					array( "47", "Tacoma", "01", "WA717.05", "7"),
	 	  					array( "47", "Tacoma", "01", "WA718", "2"),
	 	  					array( "47", "Tacoma", "01", "WA723.05", "0"),
	 	  					array( "47", "Tacoma", "01", "WA723.09", "350"),
	 	  					array( "47", "Tacoma", "01", "WA723.10", "7"),
	 	  					array( "47", "Tacoma", "01", "WA723.11", "0"),
	 	  					array( "47", "Tacoma", "01", "WA723.12", "329"),
	 	  					array( "47", "Tacoma", "01", "WA9400.01", "224"),
	 	  					array( "47", "Tacoma", "01", "WA9400.02", "38"),
	 	  					array( "47", "Tacoma", "01", "WA9400.04", "0"),
	 	  					array( "47", "Tacoma", "01", "WA9400.05", "1341"),
	 	  					array( "47", "Tacoma", "01", "WA9400.06", "996"),
	 	  					array( "47", "Tacoma", "01", "WA9400.07", "819"),
	 	  					array( "47", "Tacoma", "01", "WA9400.08", "1238"),
	 	  					array( "47", "Tacoma", "01", "WA9400.11", "703")

	 	);

		$myQuery3= "CREATE TABLE CityPop14 (stateID   VARCHAR(10),
			                    cityName VARCHAR(20),
			                    cityPopID VARCHAR(20),
			                    censusTract	VARCHAR(20),
			                    cityPop VARCHAR(30),
								PRIMARY KEY (censusTract)
								)";


	mysql_query($myQuery3, $db_server) or die("Failed to create table " . mysql_error());
	echo "Table created...<br />";

		for($i = 0; $i < count($cityPopList14); $i++)
             {
				$myQuery3 = "INSERT INTO CityPop14 VALUES ('". $cityPopList14[$i][0]."'";
			    //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
				for ($j = 1; $j < count($cityPopList14[$i]); $j++)
				{
			         //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
					 $myQuery3 .= ", '".$cityPopList14[$i][$j]. "'";
				}
		  	    $myQuery3 .= ")";
			    echo "Preparing to insert. Query is: " . $myQuery3 . "<br />";
			    mysql_query($myQuery3, $db_server) or die("Failed to insert..." . mysql_error());			
			}

$myQuery4 = "DROP TABLE IF EXISTS CityPop19";
    mysql_query($myQuery4, $db_server);
    echo "Creating table 'CityPop19'<br />";

	 $cityPopList19 = array( array("47", "Tacoma", "01", "WA602", "67"),
	 	  					array( "47", "Tacoma", "01", "WA603", "164"),
	 	  					array( "47", "Tacoma", "01", "WA604", "206"),
	 	  					array( "47", "Tacoma", "01", "WA605", "207"),
	 	  					array( "47", "Tacoma", "01", "WA606", "263"),
	 	  					array( "47", "Tacoma", "01", "WA607", "1033"),
	 	  					array( "47", "Tacoma", "01", "WA608", "252"),
	 	  					array( "47", "Tacoma", "01", "WA609.03", "168"),
	 	  					array( "47", "Tacoma", "01", "WA609.04", "266"),
	 	  					array( "47", "Tacoma", "01", "WA609.05", "365"),
	 	  					array( "47", "Tacoma", "01", "WA609.06", "134"),
	 	  					array( "47", "Tacoma", "01", "WA610.01", "221"),
	 	  					array( "47", "Tacoma", "01", "WA610.02", "244"),
	 	  					array( "47", "Tacoma", "01", "WA611", "324"),
	 	  					array( "47", "Tacoma", "01", "WA612", "291"),
	 	  					array( "47", "Tacoma", "01", "WA613", "334"),
	 	  					array( "47", "Tacoma", "01", "WA614", "238"),
	 	  					array( "47", "Tacoma", "01", "WA615", "146"),
	 	  					array( "47", "Tacoma", "01", "WA616.01", "48"),
	 	  					array( "47", "Tacoma", "01", "WA616.02", "50"),
	 	  					array( "47", "Tacoma", "01", "WA617", "338"),
	 	  					array( "47", "Tacoma", "01", "WA618", "198"),
	 	  					array( "47", "Tacoma", "01", "WA619", "116"),
	 	  					array( "47", "Tacoma", "01", "WA620", "262"),
	 	  					array( "47", "Tacoma", "01", "WA623", "411"),
	 	  					array( "47", "Tacoma", "01", "WA624", "323"),
	 	  					array( "47", "Tacoma", "01", "WA625", "492"),
	 	  					array( "47", "Tacoma", "01", "WA626", "162"),
	 	  					array( "47", "Tacoma", "01", "WA628.01", "415"),
	 	  					array( "47", "Tacoma", "01", "WA628.02", "334"),
	 	  					array( "47", "Tacoma", "01", "WA629", "522"),
	 	  					array( "47", "Tacoma", "01", "WA630", "213"),
	 	  					array( "47", "Tacoma", "01", "WA631", "248"),
	 	  					array( "47", "Tacoma", "01", "WA632", "318"),
	 	  					array( "47", "Tacoma", "01", "WA633", "618"),
	 	  					array( "47", "Tacoma", "01", "WA634", "557"),
	 	  					array( "47", "Tacoma", "01", "WA635.01", "301"),
	 	  					array( "47", "Tacoma", "01", "WA635.02", "376"),
	 	  					array( "47", "Tacoma", "01", "WA716", "6"),
	 	  					array( "47", "Tacoma", "01", "WA717.03", "127"),
	 	  					array( "47", "Tacoma", "01", "WA717.04", "0"),
	 	  					array( "47", "Tacoma", "01", "WA717.05", "4"),
	 	  					array( "47", "Tacoma", "01", "WA718", "0"),
	 	  					array( "47", "Tacoma", "01", "WA723.05", "0"),
	 	  					array( "47", "Tacoma", "01", "WA723.09", "85"),
	 	  					array( "47", "Tacoma", "01", "WA723.10", "5"),
	 	  					array( "47", "Tacoma", "01", "WA723.11", "1"),
	 	  					array( "47", "Tacoma", "01", "WA723.12", "58"),
	 	  					array( "47", "Tacoma", "01", "WA9400.01", "59"),
	 	  					array( "47", "Tacoma", "01", "WA9400.02", "12"),
	 	  					array( "47", "Tacoma", "01", "WA9400.04", "0"),
	 	  					array( "47", "Tacoma", "01", "WA9400.05", "499"),
	 	  					array( "47", "Tacoma", "01", "WA9400.06", "231"),
	 	  					array( "47", "Tacoma", "01", "WA9400.07", "253"),
	 	  					array( "47", "Tacoma", "01", "WA9400.08", "466"),
	 	  					array( "47", "Tacoma", "01", "WA9400.11", "250")

	 	);

		$myQuery4 = "CREATE TABLE CityPop19 (stateID   VARCHAR(10),
			                    cityName VARCHAR(20),
			                    cityPopID VARCHAR(20),
			                    censusTract	VARCHAR(20),
			                    cityPop VARCHAR(30),
								PRIMARY KEY (censusTract)
								)";


	mysql_query($myQuery4, $db_server) or die("Failed to create table " . mysql_error());
	echo "Table created...<br />";

		for($i = 0; $i < count($cityPopList19); $i++)
             {
				$myQuery4 = "INSERT INTO CityPop19 VALUES ('". $cityPopList19[$i][0]."'";
			    //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
				for ($j = 1; $j < count($cityPopList19[$i]); $j++)
				{
			         //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
					 $myQuery4 .= ", '".$cityPopList19[$i][$j]. "'";
				}
		  	    $myQuery4 .= ")";
			    echo "Preparing to insert. Query is: " . $myQuery4 . "<br />";
			    mysql_query($myQuery4, $db_server) or die("Failed to insert..." . mysql_error());			
			}


	$myQuery5= "DROP TABLE IF EXISTS CityPop24";
    mysql_query($myQuery5, $db_server);
    echo "Creating table 'CityPop24'<br />";

	 $cityPopList24 = array( array("47", "Tacoma", "01", "WA602", "329"),
	 	  					array( "47", "Tacoma", "01", "WA603", "127"),
	 	  					array( "47", "Tacoma", "01", "WA604", "147"),
	 	  					array( "47", "Tacoma", "01", "WA605", "261"),
	 	  					array( "47", "Tacoma", "01", "WA606", "326"),
	 	  					array( "47", "Tacoma", "01", "WA607", "1376"),
	 	  					array( "47", "Tacoma", "01", "WA608", "285"),
	 	  					array( "47", "Tacoma", "01", "WA609.03", "153"),
	 	  					array( "47", "Tacoma", "01", "WA609.04", "320"),
	 	  					array( "47", "Tacoma", "01", "WA609.05", "382"),
	 	  					array( "47", "Tacoma", "01", "WA609.06", "122"),
	 	  					array( "47", "Tacoma", "01", "WA610.01", "154"),
	 	  					array( "47", "Tacoma", "01", "WA610.02", "383"),
	 	  					array( "47", "Tacoma", "01", "WA611", "378"),
	 	  					array( "47", "Tacoma", "01", "WA612", "413"),
	 	  					array( "47", "Tacoma", "01", "WA613", "389"),
	 	  					array( "47", "Tacoma", "01", "WA614", "519"),
	 	  					array( "47", "Tacoma", "01", "WA615", "560"),
	 	  					array( "47", "Tacoma", "01", "WA616.01", "199"),
	 	  					array( "47", "Tacoma", "01", "WA616.02", "114"),
	 	  					array( "47", "Tacoma", "01", "WA617", "347"),
	 	  					array( "47", "Tacoma", "01", "WA618", "197"),
	 	  					array( "47", "Tacoma", "01", "WA619", "127"),
	 	  					array( "47", "Tacoma", "01", "WA620", "277"),
	 	  					array( "47", "Tacoma", "01", "WA623", "349"),
	 	  					array( "47", "Tacoma", "01", "WA624", "300"),
	 	  					array( "47", "Tacoma", "01", "WA625", "463"),
	 	  					array( "47", "Tacoma", "01", "WA626", "305"),
	 	  					array( "47", "Tacoma", "01", "WA628.01", "693"),
	 	  					array( "47", "Tacoma", "01", "WA628.02", "264"),
	 	  					array( "47", "Tacoma", "01", "WA629", "800"),
	 	  					array( "47", "Tacoma", "01", "WA630", "220"),
	 	  					array( "47", "Tacoma", "01", "WA631", "298"),
	 	  					array( "47", "Tacoma", "01", "WA632", "299"),
	 	  					array( "47", "Tacoma", "01", "WA633", "532"),
	 	  					array( "47", "Tacoma", "01", "WA634", "568"),
	 	  					array( "47", "Tacoma", "01", "WA635.01", "288"),
	 	  					array( "47", "Tacoma", "01", "WA635.02", "419"),
	 	  					array( "47", "Tacoma", "01", "WA716", "5"),
	 	  					array( "47", "Tacoma", "01", "WA717.03", "319"),
	 	  					array( "47", "Tacoma", "01", "WA717.04", "0"),
	 	  					array( "47", "Tacoma", "01", "WA717.05", "4"),
	 	  					array( "47", "Tacoma", "01", "WA718", "0"),
	 	  					array( "47", "Tacoma", "01", "WA723.05", "0"),
	 	  					array( "47", "Tacoma", "01", "WA723.09", "292"),
	 	  					array( "47", "Tacoma", "01", "WA723.10", "7"),
	 	  					array( "47", "Tacoma", "01", "WA723.11", "0"),
	 	  					array( "47", "Tacoma", "01", "WA723.12", "136"),
	 	  					array( "47", "Tacoma", "01", "WA9400.01", "19"),
	 	  					array( "47", "Tacoma", "01", "WA9400.02", "11"),
	 	  					array( "47", "Tacoma", "01", "WA9400.04", "0"),
	 	  					array( "47", "Tacoma", "01", "WA9400.05", "373"),
	 	  					array( "47", "Tacoma", "01", "WA9400.06", "139"),
	 	  					array( "47", "Tacoma", "01", "WA9400.07", "218"),
	 	  					array( "47", "Tacoma", "01", "WA9400.08", "388"),
	 	  					array( "47", "Tacoma", "01", "WA9400.11", "138")

	 	);

		$myQuery5= "CREATE TABLE CityPop24 (stateID   VARCHAR(10),
			                    cityName VARCHAR(20),
			                    cityPopID VARCHAR(20),
			                    censusTract	VARCHAR(20),
			                    cityPop VARCHAR(30),
								PRIMARY KEY (censusTract)
								)";


	mysql_query($myQuery5, $db_server) or die("Failed to create table " . mysql_error());
	echo "Table created...<br />";

			for($i = 0; $i < count($cityPopList24); $i++)
             {
				$myQuery5 = "INSERT INTO CityPop24 VALUES ('". $cityPopList24[$i][0]."'";
			    //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
				for ($j = 1; $j < count($cityPopList24[$i]); $j++)
				{
			         //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
					 $myQuery5 .= ", '".$cityPopList24[$i][$j]. "'";
				}
		  	    $myQuery5 .= ")";
			    echo "Preparing to insert. Query is: " . $myQuery5 . "<br />";
			    mysql_query($myQuery5, $db_server) or die("Failed to insert..." . mysql_error());			
			}


	$myQuery6= "DROP TABLE IF EXISTS CityPop34";
    mysql_query($myQuery6, $db_server);
    echo "Creating table 'CityPop34'<br />";

	 $cityPopList34 = array( array("47", "Tacoma", "01", "WA602", "656"),
	 	  					array( "47", "Tacoma", "01", "WA603", "442"),
	 	  					array( "47", "Tacoma", "01", "WA604", "510"),
	 	  					array( "47", "Tacoma", "01", "WA605", "347"),
	 	  					array( "47", "Tacoma", "01", "WA606", "893"),
	 	  					array( "47", "Tacoma", "01", "WA607", "797"),
	 	  					array( "47", "Tacoma", "01", "WA608", "778"),
	 	  					array( "47", "Tacoma", "01", "WA609.03", "312"),
	 	  					array( "47", "Tacoma", "01", "WA609.04", "827"),
	 	  					array( "47", "Tacoma", "01", "WA609.05", "678"),
	 	  					array( "47", "Tacoma", "01", "WA609.06", "190"),
	 	  					array( "47", "Tacoma", "01", "WA610.01", "394"),
	 	  					array( "47", "Tacoma", "01", "WA610.02", "696"),
	 	  					array( "47", "Tacoma", "01", "WA611", "1029"),
	 	  					array( "47", "Tacoma", "01", "WA612", "982"),
	 	  					array( "47", "Tacoma", "01", "WA613", "865"),
	 	  					array( "47", "Tacoma", "01", "WA614", "977"),
	 	  					array( "47", "Tacoma", "01", "WA615", "1275"),
	 	  					array( "47", "Tacoma", "01", "WA616.01", "399"),
	 	  					array( "47", "Tacoma", "01", "WA616.02", "248"),
	 	  					array( "47", "Tacoma", "01", "WA617", "876"),
	 	  					array( "47", "Tacoma", "01", "WA618", "533"),
	 	  					array( "47", "Tacoma", "01", "WA619", "342"),
	 	  					array( "47", "Tacoma", "01", "WA620", "656"),
	 	  					array( "47", "Tacoma", "01", "WA623", "842"),
	 	  					array( "47", "Tacoma", "01", "WA624", "912"),
	 	  					array( "47", "Tacoma", "01", "WA625", "1207"),
	 	  					array( "47", "Tacoma", "01", "WA626", "570"),
	 	  					array( "47", "Tacoma", "01", "WA628.01", "1251"),
	 	  					array( "47", "Tacoma", "01", "WA628.02", "610"),
	 	  					array( "47", "Tacoma", "01", "WA629", "1437"),
	 	  					array( "47", "Tacoma", "01", "WA630", "495"),
	 	  					array( "47", "Tacoma", "01", "WA631", "656"),
	 	  					array( "47", "Tacoma", "01", "WA632", "746"),
	 	  					array( "47", "Tacoma", "01", "WA633", "1150"),
	 	  					array( "47", "Tacoma", "01", "WA634", "1175"),
	 	  					array( "47", "Tacoma", "01", "WA635.01", "600"),
	 	  					array( "47", "Tacoma", "01", "WA635.02", "773"),
	 	  					array( "47", "Tacoma", "01", "WA716", "13"),
	 	  					array( "47", "Tacoma", "01", "WA717.03", "420"),
	 	  					array( "47", "Tacoma", "01", "WA717.04", "0"),
	 	  					array( "47", "Tacoma", "01", "WA717.05", "8"),
	 	  					array( "47", "Tacoma", "01", "WA718", "1"),
	 	  					array( "47", "Tacoma", "01", "WA723.05", "0"),
	 	  					array( "47", "Tacoma", "01", "WA723.09", "386"),
	 	  					array( "47", "Tacoma", "01", "WA723.10", "8"),
	 	  					array( "47", "Tacoma", "01", "WA723.11", "0"),
	 	  					array( "47", "Tacoma", "01", "WA723.12", "215"),
	 	  					array( "47", "Tacoma", "01", "WA9400.01", "44"),
	 	  					array( "47", "Tacoma", "01", "WA9400.02", "29"),
	 	  					array( "47", "Tacoma", "01", "WA9400.04", "0"),
	 	  					array( "47", "Tacoma", "01", "WA9400.05", "815"),
	 	  					array( "47", "Tacoma", "01", "WA9400.06", "372"),
	 	  					array( "47", "Tacoma", "01", "WA9400.07", "502"),
	 	  					array( "47", "Tacoma", "01", "WA9400.08", "665"),
	 	  					array( "47", "Tacoma", "01", "WA9400.11", "342")

	 	);

		$myQuery6= "CREATE TABLE CityPop34 (stateID   VARCHAR(10),
			                    cityName VARCHAR(20),
			                    cityPopID VARCHAR(20),
			                    censusTract	VARCHAR(20),
			                    cityPop VARCHAR(30),
								PRIMARY KEY (censusTract)
								)";


	mysql_query($myQuery6, $db_server) or die("Failed to create table " . mysql_error());
	echo "Table created...<br />";

			for($i = 0; $i < count($cityPopList34); $i++)
             {
				$myQuery6 = "INSERT INTO CityPop34 VALUES ('". $cityPopList34[$i][0]."'";
			    //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
				for ($j = 1; $j < count($cityPopList34[$i]); $j++)
				{
			         //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
					 $myQuery6 .= ", '".$cityPopList34[$i][$j]. "'";
				}
		  	    $myQuery6 .= ")";
			    echo "Preparing to insert. Query is: " . $myQuery6 . "<br />";
			    mysql_query($myQuery6, $db_server) or die("Failed to insert..." . mysql_error());			
			}


	$myQuery7= "DROP TABLE IF EXISTS CityPop44";
    mysql_query($myQuery7, $db_server);
    echo "Creating table 'CityPop44'<br />";

	 $cityPopList44 = array( array("47", "Tacoma", "01", "WA602", "324"),
	 	  					array( "47", "Tacoma", "01", "WA603", "396"),
	 	  					array( "47", "Tacoma", "01", "WA604", "605"),
	 	  					array( "47", "Tacoma", "01", "WA605", "535"),
	 	  					array( "47", "Tacoma", "01", "WA606", "805"),
	 	  					array( "47", "Tacoma", "01", "WA607", "743"),
	 	  					array( "47", "Tacoma", "01", "WA608", "731"),
	 	  					array( "47", "Tacoma", "01", "WA609.03", "348"),
	 	  					array( "47", "Tacoma", "01", "WA609.04", "681"),
	 	  					array( "47", "Tacoma", "01", "WA609.05", "624"),
	 	  					array( "47", "Tacoma", "01", "WA609.06", "250"),
	 	  					array( "47", "Tacoma", "01", "WA610.01", "445"),
	 	  					array( "47", "Tacoma", "01", "WA610.02", "501"),
	 	  					array( "47", "Tacoma", "01", "WA611", "838"),
	 	  					array( "47", "Tacoma", "01", "WA612", "713"),
	 	  					array( "47", "Tacoma", "01", "WA613", "655"),
	 	  					array( "47", "Tacoma", "01", "WA614", "775"),
	 	  					array( "47", "Tacoma", "01", "WA615", "646"),
	 	  					array( "47", "Tacoma", "01", "WA616.01", "223"),
	 	  					array( "47", "Tacoma", "01", "WA616.02", "164"),
	 	  					array( "47", "Tacoma", "01", "WA617", "649"),
	 	  					array( "47", "Tacoma", "01", "WA618", "421"),
	 	  					array( "47", "Tacoma", "01", "WA619", "242"),
	 	  					array( "47", "Tacoma", "01", "WA620", "601"),
	 	  					array( "47", "Tacoma", "01", "WA623", "769"),
	 	  					array( "47", "Tacoma", "01", "WA624", "815"),
	 	  					array( "47", "Tacoma", "01", "WA625", "1040"),
	 	  					array( "47", "Tacoma", "01", "WA626", "365"),
	 	  					array( "47", "Tacoma", "01", "WA628.01", "774"),
	 	  					array( "47", "Tacoma", "01", "WA628.02", "568"),
	 	  					array( "47", "Tacoma", "01", "WA629", "962"),
	 	  					array( "47", "Tacoma", "01", "WA630", "428"),
	 	  					array( "47", "Tacoma", "01", "WA631", "549"),
	 	  					array( "47", "Tacoma", "01", "WA632", "662"),
	 	  					array( "47", "Tacoma", "01", "WA633", "1088"),
	 	  					array( "47", "Tacoma", "01", "WA634", "908"),
	 	  					array( "47", "Tacoma", "01", "WA635.01", "513"),
	 	  					array( "47", "Tacoma", "01", "WA635.02", "686"),
	 	  					array( "47", "Tacoma", "01", "WA716", "7"),
	 	  					array( "47", "Tacoma", "01", "WA717.03", "212"),
	 	  					array( "47", "Tacoma", "01", "WA717.04", "0"),
	 	  					array( "47", "Tacoma", "01", "WA717.05", "5"),
	 	  					array( "47", "Tacoma", "01", "WA718", "0"),
	 	  					array( "47", "Tacoma", "01", "WA723.05", "0"),
	 	  					array( "47", "Tacoma", "01", "WA723.09", "147"),
	 	  					array( "47", "Tacoma", "01", "WA723.10", "12"),
	 	  					array( "47", "Tacoma", "01", "WA723.11", "0"),
	 	  					array( "47", "Tacoma", "01", "WA723.12", "123"),
	 	  					array( "47", "Tacoma", "01", "WA9400.01", "162"),
	 	  					array( "47", "Tacoma", "01", "WA9400.02", "30"),
	 	  					array( "47", "Tacoma", "01", "WA9400.04", "0"),
	 	  					array( "47", "Tacoma", "01", "WA9400.05", "945"),
	 	  					array( "47", "Tacoma", "01", "WA9400.06", "243"),
	 	  					array( "47", "Tacoma", "01", "WA9400.07", "399"),
	 	  					array( "47", "Tacoma", "01", "WA9400.08", "961"),
	 	  					array( "47", "Tacoma", "01", "WA9400.11", "485")

	 	);

		$myQuery7= "CREATE TABLE CityPop44 (stateID   VARCHAR(10),
			                    cityName VARCHAR(20),
			                    cityPopID VARCHAR(20),
			                    censusTract	VARCHAR(20),
			                    cityPop VARCHAR(30),
								PRIMARY KEY (censusTract)
								)";


	mysql_query($myQuery7, $db_server) or die("Failed to create table " . mysql_error());
	echo "Table created...<br />";

			for($i = 0; $i < count($cityPopList44); $i++)
             {
				$myQuery7 = "INSERT INTO CityPop44 VALUES ('". $cityPopList44[$i][0]."'";
			    //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
				for ($j = 1; $j < count($cityPopList44[$i]); $j++)
				{
			         //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
					 $myQuery7 .= ", '".$cityPopList44[$i][$j]. "'";
				}
		  	    $myQuery7 .= ")";
			    echo "Preparing to insert. Query is: " . $myQuery7 . "<br />";
			    mysql_query($myQuery7, $db_server) or die("Failed to insert..." . mysql_error());			
			}


	$myQuery8= "DROP TABLE IF EXISTS CityPop54";
    mysql_query($myQuery8, $db_server);
    echo "Creating table 'CityPop54'<br />";

	 $cityPopList54 = array( array("47", "Tacoma", "01", "WA602", "209"),
	 	  					array( "47", "Tacoma", "01", "WA603", "446"),
	 	  					array( "47", "Tacoma", "01", "WA604", "640"),
	 	  					array( "47", "Tacoma", "01", "WA605", "690"),
	 	  					array( "47", "Tacoma", "01", "WA606", "856"),
	 	  					array( "47", "Tacoma", "01", "WA607", "755"),
	 	  					array( "47", "Tacoma", "01", "WA608", "789"),
	 	  					array( "47", "Tacoma", "01", "WA609.03", "433"),
	 	  					array( "47", "Tacoma", "01", "WA609.04", "737"),
	 	  					array( "47", "Tacoma", "01", "WA609.05", "936"),
	 	  					array( "47", "Tacoma", "01", "WA609.06", "309"),
	 	  					array( "47", "Tacoma", "01", "WA610.01", "631"),
	 	  					array( "47", "Tacoma", "01", "WA610.02", "599"),
	 	  					array( "47", "Tacoma", "01", "WA611", "822"),
	 	  					array( "47", "Tacoma", "01", "WA612", "685"),
	 	  					array( "47", "Tacoma", "01", "WA613", "630"),
	 	  					array( "47", "Tacoma", "01", "WA614", "736"),
	 	  					array( "47", "Tacoma", "01", "WA615", "636"),
	 	  					array( "47", "Tacoma", "01", "WA616.01", "246"),
	 	  					array( "47", "Tacoma", "01", "WA616.02", "200"),
	 	  					array( "47", "Tacoma", "01", "WA617", "635"),
	 	  					array( "47", "Tacoma", "01", "WA618", "425"),
	 	  					array( "47", "Tacoma", "01", "WA619", "283"),
	 	  					array( "47", "Tacoma", "01", "WA620", "662"),
	 	  					array( "47", "Tacoma", "01", "WA623", "688"),
	 	  					array( "47", "Tacoma", "01", "WA624", "815"),
	 	  					array( "47", "Tacoma", "01", "WA625", "1043"),
	 	  					array( "47", "Tacoma", "01", "WA626", "395"),
	 	  					array( "47", "Tacoma", "01", "WA628.01", "699"),
	 	  					array( "47", "Tacoma", "01", "WA628.02", "602"),
	 	  					array( "47", "Tacoma", "01", "WA629", "927"),
	 	  					array( "47", "Tacoma", "01", "WA630", "407"),
	 	  					array( "47", "Tacoma", "01", "WA631", "629"),
	 	  					array( "47", "Tacoma", "01", "WA632", "796"),
	 	  					array( "47", "Tacoma", "01", "WA633", "915"),
	 	  					array( "47", "Tacoma", "01", "WA634", "1075"),
	 	  					array( "47", "Tacoma", "01", "WA635.01", "608"),
	 	  					array( "47", "Tacoma", "01", "WA635.02", "689"),
	 	  					array( "47", "Tacoma", "01", "WA716", "4"),
	 	  					array( "47", "Tacoma", "01", "WA717.03", "171"),
	 	  					array( "47", "Tacoma", "01", "WA717.04", "0"),
	 	  					array( "47", "Tacoma", "01", "WA717.05", "10"),
	 	  					array( "47", "Tacoma", "01", "WA718", "1"),
	 	  					array( "47", "Tacoma", "01", "WA723.05", "0"),
	 	  					array( "47", "Tacoma", "01", "WA723.09", "103"),
	 	  					array( "47", "Tacoma", "01", "WA723.10", "13"),
	 	  					array( "47", "Tacoma", "01", "WA723.11", "1"),
	 	  					array( "47", "Tacoma", "01", "WA723.12", "108"),
	 	  					array( "47", "Tacoma", "01", "WA9400.01", "148"),
	 	  					array( "47", "Tacoma", "01", "WA9400.02", "28"),
	 	  					array( "47", "Tacoma", "01", "WA9400.04", "0"),
	 	  					array( "47", "Tacoma", "01", "WA9400.05", "956"),
	 	  					array( "47", "Tacoma", "01", "WA9400.06", "175"),
	 	  					array( "47", "Tacoma", "01", "WA9400.07", "426"),
	 	  					array( "47", "Tacoma", "01", "WA9400.08", "965"),
	 	  					array( "47", "Tacoma", "01", "WA9400.11", "795")

	 	);

		$myQuery8= "CREATE TABLE CityPop54 (stateID   VARCHAR(10),
			                    cityName VARCHAR(20),
			                    cityPopID VARCHAR(20),
			                    censusTract	VARCHAR(20),
			                    cityPop VARCHAR(30),
								PRIMARY KEY (censusTract)
								)";


	mysql_query($myQuery8, $db_server) or die("Failed to create table " . mysql_error());
	echo "Table created...<br />";

			for($i = 0; $i < count($cityPopList54); $i++)
             {
				$myQuery8 = "INSERT INTO CityPop54 VALUES ('". $cityPopList54[$i][0]."'";
			    //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
				for ($j = 1; $j < count($cityPopList54[$i]); $j++)
				{
			         //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
					 $myQuery8 .= ", '".$cityPopList54[$i][$j]. "'";
				}
		  	    $myQuery8 .= ")";
			    echo "Preparing to insert. Query is: " . $myQuery8 . "<br />";
			    mysql_query($myQuery8, $db_server) or die("Failed to insert..." . mysql_error());			
			}


$myQuery9= "DROP TABLE IF EXISTS CityPop64";
    mysql_query($myQuery9, $db_server);
    echo "Creating table 'CityPop64'<br />";

	 $cityPopList64 = array( array("47", "Tacoma", "01", "WA602", "134"),
	 	  					array( "47", "Tacoma", "01", "WA603", "490"),
	 	  					array( "47", "Tacoma", "01", "WA604", "611"),
	 	  					array( "47", "Tacoma", "01", "WA605", "727"),
	 	  					array( "47", "Tacoma", "01", "WA606", "729"),
	 	  					array( "47", "Tacoma", "01", "WA607", "655"),
	 	  					array( "47", "Tacoma", "01", "WA608", "650"),
	 	  					array( "47", "Tacoma", "01", "WA609.03", "497"),
	 	  					array( "47", "Tacoma", "01", "WA609.04", "573"),
	 	  					array( "47", "Tacoma", "01", "WA609.05", "887"),
	 	  					array( "47", "Tacoma", "01", "WA609.06", "302"),
	 	  					array( "47", "Tacoma", "01", "WA610.01", "578"),
	 	  					array( "47", "Tacoma", "01", "WA610.02", "486"),
	 	  					array( "47", "Tacoma", "01", "WA611", "693"),
	 	  					array( "47", "Tacoma", "01", "WA612", "486"),
	 	  					array( "47", "Tacoma", "01", "WA613", "431"),
	 	  					array( "47", "Tacoma", "01", "WA614", "384"),
	 	  					array( "47", "Tacoma", "01", "WA615", "574"),
	 	  					array( "47", "Tacoma", "01", "WA616.01", "198"),
	 	  					array( "47", "Tacoma", "01", "WA616.02", "85"),
	 	  					array( "47", "Tacoma", "01", "WA617", "402"),
	 	  					array( "47", "Tacoma", "01", "WA618", "253"),
	 	  					array( "47", "Tacoma", "01", "WA619", "265"),
	 	  					array( "47", "Tacoma", "01", "WA620", "476"),
	 	  					array( "47", "Tacoma", "01", "WA623", "506"),
	 	  					array( "47", "Tacoma", "01", "WA624", "589"),
	 	  					array( "47", "Tacoma", "01", "WA625", "784"),
	 	  					array( "47", "Tacoma", "01", "WA626", "308"),
	 	  					array( "47", "Tacoma", "01", "WA628.01", "456"),
	 	  					array( "47", "Tacoma", "01", "WA628.02", "401"),
	 	  					array( "47", "Tacoma", "01", "WA629", "639"),
	 	  					array( "47", "Tacoma", "01", "WA630", "284"),
	 	  					array( "47", "Tacoma", "01", "WA631", "495"),
	 	  					array( "47", "Tacoma", "01", "WA632", "512"),
	 	  					array( "47", "Tacoma", "01", "WA633", "711"),
	 	  					array( "47", "Tacoma", "01", "WA634", "833"),
	 	  					array( "47", "Tacoma", "01", "WA635.01", "505"),
	 	  					array( "47", "Tacoma", "01", "WA635.02", "585"),
	 	  					array( "47", "Tacoma", "01", "WA716", "2"),
	 	  					array( "47", "Tacoma", "01", "WA717.03", "140"),
	 	  					array( "47", "Tacoma", "01", "WA717.04", "0"),
	 	  					array( "47", "Tacoma", "01", "WA717.05", "10"),
	 	  					array( "47", "Tacoma", "01", "WA718", "1"),
	 	  					array( "47", "Tacoma", "01", "WA723.05", "0"),
	 	  					array( "47", "Tacoma", "01", "WA723.09", "73"),
	 	  					array( "47", "Tacoma", "01", "WA723.10", "17"),
	 	  					array( "47", "Tacoma", "01", "WA723.11", "6"),
	 	  					array( "47", "Tacoma", "01", "WA723.12", "64"),
	 	  					array( "47", "Tacoma", "01", "WA9400.01", "73"),
	 	  					array( "47", "Tacoma", "01", "WA9400.02", "22"),
	 	  					array( "47", "Tacoma", "01", "WA9400.04", "0"),
	 	  					array( "47", "Tacoma", "01", "WA9400.05", "573"),
	 	  					array( "47", "Tacoma", "01", "WA9400.06", "124"),
	 	  					array( "47", "Tacoma", "01", "WA9400.07", "280"),
	 	  					array( "47", "Tacoma", "01", "WA9400.08", "670"),
	 	  					array( "47", "Tacoma", "01", "WA9400.11", "786")

	 	);

		$myQuery9= "CREATE TABLE CityPop64 (stateID   VARCHAR(10),
			                    cityName VARCHAR(20),
			                    cityPopID VARCHAR(20),
			                    censusTract	VARCHAR(20),
			                    cityPop VARCHAR(30),
								PRIMARY KEY (censusTract)
								)";


	mysql_query($myQuery9, $db_server) or die("Failed to create table " . mysql_error());
	echo "Table created...<br />";

			for($i = 0; $i < count($cityPopList64); $i++)
             {
				$myQuery9= "INSERT INTO CityPop64 VALUES ('". $cityPopList64[$i][0]."'";
			    //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
				for ($j = 1; $j < count($cityPopList64[$i]); $j++)
				{
			         //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
					 $myQuery9 .= ", '".$cityPopList64[$i][$j]. "'";
				}
		  	    $myQuery9 .= ")";
			    echo "Preparing to insert. Query is: " . $myQuery9 . "<br />";
			    mysql_query($myQuery9, $db_server) or die("Failed to insert..." . mysql_error());			
			}

	$myQuery10= "DROP TABLE IF EXISTS CityPop65";
    mysql_query($myQuery10, $db_server);
    echo "Creating table 'CityPop65'<br />";

	 $cityPopList65 = array( array("47", "Tacoma", "01", "WA602", "57"),
	 	  					array( "47", "Tacoma", "01", "WA603", "861"),
	 	  					array( "47", "Tacoma", "01", "WA604", "474"),
	 	  					array( "47", "Tacoma", "01", "WA605", "481"),
	 	  					array( "47", "Tacoma", "01", "WA606", "550"),
	 	  					array( "47", "Tacoma", "01", "WA607", "396"),
	 	  					array( "47", "Tacoma", "01", "WA608", "616"),
	 	  					array( "47", "Tacoma", "01", "WA609.03", "728"),
	 	  					array( "47", "Tacoma", "01", "WA609.04", "597"),
	 	  					array( "47", "Tacoma", "01", "WA609.05", "1556"),
	 	  					array( "47", "Tacoma", "01", "WA609.06", "442"),
	 	  					array( "47", "Tacoma", "01", "WA610.01", "863"),
	 	  					array( "47", "Tacoma", "01", "WA610.02", "717"),
	 	  					array( "47", "Tacoma", "01", "WA611", "1060"),
	 	  					array( "47", "Tacoma", "01", "WA612", "542"),
	 	  					array( "47", "Tacoma", "01", "WA613", "358"),
	 	  					array( "47", "Tacoma", "01", "WA614", "214"),
	 	  					array( "47", "Tacoma", "01", "WA615", "588"),
	 	  					array( "47", "Tacoma", "01", "WA616.01", "380"),
	 	  					array( "47", "Tacoma", "01", "WA616.02", "34"),
	 	  					array( "47", "Tacoma", "01", "WA617", "359"),
	 	  					array( "47", "Tacoma", "01", "WA618", "219"),
	 	  					array( "47", "Tacoma", "01", "WA619", "246"),
	 	  					array( "47", "Tacoma", "01", "WA620", "400"),
	 	  					array( "47", "Tacoma", "01", "WA623", "384"),
	 	  					array( "47", "Tacoma", "01", "WA624", "583"),
	 	  					array( "47", "Tacoma", "01", "WA625", "588"),
	 	  					array( "47", "Tacoma", "01", "WA626", "203"),
	 	  					array( "47", "Tacoma", "01", "WA628.01", "437"),
	 	  					array( "47", "Tacoma", "01", "WA628.02", "392"),
	 	  					array( "47", "Tacoma", "01", "WA629", "501"),
	 	  					array( "47", "Tacoma", "01", "WA630", "261"),
	 	  					array( "47", "Tacoma", "01", "WA631", "593"),
	 	  					array( "47", "Tacoma", "01", "WA632", "572"),
	 	  					array( "47", "Tacoma", "01", "WA633", "844"),
	 	  					array( "47", "Tacoma", "01", "WA634", "853"),
	 	  					array( "47", "Tacoma", "01", "WA635.01", "525"),
	 	  					array( "47", "Tacoma", "01", "WA635.02", "440"),
	 	  					array( "47", "Tacoma", "01", "WA716", "1"),
	 	  					array( "47", "Tacoma", "01", "WA717.03", "272"),
	 	  					array( "47", "Tacoma", "01", "WA717.04", "0"),
	 	  					array( "47", "Tacoma", "01", "WA717.05", "7"),
	 	  					array( "47", "Tacoma", "01", "WA718", "2"),
	 	  					array( "47", "Tacoma", "01", "WA723.05", "0"),
	 	  					array( "47", "Tacoma", "01", "WA723.09", "66"),
	 	  					array( "47", "Tacoma", "01", "WA723.10", "40"),
	 	  					array( "47", "Tacoma", "01", "WA723.11", "8"),
	 	  					array( "47", "Tacoma", "01", "WA723.12", "134"),
	 	  					array( "47", "Tacoma", "01", "WA9400.01", "44"),
	 	  					array( "47", "Tacoma", "01", "WA9400.02", "6"),
	 	  					array( "47", "Tacoma", "01", "WA9400.04", "4"),
	 	  					array( "47", "Tacoma", "01", "WA9400.05", "337"),
	 	  					array( "47", "Tacoma", "01", "WA9400.06", "167"),
	 	  					array( "47", "Tacoma", "01", "WA9400.07", "225"),
	 	  					array( "47", "Tacoma", "01", "WA9400.08", "549"),
	 	  					array( "47", "Tacoma", "01", "WA9400.11", "593")

	 	);

		$myQuery10= "CREATE TABLE CityPop65 (stateID   VARCHAR(10),
			                    cityName VARCHAR(20),
			                    cityPopID VARCHAR(20),
			                    censusTract	VARCHAR(20),
			                    cityPop VARCHAR(30),
								PRIMARY KEY (censusTract)
								)";


	mysql_query($myQuery10, $db_server) or die("Failed to create table " . mysql_error());
	echo "Table created...<br />";

			for($i = 0; $i < count($cityPopList65); $i++)
             {
				$myQuery10= "INSERT INTO CityPop65 VALUES ('". $cityPopList65[$i][0]."'";
			    //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
				for ($j = 1; $j < count($cityPopList65[$i]); $j++)
				{
			         //echo "Preparing to insert. Query is: " . $myQuery . "<br />";
					 $myQuery10 .= ", '".$cityPopList65[$i][$j]. "'";
				}
		  	    $myQuery10 .= ")";
			    echo "Preparing to insert. Query is: " . $myQuery10 . "<br />";
			    mysql_query($myQuery10, $db_server) or die("Failed to insert..." . mysql_error());			
			}
			mysql_close($db_server);     // close the connection

?>



