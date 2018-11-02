/**
 * articles
 */

'use strict';

let express = require('express')
    , router = express.Router()
    , status = require('http-status')
    , uuidV4 = require('uuid/v4')
    , AWS = require('aws-sdk')
    , os = require('os')
    , fs = require('fs')
    , path = require('path')
    , fileType = require('file-type')
    , Busboy = require('busboy')
    , ffmpeg = require('fluent-ffmpeg')
    , streamifier = require('streamifier')
    , log = global.logger.log
    , imageSize = require('image-size');

AWS.config.update({
    accessKeyId: global.config.aws.accessKeyId,
    secretAccessKey: global.config.aws.secretAccessKey
});

ffmpeg.setFfprobePath("/usr/bin/avprobe");

router.post('/avatar', (request, response) => {
    const userId = parseInt(request.session.userId);

    if (Buffer.isBuffer(request.body)){
        saveFileToS3(`avatars/${userId}`, request.body, request, response);
    } else{
        let body = new Buffer("");
        request.on('data', function(data) {
            body = Buffer.concat([body, data]);
        });

        request.on('end', function (){
            saveFileToS3(`avatars/${userId}`, body, request, response);
        });
    }
});

router.post('/media', (request, response) => {
    const uuid = uuidV4();
    if (Buffer.isBuffer(request.body)){
        saveFileToS3(`media/${uuid}`, request.body, request, response, uuid);
    } else{
        let body = new Buffer("");
        request.on('data', function(data) {
            body = Buffer.concat([body, data]);
        });

        request.on('end', function (){
            saveFileToS3(`media/${uuid}`, body, request, response, uuid);
        });
    }
});

router.post('/multipart/avatar', (request, response) => {
    const userId = parseInt(request.session.userId);
    return saveFileToS3ViaBusBoy(`avatars/${userId}`, request, response);
});

router.post('/multipart/media', (request, response) => {
    const uuid = uuidV4();
    return saveFileToS3ViaBusBoy(`media/${uuid}`, request, response, uuid);
});

function saveFileToS3ViaBusBoy(awspath, request, response, uuid) {
    const tempFilePath = path.join(os.tmpdir(), path.basename(uuidV4()))
        , busboy = new Busboy({headers: request.headers});
    busboy.on('file', (fieldname, file) => {
        file.pipe(fs.createWriteStream(tempFilePath));
    });
    busboy.on('finish', () => {
        fs.readFile(tempFilePath, (error, dataBuffer) => {
            saveFileToS3(awspath, dataBuffer, request, response, uuid);
        })
    });
    request.pipe(busboy);
}

function saveFileToS3(awspath, data, request, response, uuid) {
    let is, ratio;
    let label = "saveFileToS3" + Math.random();
    console.time(label);
    try {
        is = imageSize(data)
    } catch (e) {
        is = null;
        global.logger.error(e);
    }

    ratio = is ? _calcRatio(is.height, is.width) : 0;

    if (ratio){
        _next();
    } else{
        try {
            ffmpeg.ffprobe(streamifier.createReadStream(data), function(err, metadata) {
                if (err) {
                    // console.error(err);
                    throw Error(err)
                } else {
                    // metadata should contain 'width', 'height' and 'display_aspect_ratio'
                    const {format} = metadata;
                    ratio = _calcRatio(format.height, format.width);
                    _next();
                }
            })
        } catch (e) {
            global.logger.error(e);
            _next();
        }
    }

    function _next(){
        console.timeEnd(label);
        if (!uuid) {
            s3(awspath, data, request, response, uuid, ratio)
        } else {
            label = "save info into DB" + Math.random();
            console.time(label)
            global.db.medialink.create({
                uuid: uuid,
                ratio: ratio
            }).then(result => {
                console.timeEnd(label);
                s3(awspath, data, request, response, uuid, ratio)
            }).catch(e => {
                global.logger.error(e);
                response.sendStatus(status.INTERNAL_SERVER_ERROR)
            });
        }
    }
}

function s3(awspath, data, request, response, uuid, ratio) {
    let label = "save to S3 " + Math.random();
    console.time(label)

    const type = fileType(data)
    let contentType = type ? type.mime : request.headers["content-type"] || "application/octet-stream";
    global.logger.info('mediatype ->', contentType, uuid, new Date());

    let s3 = new AWS.S3();
    s3.putObject({
        Bucket: global.config.bucket.name,
        Key: awspath,
        Body: data,
        ContentType: contentType
    }, function (error) {
        console.timeEnd(label)
        if (error) {
            global.logger.error(error);
            response.sendStatus(status.INTERNAL_SERVER_ERROR);
        } else if (uuid) {
            response.send({uuid: uuid, ratio: ratio});
        } else {
            response.send({ratio: ratio});
        }
    })
}

function _calcRatio(h,w){
    return parseFloat((h / w).toFixed(4)) || 0;
}

module.exports = router;

