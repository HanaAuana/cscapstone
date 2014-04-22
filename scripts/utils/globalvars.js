/**
 * Created by Nathan P on 2/11/14.
 *
 * Contains "global" variables. Not sure if this is a good design pattern,
 * we'll be duplicating a bunch of data every time this script is executed
 */

define([], function(){

    return {
        'appName': 'TransitBuildr',
        'gtfsAgencyName': 'TransitBuildr',
        'url': '127.0.0.1:1337',
        'otpUrl': 'localhost',
        'gApiKey':'AIzaSyBx2VkEiP4AF9RSvJZ1P9j1La-Y3HL2EOU',
        'censusKey': 'a0965f148ffbe78ef6a53f59a4842fdbec722ea7',
        'mapquestKey': 'Fmjtd%7Cluur2qu7l9%2C2x%3Do5-9a2w5a',
        'stateTractsDir': 'geo/state-tracts',
        'placeBoundaryDir': 'geo/place-boundaries',
        'osmDir': 'geo/osm',
        'otpJarPath': '../OpenTripPlanner/otp-core/target/otp.jar',
        'otpGraphPath': '/var/otp/graphs',
        'sessionsDir': 'sessions'
    };
});
