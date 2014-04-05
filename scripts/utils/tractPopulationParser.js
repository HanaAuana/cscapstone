/**
 * Created by Nathan P on 3/24/14.
 *
 * Parses population levels by tract out of json's returned by the ACS5 API call
 */

define(['fs',
    'path'
],function(fs, path) {

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
        var tractPops = [];
        var stateID = -1;

        var file = fs.readFileSync(path);
        file = JSON.parse(file);

        for(var i = 1; i < file.length; i++) {
            var tract = file[i];
            var tractPop = {
                tract: tract[3],
                population: tract[0]
            }
            tractPops.push(tractPop);
            if(stateID < 0) {
                stateID = tract[1];
            }
        }

        if(stateID >= 0)
            addToDb(stateID, tractPops);

    }

    function addToDb(stateID, tractPopulations) {
        console.log("Adding population data for state " + stateID);

        var filename = './geo/state-tracts/State' + stateID + '.json';
        fs.readFile(filename, 'utf8', function (err, file) {
            if (err)
                throw err;

            file = JSON.parse(file);

            var features = file.features;
            // Loop through all state geographies
            for(var i = 0; i < features.length; i++) {
                var properties = features[i].properties;

                // Loop through all state population data to find a match
                for(var j = 0; j < tractPopulations.length; j++) {
                    // If they match, add the employment data
                    if(properties.TRACTCE === tractPopulations[j].tract) {
                        properties.population = tractPopulations[j].population;
                        properties.popDensity = properties.population /
                            (properties.ALAND * 0.000000386102);

                        break;
                    }
                }
            }
            fs.writeFile(filename, JSON.stringify(file));
        });


    }

    return {
        parse: parseDirectory
    }
});
