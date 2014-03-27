/**
 * Created by Nathan P on 3/13/14.
 */

define(['scripts/utils/censusAPI',
    'fs',
    'path',
    'geojson-utils'
], function(censusAPI, fs, path, geojsonUtils) {

    // Pass in a list of coordinate representing the city boundary, and
    // the state and county FIPS codes
    function getCityTractsGeo(stateID, countyID, placeID, cityBoundary,
                                        callback, context)
    {
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
                result = extractCityGeos(countyID,
                                        JSON.parse(result),
                                        cityBoundary);
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
            var files = fs.readdirSync('./tmp');
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
     * Extracts all the geoJson components from the state geoJson which lie
     * within the city boundary.
     * @param countyID county FIPS code, to quickly discard irrelevant tracts
     * @param stateGeoJson GeoJSON containing all tracts in the state
     * @param cityBoundary List of coordinates representing the city's boundary
     */
    function extractCityGeos(countyID, stateGeoJson, cityBoundary) {

        var cityGeos = [];

        // Determining polygon intersection is expensive. Narrow the search
        // field by getting rid of all tracts that aren't in the county
        var countyTracts = extractCountyTracts(countyID, stateGeoJson.features);

        for(var i = 0; i < countyTracts.length; i++) {
            var countyTract = countyTracts[i];

            // If the tract intersects the city boundary, add it to the list of
            // city tracts
            if(checkPolygonIntersection(countyTract, cityBoundary)) {
                cityGeos.push(countyTract);
            }
        }

        console.log("Extracted " + cityGeos.length + " city tracts from "
                    + countyTracts.length + " county " + countyID + " tracts ");
        return tractList2GeoJson(cityGeos);
    }

    /**
     * Extracts all tracts for the specified county from a list of tracts
     * @param countyID Specified county
     * @param stateGeos List of tracts
     */
    function extractCountyTracts(countyID, stateGeos) {
        var countyTracts = [];

        for(var i = 0; i < stateGeos.length; i++) {
            var curTract = stateGeos[i];
            if(curTract.properties.COUNTYFP === countyID.toString()) {
                countyTracts.push(curTract);
            }
        }

        console.log("Extracted " + countyTracts.length + " tracts for county " + countyID);
        return countyTracts;
    }

    /**
     * Returns true if the polygons intersect, or if tractPolygon is fully
     * contained by cityPolygon
     * @param tractPolygon The tract polygon
     * @param cityPolygon The city polygon
     */
    function checkPolygonIntersection(tractGeoJson, cityPolygon) {

        var tractPolygon = tractGeoJson.geometry.coordinates[0];

        // Loop through every vertex of the tract, checking for point
        // containment.
        for(var i = 0; i < tractPolygon.length; i++) {
            // Build a point GeoJson feature
            var curPoint = {
                type: "Point",
                coordinates: tractPolygon[i]
            }
            if(geojsonUtils.pointInPolygon(curPoint, cityPolygon))
                return true;
        }
        return false;
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