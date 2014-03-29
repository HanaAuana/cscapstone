/**
 * Created by Nathan P on 3/13/14.
 */

define(['scripts/utils/censusAPI',
    'scripts/utils/globalvars',
    'fs',
    'path',
    'geojson-utils'
], function(censusAPI, globalvars, fs, path, geojsonUtils) {

    // Pass in a list of coordinate representing the city boundary, and
    // the state and place FIPS codes
    function getCityTractsGeo(stateID, placeID, callback, context)
    {
        // TODO:
        // We need geographies for all census tracts in a city. Three levels of
        // caching, misses hit the next level:
        //   1. Check if city tracts are cached locally
        //      - if so, return them
        //   2. Check if state tracts are cached locally
        //      - if so, union them with the tracts returned from the population query
        //   3. Go to census API to get state tracts
        var cityBoundary = getCityBoundary(stateID, placeID);

        var result = checkDbCity(stateID, placeID);
        if(result === false) {
            result = checkDbState(stateID)
            if(result === false) {
                // TODO go to interwebz
            } else {
                // State db check was a hit, pull out city tract geos from the
                // state geoJson. Result contains
                result = extractCityGeos(stateID,
                                        placeID,
                                        JSON.parse(result),
                                        cityBoundary);
                binDensities(result);
                // TODO get rid of this save
                writeCityToDb(stateID, placeID, result);
            }
        }

        callback.call(context||this, {
            cityTracts: result,
            cityBoundary: cityBoundary
        });
    }

    function writeCityToDb(stateID, placeID, cityGeoJson) {
        // TODO write to db
        var geoID = stateID + placeID;
        try {
            fs.writeFile("./tmp/" + geoID + "_emp_pop.json",
                JSON.stringify(cityGeoJson));
        } catch (err) {
            console.error("Unable to write city geoID + " + geoID + " to db: "
                            + err);
        }
    }

    function checkDbCity(stateID, placeID) {
        // TODO query the db
        return false;
    }

    function checkDbState(stateID) {
        try {
            var files = fs.readdirSync(globalvars.stateTractsDir);
            for(var i = 0; i < files.length; i++) {
                if(RegExp("^State" + stateID).test(files[i])) {
                    var filepath = path.join(globalvars.stateTractsDir, files[i]);
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

    function getCityBoundary(stateID, placeID) {
        var files = fs.readdirSync(globalvars.placeBoundaryDir);
        for(var i = 0; i < files.length; i++) {
            if(files[i] === "Place" + stateID + ".json") {
                var file = fs.readFileSync(path.join(globalvars.placeBoundaryDir, files[i]));
                var places = JSON.parse(file).features;
                for(var j = 0; j < places.length; j++) {
                    if(places[j].properties.PLACEFP === placeID) {
                        console.log("Found the matching place for "
                            + stateID + placeID);
                        return places[j];
                    }
                }
            }
        }
        return false;
    }

    /**
     * Extracts all the geoJson components from the state geoJson which lie
     * within the specified place
     * @param placeID place FIPS code
     * @param stateGeoJson GeoJSON containing all tracts in the state
     * @param cityBoundary List of coordinates representing the city's boundary
     */
    function extractCityGeos(stateID, placeID, stateGeoJson, cityBoundary) {

        var cityGeos = [];
        var stateTracts = stateGeoJson.features;

        for(var i = 0; i < stateTracts.length; i++) {
            var stateTract = stateTracts[i];

            if(i % 300 === 0)
                console.log('on tract ' + i);

            // If the tract intersects the city boundary, add it to the list of
            // city tracts
            if(checkPolygonIntersection(stateTract.geometry, cityBoundary.geometry)) {
                cityGeos.push(stateTract);
            }
        }

        console.log("Extracted " + cityGeos.length + " city tracts from "
                    + stateTracts.length + " state " + stateID
                    + " tracts for place " + placeID);

        return tractList2GeoJson(cityGeos);
    }

    /**
     * Returns true if the polygons intersect, or if tractPolygon is fully
     * contained by cityPolygon
     * @param tractGeometry The tract polygon
     * @param cityGeometry The city polygon
     */
    function checkPolygonIntersection(tractGeometry, cityGeometry) {

        var result = false;

        var tractPolygon = tractGeometry.coordinates[0];

        // Loop through every vertex of the tract, checking for point
        // containment.
        for(var i = 0; i < tractPolygon.length; i++) {
            // Build a point GeoJson feature
            var curPoint = {
                type: "Point",
                coordinates: tractPolygon[i]
            }

            if(cityGeometry.type === "MultiPolygon")
                result = geojsonUtils.pointInMultiPolygon(curPoint, cityGeometry);
            else
                result = geojsonUtils.pointInPolygon(curPoint, cityGeometry);

            // Immediately return true if this point is within the polygon
            if(result)
                return result;
        }
        return result; // If we've gotten here, no points were in the city
    }

    /**
     * Converts the list of city tracts to a GeoJson
     * @param tractList List of city tracts
     * @returns GeoJson feature collection containing specified tracts
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