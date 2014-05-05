TransitBuilder
=========
This pedagogical web app allows users to plan a mass transit network in an American city of their choice. Ridership is modeled with an agent-based simulation using demographic and employment data down to the census tract level. The transit networks are represented in GTFS format so that agents can be routed through the system using a multimodal directions API (e.g. OpenTripPlanner).

Setup
---------
1. Download and setup [Nodejs](http://nodejs.org/).

2. Clone this repository.

3. Run ```npm install``` on the project's root directory, which will install all dependencies specified in our ```package.json```.

4. Download and unzip all the necessary [geo files](https://drive.google.com/folderview?id=0B8nYc_DO47HqbVlJbGtRekk5ZjQ&usp=sharing) into the project's root. Ensure the following structure:  
  ```
  capstone
    |-geo
      |-state-tracts
      |-osm
      |-place-boundaries
  ```

5. TransitBuilder uses [OpenTripPlanner](https://github.com/opentripplanner/OpenTripPlanner) for multimodal routing. Download and build OpenTripPlanner following their [instructions](https://github.com/opentripplanner/OpenTripPlanner/wiki/TwoMinutes).

6. TransitBuilder must directly reference the OpenTripPlanner executable JAR at ```OpenTripPlanner\otp-core\target\otp.jar```. Depending on the location of both projects on your machine, you may need to change ```OtpJarPath``` in ```scripts/utils/globalvars.js```.

7. Run ```node scripts/server_main.js``` from the project root to start TransitBuilder. Ensure that an instance of OpenTripPlanner is already running, or optionally append ```--services``` to the previous command to start one. 

**NOTE:** TransitBuilder executes several UNIX commands, so if you're running Windows you'll need to [add support for them](http://www.cygwin.com/).

Contributors
---------
Nathan Pastor <br/>
Bobby Kearns <br/>
Michael Lim <br/>
Ian Saad <br/>
