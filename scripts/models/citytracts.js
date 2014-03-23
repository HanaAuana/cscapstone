/**
 * Created by Nathan P on 3/13/14.
 */

define(['scripts/utils/censusAPI',
    'fs'
], function(censusAPI, fs) {

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
            }
        }

        callback.call(context||this, result);
    }

    function checkDbCity(stateID, countyID, placeID) {
        // TODO
        return false;
    }

    function checkDbState(stateID) {
        var file = fs.readFileSync('tmp/11.json', 'utf8');
        return file;
        // TODO
//        return false;
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
                    stateTract.properties.populationDensity =
                            stateTract.properties.population /
                            (stateTract.properties.ALAND * 0.000000386102);
                    // And add the object to the final city collection
                    cityGeos[counter++] = stateTract;
                    break;
                }
                if(j + 1 == stateGeos.length)
                    console.log('no match for ' + cityTractID);
            }
        }

        console.log('Built city geos list of size ' + cityGeos.length 
            + ', should have been size ' + cityTractList.length);
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
                "maxPopulation": 0,
                "maxPopDensity": 0,
                "maxEmployment": 0
            },
            "features": []
        }
        for(var i = 0; i < tractList.length; i++){
            var curTract = tractList[i];
            // keep track of max population and max population density, for
            // shading density on the front end
            if(curTract.properties.population > geoJson.properties.maxPopulation)
                geoJson.properties.maxPopulation = curTract.properties.population
            if(curTract.properties.populationDensity > geoJson.properties.maxPopDensity)
                geoJson.properties.maxPopDensity = curTract.properties.populationDensity;

            geoJson.features[i] = curTract;
        }
        return geoJson;
    }

    return {
        getCityTractsGeo: getCityTractsGeo
    }
});