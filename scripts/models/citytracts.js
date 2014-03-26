/**
 * Created by Nathan P on 3/13/14.
 */

define(['scripts/utils/censusAPI',
    'fs',
    'path'
], function(censusAPI, fs, path) {

    // Pass in a GeoJson containing a list of all census tracts in the
    // city. GeoJson must be of the form that's returned via the census boundary
    // API
    function getCityTractsGeo(stateID, countyID, placeID,
                           cityJson, callback, context) {

        // TODO:
        // We need geographies for all census tracts in a city. Three levels of
        // caching, misses hit the next level:
        //   1. Check if city tracts are cached locally
        //      - if so, return them
        //   2. Check if state tracts are cached locally
        //      - if so, union them with the tracts returned from the population query
        //   3. Go to census API to get state tracts

        var result = checkDbCity(stateID, countyID, placeID);
        if(result === false) {
            result = checkDbState(stateID)
            if(result === false) {
                // TODO go to interwebz
            } else {
                // state db check was a hit, pull out city tract geos from the
                // state geoJson
                result = extractCityGeos(JSON.parse(result), cityJson);
                binDensities(result);
                // TODO get rid of this save
                writeCityToDb(stateID, countyID, placeID, result);
            }
        }

        callback.call(context||this, result);
    }

    function writeCityToDb(stateID, countyID, placeID, cityGeoJson) {
        // TODO write to db
        var geoID = stateID + countyID + placeID;
        try {
            fs.writeFile("./tmp/" + geoID + "_emp_pop.json",
                JSON.stringify(cityGeoJson));
        } catch (err) {
            console.error("Unable to write city geoID + " + geoID + " to db: "
                            + err);
        }
    }

    function checkDbCity(stateID, countyID, placeID) {
        // TODO query the db
        return false;
    }

    function checkDbState(stateID) {
        try {
            var files = fs.readdirSync('./tmpr');
            for(var i = 0; i < files.length; i++) {
                if(RegExp("^State" + stateID).test(files[i])) {
                    var filepath = path.join('./tmp', files[i]);
                    console.log("Reading state geoJson at: " + filepath);
                    var file = fs.readFileSync(filepath, 'utf8');
                    return file;
                }
            }
        } catch (err) {
            console.error("Unable to read state " + stateID + " geoJson: "
                            + err);
        }


        return false;
    }

    /**
     * Extracts all the geoJson components from the state geoJson which are
     * also in the cityTractList
     * @param stateGeoJson
     * @param cityTractList
     */
    function extractCityGeos(stateGeoJson, cityTractList) {

        var cityGeos = [];
        var counter = 0;

        var stateGeos = stateGeoJson.features;

        // loop through all city tracts
        for(var i = 0; i < cityTractList.length; i++) {
            var cityTractID = parseInt(cityTractList[i][5]);
            // loop through all state tracts looking for a match
            for(var j = 0; j < stateGeos.length; j++) {
                var stateTractID = parseInt(stateGeos[j].properties.TRACTCE);
                // Ensure that tract ID's and county ID's match
                if(cityTractID === stateTractID &&
                        parseInt(cityTractList[i][2]) ===
                        parseInt(stateGeos[j].properties.COUNTYFP)) {

                    // Now we can be certain of a match. Get the state geoJson
                    // feature and add in the tract's population AND the tract's
                    // population density
                    var stateTract = stateGeos[j];
                    stateTract.properties.population = cityTractList[i][0];
                    // Calculate population density. 'ALAND' is in square meters,
                    // so convert to square miles
                    stateTract.properties.popDensity =
                            stateTract.properties.population /
                            (stateTract.properties.ALAND * 0.000000386102);
                    // And add the object to the final city collection
                    cityGeos[counter++] = stateTract;
                    break;
                }
            }
        }

        console.log("extracted tracts: " + cityGeos.length + ", city tracts: " + cityTractList.length)

        return tractList2GeoJson(cityGeos);
    }

    /**
     * Converts the list of city tracts to a GeoJson
     * @param tractList List of city tracts
     * @returns
     */
    function tractList2GeoJson(tractList) {
        var geoJson = {
            "type": "FeatureCollection",
            "properties": {
                "maxPopDensity": 0,
                "maxEmpDensity": 0
            },
            "features": []
        }
        for(var i = 0; i < tractList.length; i++){
            var curTract = tractList[i];
            var curTractProps = curTract.properties;
            // keep track of max densities, for shading density on the front end
            if(curTractProps.popDensity > geoJson.properties.maxPopDensity)
                geoJson.properties.maxPopDensity = curTractProps.popDensity;
            if(curTractProps.empDensity > geoJson.properties.maxEmpDensity)
                geoJson.properties.maxEmpDensity = curTractProps.empDensity;

            geoJson.features[i] = curTract;
        }
        return geoJson;
    }

    /**
     * Bins the the population and employment densities, for better data
     * visualization
     * @param cityGeoJson GeoJson of all city census tracts
     */
    function binDensities(cityGeoJson) {
        var numBins = 8;
        // We'll do a proportional binning with the specified number of binss.
        // Each tract is separately binned with respect to population and
        // employment density

        cityGeoJson.properties.numBins = numBins;
        var features = cityGeoJson.features;
        var numFeatures = features.length;

        // We'll start by binning population, so sort by population
        features.sort(function(a, b) {
            return a.properties.popDensity - b.properties.popDensity;
        });
        // Now loop through the features list, and assign each feature a bin
        // based on which quintile
        var binSize = numFeatures / numBins;
        for(var i = 0; i < numFeatures; i++) {
            var bin = Math.floor(i / binSize);
            features[i].properties.popBin = bin;
        }

        // Then sort by employment, and assign bins accordingly
        features.sort(function(a, b) {
            return a.properties.empDensity - b.properties.empDensity;
        });
        for(var i = 0; i < numFeatures; i++) {
            var bin = Math.floor(i / binSize);
            features[i].properties.empBin = bin;
        }
    }

    return {
        getCityTractsGeo: getCityTractsGeo
    }
});