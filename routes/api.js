var express = require('express'),
    router  = express.Router(),
    fs      = require('fs'),
    request = require('request'),
    stream  = require('stream'),
    config  =  require('../config');

router.get('/test', function (req, res) {
    res.status(200).send('hello');
})
    .get('/logo',function(req, res){
        var url = config.image_url;
        var download = function(uri, filename, callback){
            request.head(uri, function(err, res, body){
                console.log("err:",err);
                console.log("body:", body);
                console.log('content-type:', res.headers['content-type']);
                console.log('content-length:', res.headers['content-length']);
                request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
            });
        };

        console.log("started download");
        download(url, 'logo.jpg', function(){
            console.log('download completed ');

            const r = fs.createReadStream('logo.jpg'); // or any other way to get a readable stream
            const ps = new stream.PassThrough();// <---- this makes a trick with stream error handling
            stream.pipeline(
                r,
                ps, // <---- this makes a trick with stream error handling
                (err) => {
                    if (err) {
                        console.log(err) // No such file or any other kind of error
                        return res.sendStatus(400);
                    }
                })
            ps.pipe(res) // <---- this makes a trick with stream error handling
        });
    });
module.exports = router;