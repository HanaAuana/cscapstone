/**
 * Created by Nathan P on 3/24/14.
 *
 * Parses employment levels by tract out of CTPP 2006-2010 table A202100
 * Puts them in the database
 */

define(['fs',
    'path',
    'byline'
],function(fs, path, byline) {

    // Regex for ensuring that the CTPP label indicates a census tract
    var ctppLabelRegEx = RegExp("C3100US[0-9]{11}$");
    // Regex for extracting the GEOID from the ctpp label
    var geoIDRegEx = RegExp("[0-9]{11}$");

    function parseDirectory(directory) {
        // Get all files in the directory
        fs.readdir(directory, function(err, files) {
            if(err)
                console.log("Error parsing " + err);
            else {
                for(var i = 0; i < files.length; i++) {
                    parseFile(path.join(directory, files[i]));
                }
            }
        });
    }

    function parseFile(path) {
        var tractEmps = []
        var idx = 0;
        var stateID = -1;

        var stream = fs.createReadStream(path);
        stream = byline.createStream(stream);

        stream.on('data', function(line) {
            var result = parseLine(line);
            // If this line represents tract data, parse and add to list
            if(result !== false) {
                tractEmps[idx++] = result;
                // Set the stateId if we haven't already
                if(stateID < 0)
                    stateID = parseInt(result.tract.substring(0,2));
            }

        });
        stream.on('end', function() {
            if(stateID >= 0)
                addToDb(stateID, tractEmps);
        })
    }

    // Parses a line of the CTPP file. Returns an object if line is a tract,
    // otherwise returns false
    // Sample lines:
    //
    //      GEOID         | LINENO |  EST   |    SE
    // -------------------+--------+--------+------------
    // C3100US11001000400 |   1    | 5785   | 362.3654923  <- GOOD (TRACT GEOID)
    // C2200US11          |   1    | 754615 | 3571.667153  <- BAD (STATE GEOID)
    function parseLine(line) {

        var result = false;

        var tokens = line.toString().split(',');
        var ctppLabel = tokens[0];
        var employment = tokens[2];

        // Ensure the geoID matches the census tract format
        if(ctppLabelRegEx.test(ctppLabel)) {
            result = {
                tract: ctppLabel.match(geoIDRegEx).toString(),
                employment: employment
            }
        }

        return result;
    }

    function addToDb(stateID, tractEmployment) {
        console.log("Adding employment data for state " + stateID);

        fs.readFile('./tmp/11.json', 'utf8', function (err, file) {
            if (err)
                throw err;

            file = JSON.parse(file);

            var features = file.features;
            // Loop through all state geographies
            for(var i = 0; i < features.length; i++) {
                var properties = features[i].properties;

                // Loop through all state employment data to find a match
                for(var j = 0; j < tractEmployment.length; j++) {
                    // If they match, add the employment data
                    if(properties.GEOID === tractEmployment[j].tract) {
                        properties.employment = tractEmployment[j].employment;
                        properties.empDensity = properties.employment /
                            (properties.ALAND * 0.000000386102);

                        break;
                    }
                }
            }
            fs.writeFile('tmp/' + stateID + '_emp.json', JSON.stringify(file));
        });


    }

    return {
        parse: parseDirectory
    }
});
