/**
 * Created by Nathan P on 3/13/14.
 */

define(['scripts/utils/censusAPI',
    'scripts/utils/globalvars',
    'fs',
    'path',
    'geojson-utils',
    'clipper',
    'scripts/database/connect'
], function(censusAPI, globalvars, fs, path, geojsonUtils, clipper, connect) {

    /**
     * Gets the specified place's boundary, and every census tract within the
     * boundary. Each census tract contains population and employment levels and
     * densities
     * @param stateID state FIPS code
     * @param placeID place FIPS codes
     * @param callback Payload is an object containing the city boundary and
     * every census tract within the city
     * @param context Optional context for callback
     */
    function getCityTractsGeo(stateID, placeID, callback, context)
    {
        // We need geographies for all census tracts in a city. We use one level
        // of caching:
        //   1. Check if city tracts are cached locally in the database
        //      - if so, return them
        //   2. Get the state tracts from the file system.
        //      - if so, extract and return all that lie within the city boundary
        var cityBoundary = getCityBoundary(stateID, placeID);

        checkDbCity(stateID, placeID, function(result){
            if(result === false) {
                result = checkDbState(stateID);
                if(result === false) {
                    throw "NO state geo " + stateID;
                } else {
                    // State db check was a hit, pull out city tract geos from the
                    // state geoJson. Result contains
                    result = extractCityGeos(stateID,
                                            placeID,
                                            JSON.parse(result),
                                            cityBoundary);
                    binDensities(result);
                    writeCityToDb(stateID, placeID, result);
                }
            }
            // else {
            //     console.log(result);
            //     console.log(result.features[0].properties);
            //     result = JSON.parse(result);
            // }

            callback.call(context||this, {
                cityTracts: result,
                cityBoundary: cityBoundary
            });
         });
    }

    function writeCityToDb(stateID, placeID, cityGeoJson) {
        // TODO write to db
        var geoID = stateID + placeID;
        try {
            connect.makeWrite(geoID, cityGeoJson);
        } catch (err) {
            console.error("Unable to write city geoID + " + geoID + " to db: "
                            + err);
        }
    }

   function checkDbCity(stateID, placeID, callback) {
        var that = this;
        var geoID = stateID + placeID;
        connect.makeQuery(geoID, function(result) {
            if(result === false){
                console.log("Census tract miss for "+ geoID);
                callback.call(that, false);
            } else{
                console.log("Census tract hit for "+ geoID);
                callback.call(that, result);
            }
        }, this);
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
            console.error("Unable to read state " + stateID + " geoJson: " + err);
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
                        console.log("Found the matching place boundary for "
                            + stateID + placeID);
                        return places[j];
                    }
                }
            }
        }
        return false;
    }

    var minPctOfCity = 0.001;
    var minPctOfTract = 0.60;
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

        var cityArea = getPolygonArea(cityBoundary.geometry, false);

        var length = stateTracts.length;
        for(var i = 0; i < length; i++) {
            var stateTract = stateTracts[i];

            if(i % 50 === 0) {
                var pct = Math.floor((i * 100) / stateTracts.length);
                // process.stdout.clearLine();
                // process.stdout.cursorTo(0);
                console.log("Finding city tracts: " + pct + "%");
            }

            // Skip tracts that only encompass water
            if(stateTract.properties.ALAND === 0.0)
                continue;

            // If the tract intersects the city boundary, it MAY be desirable.
            if(checkPolygonIntersection(stateTract.geometry,
                                            cityBoundary.geometry)) {
                // Sometimes we get false positives, where tracts that border a
                // city have a point that is just barely within the boundary. We
                // want to ignore those. So if we get a hit with polygon
                // intersection, we only accept the tract if the intersection
                // area of the two polygons is above a threshold
                var interArea = getPolygonIntersectionArea(stateTract.geometry,
                                                        cityBoundary.geometry);
                var pctOfCity = (interArea / cityArea).toFixed(4);
                console.log("Area of intersection: " + interArea
                                    + ", city area: " + cityArea
                                    + ", pct: " + pctOfCity + "%");
                var tractArea = getPolygonArea(stateTract.geometry, false);
                var pctOfTract = (interArea / tractArea).toFixed(4);
                if(pctOfCity < minPctOfCity && pctOfTract < minPctOfTract ) {
                    console.log("Skipping tract. Pct of city: " + pctOfCity
                        + "%, pct of tract " + pctOfTract + "%");
                } else {
                    cityGeos.push(stateTract);
                }
            }
        }

        console.log("\r\nExtracted " + cityGeos.length + " city tracts from "
                    + stateTracts.length + " state " + stateID
                    + " tracts for place " + placeID);
        return tractList2GeoJson(cityGeos);
    }

    function getPolygonArea(polygon, isPath) {
        var polyPaths;
        if(isPath) {
            polyPaths = [polygon];
        } else {
            polyPaths = geoJsonFeature2Paths(polygon);
        }

        var area = 0;
//        area += Math.abs(clipper.ClipperLib.JS.AreaOfPolygon(polyPaths, 1));
        for(var i = 0; i < polyPaths.length; i++) {
            var curPath = polyPaths[i];
            area += Math.abs(clipper.ClipperLib.JS.AreaOfPolygons(curPath));
        }

        return area;
    }

    function geoJsonFeature2Paths(feature) {
        var multiPath = [];
        if(feature.type === "Polygon") {
            multiPath.push(polygonFeature2Path(feature.coordinates));
        } else {
            // Multipolygon requires another loop
            var length = feature.coordinates.length;
            for(var i = 0; i < length; i++) {
                multiPath.push(polygonFeature2Path(feature.coordinates[i]));
            }
//            console.log("Multipolygon: \r\n %j", multipolygon);
        }
        return multiPath;
    }

    function polygonFeature2Path(coordinates) {
        var ClipperLib = clipper.ClipperLib;

        var featurePaths = [];

        for(var i = 0; i  < coordinates.length; i++) {
            var featureCoords = coordinates[i];
            var coordsLength = featureCoords.length;
            var featurePath = [];

            for(var j = 0; j < coordsLength; j++) {
                var coordinate = featureCoords[j];
                featurePath.push(new ClipperLib.IntPoint(coordinate[0], coordinate[1]));
                if(j+1 === coordsLength) {
                    coordinate = featureCoords[0];
                    featurePath.push(new ClipperLib.IntPoint(coordinate[0], coordinate[1]));
                }
            }

            var scale = 50000000;
            ClipperLib.JS.ScaleUpPath(featurePath, scale);
            featurePaths.push(featurePath);
        }
        return featurePaths;
    }

    // TODO fix for multipolygons!!!!!!!!!!
    // http://sourceforge.net/p/jsclipper/wiki/Home%206/#a2-create-paths
    function getPolygonIntersectionArea(polygonFeature1, polygonFeature2) {
//        if(polygonFeature1.type == "MultiPolygon"
//                || polygonFeature2.type == "MultiPolygon")
//            console.log("Getting area for a " + polygonFeature1.type
//                                    + " and a " + polygonFeature2.type);

        var ClipperLib = clipper.ClipperLib;

        // Convert the features to paths that Clipper can use
        var poly1Path = geoJsonFeature2Paths(polygonFeature1);
        var poly2Path = geoJsonFeature2Paths(polygonFeature2);

//        console.log('TRACT PATH: \r\n %j', poly1Path);
//        console.log('BOUNDARY PATH: \r\n %j', poly2Path);

        // Add the paths
        var cpr = new ClipperLib.Clipper();
        for(var i = 0; i < poly1Path.length; i++)
            cpr.AddPaths(poly1Path[i], ClipperLib.PolyType.ptSubject, true);
        for(var i = 0; i < poly2Path.length; i++)
            cpr.AddPaths(poly2Path[i], ClipperLib.PolyType.ptClip, true);
        var solutionPaths = [];

        // Find the intersection!
        cpr.Execute(ClipperLib.ClipType.ctIntersection,
                    solutionPaths,
                    ClipperLib.PolyFillType.pftEvenOdd,
                    ClipperLib.PolyFillType.pftEvenOdd);

        if(solutionPaths.length === 0)
            return 0;

        // Find the intersection area. NOTE THAT THIS IS THE SCALED-UP AREA
        return getPolygonArea(solutionPaths, true);
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
        getCityTractsGeo: getCityTractsGeo,
        json2clipper: geoJsonFeature2Paths
    }
});