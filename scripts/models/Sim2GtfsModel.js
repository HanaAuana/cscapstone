/**
 * Created by Nathan P on 2/11/14.
 */

define(['backbone',
    'underscore',
    'models/GtfsModel',
    'utils/globalvars',
    'utils/CsvHelperModel'
], function(Backbone, Underscore, GtfsModel, globalVars, CsvHelper){

    var Sim2GtfsModel = GtfsModel.extend({

        defaults: {
            'transitRoutes': null,
            // some constants
            'commaDelim': ',',
            'lineBreak': '\r\n',
            'timezone': 'America/Central'
        },

        initialize: function() {

            this.set({'csvHelper': new CsvHelper()});
            this.buildFileHeaders();
            // We can build the agency and calendar files immediately, they
            // don't depend on user routes
            this.buildAgencyEntries();
            this.buildCalendarEntries();

            // Register listeners on the transit routes, so that we update
            // the GTFS model when routes are updated/removed/added
            var transitRoutes = this.get("transitRoutes");
            transitRoutes.on("change", this.onRouteChanged, this);
            transitRoutes.on("remove", this.onRouteRemoved, this);
            transitRoutes.on("add", this.onRouteAdded, this);

            var that = this;
            Backbone.pubSub.on('new-transit-stop', function(id) {
                that.onRouteChanged(transitRoutes.get(id));
            });
        },

        buildAgencyEntries: function() {
            var agencyTxt = [globalVars.gtfsAgencyName,
                            'http://' + globalVars.url,
                            this.get('timezone')];
            // append the entries to the file, which should already have headers
            var agencyFile = this.get('agencyTxt');
            agencyFile.push(agencyTxt);
        },

        buildCalendarEntries: function() {
            // For now all routes are available on all days, and service runs
            // forever
            var calendarEntries = ['1', // route_id
                                    '1', '1', '1', //mon-wed
                                    '1', '1', '1', //thu-sat
                                    '1', //sun
                                    '19000101', //start date (1/1/1900)
                                    '20990101']; //end date (1/1/9999)
            // append the entries to the file, which should already have headers
            var calendarFile = this.get('calendarTxt');
            calendarFile.push(calendarEntries);
        },

        buildFileHeaders: function() {

            // agency.txt
            var agencyTxt = [];
            agencyTxt.push(['agency_name',
                            'agency_url',
                            'agency_timezone']);
            this.set({'agencyTxt': agencyTxt});

            // stops.txt
            var stopsTxt = [];
            stopsTxt.push(['stop_id',
                            'stop_name',
                            'stop_lat',
                            'stop_lon']);
            this.set({'stopsTxt': stopsTxt});

            // routes.txt
            var routesTxt = [];
            routesTxt.push(['route_id',
                            'route_short_name',
                            'route_long_name',
                            'route_type']);
            this.set({'routesTxt': routesTxt});

            // trips.txt
            var tripsTxt = [];
            tripsTxt.push(['route_id',
                            'service_id',
                            'trip_id']);
            this.set({'tripsTxt': tripsTxt});

            // stop_times.txt
            var stopTimesTxt = [];
            stopTimesTxt.push(['trip_id',
                                'arrival_time',
                                'departure_time',
                                'stop_id',
                                'stop_sequence']);
            this.set({'stopTimesTxt': stopTimesTxt});

            // calendar.txt
            var calendarTxt = [];
            calendarTxt.push(['service_id', 'monday',
                            'tuesday', 'wednesday',
                            'thursday', 'friday',
                            'saturday', 'sunday',
                            'start_date', 'end_date']);
            this.set({'calendarTxt': calendarTxt});
        },

        onRouteChanged: function(transitRoute) {
            console.log("Route changed: updating gtfs");
            this.onRouteRemoved(transitRoute);
            this.onRouteAdded(transitRoute);
        },

        onRouteAdded: function(transitRoute) {
            console.log("New route: updating gtfs");
            this.addRouteEntry(transitRoute);
            this.addTripsEntry(transitRoute);
            this.addStopsEntry(transitRoute);
            this.addStopTimesEntry(transitRoute);
        },

        onRouteRemoved: function(transitRoute) {
            var routeId = transitRoute.get('id');
            console.log('Route ' + routeId + ' removed: updating gtfs');
            this.removeRouteEntry(routeId);
            var tripIds = this.removeTripsEntry(routeId);
            var stopIds = this.removeStopTimesEntry(tripIds);
            this.removeStopsEntry(stopIds);
        },

        // Add new route to routes.txt
        addRouteEntry: function(transitRoute) {

            var routeLine = [transitRoute.get('id'),
                            transitRoute.get('name'),
                            '',
                            transitRoute.get('mode').get('type')];

            var routesTxt = this.get('routesTxt');
            routesTxt.push(routeLine);
        },

        // Add new route to trips.txt. We need a different entry for each
        // trip, and we need to differentiate inbound and outbound trips.
        // we'll assign all inbound trips even tripIds, and all outbound
        // trips odd tripIds. These inbound and outbound designations are
        // arbitrary.
        addTripsEntry: function(transitRoute) {

            var routeId = transitRoute.get('id');
            var headway = parseInt(transitRoute.get('headway'));
            var startMins = parseInt(transitRoute.get('startServiceMins'));
            var endMins = parseInt(transitRoute.get('endServiceMins'));
            var serviceId = transitRoute.get('serviceId');
            var tripsTxt = this.get('tripsTxt');

            console.log(startMins + " " + endMins + " " + headway);

            var curHeadway = startMins;
            while(curHeadway < endMins) {
                var inboundSeqNum = 2*((curHeadway - startMins)/headway);
                var outboundSeqNum = inboundSeqNum + 1;
                var inboundTrip = [routeId,
                                    serviceId,
                                    this.calcTripId(routeId, inboundSeqNum)];
                var outboundTrip = [routeId,
                                    serviceId,
                                    this.calcTripId(routeId, outboundSeqNum)];

                tripsTxt.push(inboundTrip);
                tripsTxt.push(outboundTrip);
                curHeadway += headway;
            }
        },

        // Add the new route's stops to stops.txt.
        addStopsEntry: function(transitRoute) {

            var routeId = transitRoute.get('id');

            var stopsTxt = this.get('stopsTxt');
            var stopsGeo = transitRoute.getStopsGeo();
            var stopCounter = 0;
            for(var i = 0; i < stopsGeo.length; i++) {
                var coord = stopsGeo[i];
                var stopId = this.calcStopId(routeId, stopCounter);
                var stopEntry = [stopId,
                                'Stop' + stopId, // nothing to add for route long name
                                coord[1],
                                coord[0]];
                stopsTxt.push(stopEntry);
                stopCounter++;
            }
//            console.log(this.get('stopsTxt'));
        },

        // Add all the stop times. This one's a doozy
        addStopTimesEntry: function(transitRoute) {

            // Get a bunch of shit
            var routeId = transitRoute.get('id');
            var headway = parseInt(transitRoute.get('headway'));
            var startMins = parseInt(transitRoute.get('startServiceMins'));
            var endMins = parseInt(transitRoute.get('endServiceMins'));
            var dwellTime = transitRoute.get('mode').get('dwellTime');
            var inboundDriveTimes = transitRoute.getDriveTimes('inbound');
            var outboundDriveTimes = transitRoute.getDriveTimes('outbound');

            // First we loop through all the trips (inbound and outbound) for
            // this particular route
            var stopTimes = this.get('stopTimesTxt');
            for(var i = startMins; i < endMins; i += headway) {
                var inboundSeqNum = 2*((i - startMins)/headway);
                var outboundSeqNum = inboundSeqNum + 1;
                var inboundTripId = this.calcTripId(routeId, inboundSeqNum);
                var outboundTripId = this.calcTripId(routeId, outboundSeqNum);

                // Now we loop through all the stops, which are visited by the
                // route on each trip
                var numStops = transitRoute.getStopsGeo().length;
                var inboundTime = i;
                var outboundTime = i;
                for(var j = 0; j < numStops; j++) {
                    // The first stops don't have driving time, they're served
                    // on the headway. But otherwise, increment time counters by
                    // drive time
                    if(j !== 0) {
                        inboundTime += inboundDriveTimes[j-1];
                        outboundTime += outboundDriveTimes[j-1];
                    }
                    // The inbound trip
                    var inboundTrip = [inboundTripId,
                                        this.minsToHhMmSs(inboundTime),
                                        // increment time counter with dwell time
                                        this.minsToHhMmSs(inboundTime += dwellTime),
                                        this.calcStopId(routeId, j),
                                        j];
                    // The outbound trip
                    var outboundTrip = [outboundTripId,
                                        this.minsToHhMmSs(outboundTime),
                                        // increment time counter with dwell time
                                        this.minsToHhMmSs(outboundTime += dwellTime),
                                        this.calcStopId(routeId, numStops - j - 1),
                                        j];
                    stopTimes.push(inboundTrip);
                    stopTimes.push(outboundTrip);
                }
            }
//            console.log(this.get('stopTimesTxt'));
        },

        // Remove a route from routes.txt
        removeRouteEntry: function(routeId) {
            var routesTxt = this.get('routesTxt');
            for(var i = 1; i < routesTxt.length; i++) {
                if(routesTxt[i][0] == routeId) {
                    routesTxt.splice(i--, 1);
                    break;
                }
            }
            console.log(routesTxt);
        },

        removeTripsEntry: function(routeId) {

            var tripsTxt = this.get('tripsTxt');
            var tripIds = []; // all removed trip ids

            // Loop through trip file, finding trips that correspond to this route
            for(var i = 1; i < tripsTxt.length; i++) {
                if(tripsTxt[i][0] == routeId) {
                    // keep track of the trip id, then remove
                    tripIds.push(tripsTxt[i][2]);
                    tripsTxt.splice(i--, 1);
                    i--;
                }
            }

            console.log(tripsTxt);
            // Return the set of removed trip ids
            return tripIds;
        },


        // Removes all stop time entries corresponding to the specified trip ids,
        // and returns a list of the removed stop ids
        removeStopTimesEntry: function(tripIds) {

            var stopTimesTxt = this.get('stopTimesTxt');
            var stopIds = []; // all removed stop ids

            // Remove all stop times with a specified trip id
            for(var i = 1; i < stopTimesTxt.length; i++) {
                // look at each trip id
                for(var j = 0; j < tripIds.length; j++) {
                    if(tripIds[j] == stopTimesTxt[i][0]) {
                        // keep track of removed stop ids
                        stopIds.push(stopTimesTxt[i][3]);
                        stopTimesTxt.splice(i--, 1);
                        break;
                    }
                }
            }
            console.log(stopTimesTxt);
            return stopIds;
        },

        // Removes all the specified stop ids
        removeStopsEntry: function(stopIds) {
            var stopsTxt = this.get('stopsTxt');
            // Remove all undesirable stops
            for(var i = 1; i < stopsTxt.length; i++) {
                // look at each specified stop id
                for(var j = 0; j < stopIds.length; j++) {
                    if(stopsTxt[i][0] == stopIds[j]) {
                        stopsTxt.splice(i--, 1);
                        break;
                    }
                }
            }
            console.log(this.get('stopsTxt'));
        },

        // calculates trip id, which must be dataset unique. That is,
        // no 2 trips (even between different routes) can have the same id.
        calcTripId: function(routeId, seqNum) {
            return (routeId * 1000) + seqNum;
        },

        calcStopId: function(routeId, seqNum) {
            return (routeId * 1000) + seqNum;
        },

        // Converts minutes to the format MM:HH:SS
        minsToHhMmSs: function(mins) {
            var floor = Math.floor(mins);
            var seconds = Math.floor((mins - floor) * 60);
            var minutes = floor % 60;
            var hours = Math.floor(floor / 60);

            // Ensure minutes and seconds have two digits
            if(seconds < 10)
                seconds = '0' + seconds;
            if(minutes < 10)
                minutes = '0' + minutes;

            return hours + ":" + minutes + ":" + seconds;
        },

        getGtfsCsv: function() {
            var csvHelper = this.get('csvHelper');
            return {
                'agency.txt': csvHelper.arrayToCsv(this.get('agencyTxt')),
                'stops.txt': csvHelper.arrayToCsv(this.get('stopsTxt')),
                'routes.txt': csvHelper.arrayToCsv(this.get('routesTxt')),
                'trips.txt': csvHelper.arrayToCsv(this.get('tripsTxt')),
                'stop_times.txt': csvHelper.arrayToCsv(this.get('stopTimesTxt')),
                'calendar.txt': csvHelper.arrayToCsv(this.get('calendarTxt'))
            }
        }

    });

    return Sim2GtfsModel;
});