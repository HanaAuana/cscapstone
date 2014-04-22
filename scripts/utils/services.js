/**
 * Created by Nathan P on 4/20/2014.
 */

define(['child_process',
    'scripts/utils/globalvars'
], function(childProcess, globalvars) {

    function startServices() {
        startOTP();
    }

    /**
     * Starts the OTP server in a child process
     */
    function startOTP() {
        console.log('Starting OTP service');
        var child = childProcess.exec('java -Xmx2g -jar '
                                    + globalvars.otpJarPath
                                    + ' --server -p 8080',
                                    function (error, stdout, stderr) {
            console.log('OTP ERROR: ' + stderr);
            if (error !== null) {
                console.log('OTP ERROR: ' + error);
            }
        });

        child.stdout.on('data', function (data) {
            console.log('CHILD OTP SERVER: ' + data);
        });

        child.stderr.on('data', function (data) {
            console.log('CHILD OTP SERVER: ' + data);
        });

        child.on('close', function(code) {
            console.log('child closed: ' + code);
        });
    }

    return {
        startServices: startServices
    }
});