/**
 * Created by Nathan P on 2/11/14.
 */

define(['backbone',
    'underscore',
    'scripts/models/GtfsModel',
    'scripts/models/GlobalVarsModel',
    'scripts/utils/CsvHelperModel'
], function(Backbone, Underscore, GtfsModel, GlobalVars, CsvHelper){

    var Sim2GtfsModel = GtfsModel.extend({

        defaults: {
            'simModel': null,
            'transitRoutes': null,
            // some constants
            'commaDelim': ',',
            'lineBreak': '\r\n'
        },

        initialize: function() {
            this.set({'csvHelper': new CsvHelper()});
            console.log("Sim2GtfsModel : initializing");
            this.buildFileHeaders();
            // We can build the agency and calendar files immediately, they
            // don't depend on user routes
            this.buildAgencyEntries();
            this.buildCalendarEntries();

            // Register listeners on the transit routes, so that we update
            // the GTFS model when routes are updated/removed/added
            console.log("Sim2GtfsModel : registering listeners");
            var transitRoutes = this.get("transitRoutes");
            transitRoutes.on("change", this.onRouteChanged, this);
            transitRoutes.on("remove", this.onRouteRemoved, this);
            transitRoutes.on("add", this.onRouteAdded, this);
        },

        buildAgencyEntries: function() {
            var delim = this.get('commaDelim');
            var lineBr = this.get('lineBreak');
            var globalVars = new GlobalVars();

            // TODO: figure out the timezone
            var agencyTxt = globalVars.get('gtfsAgencyName') + delim
                        + globalVars.get('url') + delim
                        + 'timezone' + lineBr;
            // append the entries to the file, which should already have headers
            var agencyFile = this.get('agencyTxt');
            this.set({'agencyTxt': agencyFile + agencyTxt});
        },

        buildCalendarEntries: function() {
            var delim = this.get('commaDelim');
            var lineBr = this.get('lineBreak');

            // For now all routes are available on all days, and service runs
            // forever
            var calendarEntries = '1' + delim // route_id
                            + '1' + delim + '1' + delim + '1' + delim //mon-wed
                            + '1' + delim + '1' + delim + '1' + delim //thu-sat
                            + '1' + delim //sun
                            + '19000101' + delim //start date (1/1/1900)
                            + '99990101' + delim + lineBr; //end date (1/1/9999)
            // append the entries to the file, which should already have headers
            var calendarFile = this.get('calendarTxt');
            this.set({'calendarTxt': calendarFile + calendarEntries});
        },

        buildFileHeaders: function() {
            var delim = this.get('commaDelim');
            var lineBr = this.get('lineBreak');
            // agency.txt
            var agencyHeaders = 'agency_name' + delim
                            + 'agency_url' + delim
                            + 'agency_timezone' + lineBr;
            this.set({'agencyTxt': agencyHeaders});

            // stops.txt
            var stopsHeaders = 'stop_id' + delim
                            + 'stop_name' + delim
                            + 'stop_lat' + delim
                            + 'stop_lon' + lineBr;
            this.set({'stopsTxt': stopsHeaders});

            // routes.txt
            var routesHeaders = 'route_id' + delim
                            + 'route_short_name' + delim
                            + 'route_long_name' + delim
                            + 'route_type' + lineBr;
            this.set({'routesTxt': routesHeaders});

            // trips.txt
            var tripsHeaders = 'route_id' + delim
                            + 'service_id' + delim
                            + 'trip_id' + lineBr;
            this.set({'tripsTxt': tripsHeaders});

            // stop_times.txt
            var stopTimeHeaders = 'trips_id' + delim
                            + 'arrival_time' + delim
                            + 'departure_time' + delim
                            + 'stop_id' + delim
                            + 'stop_sequence' + lineBr;
            this.set({'stopTimesTxt': stopTimeHeaders});

            // calendar.txt
            var calendarHeaders = 'service_id' + delim
                            + 'monday' + delim + 'tuesday' + delim
                            + 'wednesday' + delim + 'thursday' + delim
                            + 'friday' + delim + 'saturday' + delim
                            + 'sunday' + delim + 'start_date' + delim
                            + 'end_date' + delim + lineBr;
            this.set({'calendarTxt': calendarHeaders});
        },

        onRouteChanged: function(transitRoute) {
            this.onRouteRemoved(transitRoute);
            this.onRouteAdded(transitRoute);
        },

        onRouteAdded: function(transitRoute) {
            console.log("Sim2Gtfs : onRouteAdded triggered");
            this.addRouteEntry(transitRoute);
            this.addTripsEntry(transitRoute);
            this.addStopsEntry(transitRoute);
            this.addStopTimesEntry(transitRoute);
        },

        onRouteRemoved: function(transitRoute) {
            var routeId = transitRoute.get('id');
            console.log('Sim2GtfsModel : removing route '+ routeId);
            this.removeRouteEntry(routeId);
            var tripIds = this.removeTripsEntry(routeId);
            var stopIds = this.removeStopTimesEntry(tripIds);
            this.removeStopsEntry(stopIds);
        },

        // Add new route to routes.txt
        addRouteEntry: function(transitRoute) {
            var delim = this.get('commaDelim');
            var lineBr = this.get('lineBreak');
            var routeId = transitRoute.get('id');

            var routeLine = routeId + delim
                + '' + delim
                + transitRoute.get('routeName') + delim
                + transitRoute.get('mode').get('type') + lineBr;
            var routesTxt = this.get('routesTxt');
            this.set({'routesTxt': routesTxt + routeLine});
            console.log('routes.txt\n' + this.get('routesTxt'));
        },

        // Add new route to trips.txt. We need a different entry for each
        // trip, and we need to differentiate inbound and outbound trips.
        // we'll assign all inbound trips even tripIds, and all outbound
        // trips odd tripIds. These inbound and outbound designations are
        // arbitrary.
        addTripsEntry: function(transitRoute) {
            var delim = this.get('commaDelim');
            var lineBr = this.get('lineBreak');
            var routeId = transitRoute.get('id');

            var headway = transitRoute.get('headway');
            var startMins = transitRoute.get('startServiceMins');
            var endMins = transitRoute.get('endServiceMins');
            var serviceId = transitRoute.get('serviceId');

            for(var i = startMins; i < endMins; i += headway) {
                var inboundSeqNum = 2*((i - startMins)/headway);
                var outboundSeqNum = inboundSeqNum + 1;
                var inboundTrip = routeId + delim
                    + serviceId + delim
                    + this.calcTripId(routeId, inboundSeqNum) + lineBr;
                var outboundTrip = routeId + delim
                    + serviceId + delim
                    + this.calcTripId(routeId, outboundSeqNum) + lineBr;
                var tripsTxt = this.get('tripsTxt');
                this.set({'tripsTxt': tripsTxt + inboundTrip + outboundTrip});
            }
        },

        // Add the new route's stops to stops.txt.
        addStopsEntry: function(transitRoute) {
            var delim = this.get('commaDelim');
            var lineBr = this.get('lineBreak');
            var routeId = transitRoute.get('id');

            var stopsGeo = transitRoute.getStopsGeo();
            var stopCounter = 0;
            for(var i = 0; i < stopsGeo.length; i++) {
                var stop = stopsGeo[i];
                var stopEntry = this.calcStopId(routeId, stopCounter) + delim
                    + '' + delim
                    + stop[0] + delim + stop[1] + lineBr;
                var stopsTxt = this.get('stopsTxt');
                this.set({'stopsTxt': stopsTxt + stopEntry});
                stopCounter++;
            }
        },

        // Add all the stop times. This one's a doozy
        addStopTimesEntry: function(transitRoute) {

            var drivingTimes = transitRoute.getStopsDriveTimes();
            var stopCounter = 0;
            for(var i = 0; i < drivingTimes.length; i ++) {

            }
        },

        // Remove a route from routes.txt
        removeRouteEntry: function(routeId) {

            var csvHelper = this.get('csvHelper');
            var routesArray = csvHelper.csvToArray(this.get('routesTxt'));
            for(var i = 0; i < routesArray.length; i++) {
                if(routesArray[i][0] == routeId) {
                    routesArray[i] = null;
                    break;
                }
            }
            // Now rebuild the array minus the removed route
            var newRoutesArray = [];
            var offset = 0;
            for(var i = 0; i < routesArray.length; i++) {
                if(routesArray[i] === null) {
                    offset = 1;
                } else {
                    newRoutesArray[i - offset] = routesArray[i];
                }
            }
            this.set({'routesTxt': csvHelper.arrayToCsv(newRoutesArray)});
        },

        removeTripsEntry: function(routeId) {
            var csvHelper = this.get('csvHelper');
            var allTrips = csvHelper.csvToArray(this.get('tripsTxt'));
            var tripIds = [];
            var numRouteTrips = 0;
            // Loop through trip file, finding trips that correspond to this route
            for(var i = 0; i < allTrips.length; i++) {
                if(allTrips[i][0] == routeId) {
                    // keep track of the trip id, then set the entry to null
                    tripIds[numRouteTrips] = allTrips[i][2];
                    numRouteTrips++;
                    allTrips[i] = null;
                }
            }
            // Rebuild the trips file without the trips we set to null
            var offset = 0;
            var newTrips = [];
            for(var i = 0; i < allTrips.length; i++) {
                if(allTrips[i] === null) {
                    offset++;
                } else {
                    newTrips[i - offset] = allTrips[i];
                }
            }
            // And save the new file
            this.set({'tripsTxt': csvHelper.arrayToCsv(newTrips)});
            // Return the set of trip ids
            return tripIds;
        },


        // Removes all stop time entries corresponding to the specified trip ids,
        // and returns a list of the removed stop ids
        removeStopTimesEntry: function(tripIds) {
            var csvHelper = this.get('csvHelper');
            var stopTimesArray = csvHelper.csvToArray(this.get('stopTimesTxt'));
            var totalStopTimes = stopTimesArray.length;
            var stopIds = []; // all removed stop ids
            var numRemovedIds = 0;

            // Set all stop times with a specified trip id to null
            for(var stopTime in stopTimesArray) {
                // look at each trip id
                for(var tripId in tripIds) {
                    if(tripId === stopTime[0]) {
                        // keep track of removed stop ids
                        stopIds[numRemovedIds] = stopTime[3];
                        numRemovedIds++;
                        stopTime = null;
                        break;
                    }
                }
            }
            // Now rebuild the stop times file without the removed entries
            var newStopTimes = [];
            var offset = 0;
            for(var i = 0; i < totalStopTimes; i++) {
                if(stopTimesArray[i] === null) {
                    offset++;
                } else {
                    newStopTimes[i - offset] = stopTimesArray[i];
                }
            }
            return stopIds;
        },

        // Removes all the specified stop ides
        removeStopsEntry: function(stopIds) {
            var csvHelper = this.get('csvHelper');
            var stopsArray = csvHelper.csvToArray(this.get('stopsTxt'));
            // Set all undesirable stops to null
            for(var i = 0; i < stopsArray.length; i++) {
                // look at each specified stop id
                for(var j = 0; j < stopIds.length; j++) {
                    if(stopsArray[i][0] == stopIds[j]) {
                        stopsArray[i] = null;
                        break;
                    }
                }
            }
            // Rebuild list without stops set to null
            var newStops = [];
            var offset = 0;
            for(var i = 0; i < stopsArray.length; i++) {
                if(stopsArray[i] === null) {
                    offset++
                } else {
                    newStops[i - offset] = stopsArray[i];
                }
            }
            console.log(this.get('stopsTxt'));
            this.set({'stopsTxt': csvHelper.arrayToCsv(newStops)});
        },

        // calculates trip id, which must be dataset unique. That is,
        // no 2 trips (even between different routes) can have the same id.
        calcTripId: function(routeId, seqNum) {
            return (routeId * 200) + seqNum;
        },

        calcStopId: function(routeId, seqNum) {
            return (routeId * 200) + seqNum;
        }

    });

    return Sim2GtfsModel;
});