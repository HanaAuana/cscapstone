/**
 * Modified version of substack's shp2json
 * His recursive directory walk wasn't working
 */

define(['child_process',
    'fs',
    'path',
    'seq',
    'morestreams'
], function(childProcess, fs, path, seq, morestreams) {

    var spawn = childProcess.spawn;
    var BufferedStream = morestreams.BufferedStream;

    return function (inStream) {
        var id = Math.floor(Math.random() * (1 << 30)).toString(16);
        var tmpDir = path.join('./tmp', id);
        var zipFile = path.join('./tmp', id + '.zip');

        var outStream = new BufferedStream;
        outStream.readable = true;
        outStream.writable = true;

        var zipStream = fs.createWriteStream(zipFile);
        inStream.pipe(zipStream);
        zipStream.on('error', outStream.emit.bind(outStream, 'error'));

        seq()
            .par(function () {
                fs.mkdir(tmpDir, 0700, this)
            })
            .par(function () {
                if (zipStream.closed) this()
                else zipStream.on('close', this.ok)
            })
            .seq_(function (next) {
                var ps = spawn('unzip', [ '-d', tmpDir, zipFile ]);
                ps.on('exit', function (code) {
                    next(code < 3 ? null : 'error in unzip: code ' + code)
                });
            })
            .seq_(function (next) {
                var chosenFiles = [];
                var files = fs.readdirSync(tmpDir);
                for (var i = 0; i < files.length; i++) {
                    if (files[i].match(/\.shp$|\.kml$/i)) {
                        chosenFiles.push(tmpDir + "/" + files[i]);
                    }
                }

                doConversion(chosenFiles);
            })
            .catch(function (err) {
                outStream.emit('error', err);
            });

        function doConversion(files) {
            if (files.length === 0) {
                this('no .shp files found in the archive');
            }
            else if (files.length > 1) {
                this('multiple .shp files found in the archive,'
                    + ' expecting a single file')
            }
            else {
                console.log('Beginning shp2json conversion for ' + files[0]);
                var ps = spawn('ogr2ogr', [
                    '-f', 'GeoJSON',
                    '-skipfailures',
                    '-t_srs',
                    'EPSG:4326',
                    '-a_srs',
                    'EPSG:4326',
                    '/vsistdout/',
                    files[0]
                ]);
                ps.stdout.pipe(outStream, { end: false });
                ps.stderr.pipe(outStream, { end: false });

                var pending = 2;

                function onend() {
                    if (--pending === 0) {
                        var toDelete = 2;
                        // delete the unzipped temp files
                        var files = fs.readdirSync(tmpDir);
                        for(var i = 0; i < files.length; i++) {
                            fs.unlinkSync(tmpDir +  '/' + files[i]);
                        }

                        // delete the unzipped directory
                        fs.rmdir(tmpDir, function(err) {
                            if(err)
                                console.log(err);

                            if(--toDelete == 0)
                                outStream.end();
                        });

                        // delete temp zip file
                        fs.unlink(zipFile, function(err) {
                            if(err)
                                console.log(err);

                            if(--toDelete == 0)
                                outStream.end();
                        });
                    }
                }

                ps.stdout.on('end', onend);
                ps.stderr.on('end', onend);
            }
        }

        return outStream;
    };
});