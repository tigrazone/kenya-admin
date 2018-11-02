/**
 * overlays
 */

'use strict';

let express = require('express')
    , router = express.Router()
    , Busboy = require('busboy')
    , uuidV4 = require('uuid/v4')
    , status = require('http-status')
    , AWS    = require('aws-sdk')
    , s3     = new AWS.S3();

const bbLimit = {fields: 2, files: 3, fileSize: 800000 }

router.get('/', (request, response) => {

    const {type} = request.query

    let options = {raw: true}
        , where = {};

    type && (where.type = type);

    Object.keys(where).length && (options.where  = where);

    global.db.overlay
        .findAll(options)
        .then(
            array => response.send(array)
        ).catch(e => {
            global.logger.error(e);
            response.sendStatus(status.INTERNAL_SERVER_ERROR)
        });
});

router.get('/:overlayId', (request, response) => {
    const overlayId = parseInt(request.params.overlayId);
    if (!overlayId) {
        return response.sendStatus(status.BAD_REQUEST)
    }
    global.db.overlay.findOne({
        raw: true,
        where: {id: overlayId}
    }).then(
        array => response.send(array)
    ).catch(e => {
        global.logger.error(e);
        response.sendStatus(status.INTERNAL_SERVER_ERROR)
    });
});

router.post('/', (request, response) => {
    const object = request.body;
    if (typeof request.body !== 'object') {
        return response.sendStatus(status.BAD_REQUEST)
    }
    const name = String(object.name)
        , previewUuid = String(object.previewUuid)
        , type = object.type
        , androidFileUuid = String(object.androidFileUuid)
        , iosFileUuid = String(object.iosFileUuid);
    if (!name || !previewUuid || !androidFileUuid || !androidFileUuid || !type) {
        return response.sendStatus(status.BAD_REQUEST)
    }
    global.db.overlay.create({
        name,
        type,
        previewUuid,
        androidFileUuid,
        iosFileUuid,
    }).then(
        object => response.send(object)
    ).catch(e => {
        global.logger.error(e);
        response.sendStatus(status.INTERNAL_SERVER_ERROR)
    });
});

router.post('/multipart', (req, res) => {

    const busboy = new Busboy({ headers: req.headers, limit: bbLimit })
        , uuid = uuidV4()
        , bucket = global.config.bucket.name;

    let resPre, resFileA, resFileI, resName, resType, rejPre, rejFileA, rejFileI, rejName, rejType;
    
    Promise.all([
        new Promise((res,rej)=>{resType = res; rejType = rej;}),
        new Promise((res,rej)=>{resName = res; rejName = rej;}),
        new Promise((res,rej)=>{resPre  = res; rejPre  = rej;}),
        new Promise((res,rej)=>{resFileA = res; rejFileA = rej;}),
        new Promise((res,rej)=>{resFileI = res; rejFileI = rej;}),
    ]).then(
        r => {
            const [type, name, previewUuid, androidFileUuid, iosFileUuid] = r;
            return global.db.overlay.create({
                name,
                type,
                previewUuid,
                androidFileUuid,
                iosFileUuid,
            })
        }
    ).then(
        r => res.send(r)
    ).catch(e => {
        global.logger.error(e);
        res.sendStatus(status.INTERNAL_SERVER_ERROR)
    });

    busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        switch (fieldname){
            case "name":
                resName(val);
                break;

            case "type":
                resType(val);
                break;

            default:
                rejName(`Unknown field name ${fieldname}`);
                rejType(`Unknown field name ${fieldname}`);
        }
    })

    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        s3.createBucket({
            Bucket: bucket
        },()=>{
            s3.upload(
                {
                    Bucket: bucket,
                    Key: `overlay/${fieldname}/${uuid}`,
                    ContentType: mimetype,
                    ACL: 'public-read',
                    Body: file
                }, function(e, data) {
                    // handle response
                    if (e) {
                        global.logger.error(e);
                        rejFileA(e);
                        rejPre(e);
                        // res.sendStatus(status.INTERNAL_SERVER_ERROR)
                    } else{
                        global.logger.log(data);
                        switch (fieldname){
                            case "androidFile":
                                resFileA(uuid);
                                break;

                            case "iosFile":
                                resFileI(uuid);
                                break;

                            case "preview":
                                resPre(uuid);
                                break;

                            default:
                                rejFileA(`Unknown field name ${fieldname}`);
                                rejFileI(`Unknown field name ${fieldname}`);
                                rejPre(`Unknown field name ${fieldname}`);
                        }
                        // res.json({ "status": "success" });
                    }
                }
            )
        })
    });

    req.pipe(busboy);
});

router.put('/multipart/:id', (req, res) => {

    const id = parseInt(req.params.id);
    if (!id) {
        return res.sendStatus(status.BAD_REQUEST)
    }

    const busboy = new Busboy({ headers: req.headers, limit: bbLimit })
        , uuid = uuidV4()
        , bucket = global.config.bucket.name;

    global.db.overlay.findOne({
        raw: true,
        attributes: ['id'],
        where: {id}
    }).then(
        r => {
            if (r){

                let resPre, resFileA, resFileI, resName, resType, rejPre, rejFileA, rejFileI, rejName, rejType;

                Promise.all([
                    new Promise((res,rej)=>{resType = res; rejType = rej;}),
                    new Promise((res,rej)=>{resName = res; rejName = rej;}),
                    new Promise((res,rej)=>{resPre  = res; rejPre  = rej;}),
                    new Promise((res,rej)=>{resFileA = res; rejFileA = rej;}),
                    new Promise((res,rej)=>{resFileI = res; rejFileI = rej;}),
                ]).then(
                    r => {
                        const [type, name, previewUuid, androidFileUuid, iosFileUuid] = r;
                        return Promise.all([{type, name, previewUuid, androidFileUuid, iosFileUuid},
                            global.db.overlay.update({
                                name,
                                type,
                                previewUuid,
                                androidFileUuid,
                                iosFileUuid
                            }, {
                                where: {id}
                            })]
                        )
                    }
                ).then(
                    r => res.send(r[0])
                ).catch(e => {
                    global.logger.error(e);
                    res.sendStatus(status.INTERNAL_SERVER_ERROR)
                });

                busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
                    switch (fieldname){
                        case "name":
                            resName(val);
                            break;

                        case "type":
                            resType(val);
                            break;

                        default:
                            rejName(`Unknown field name ${fieldname}`);
                            rejType(`Unknown field name ${fieldname}`);
                    }
                });

                busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
                    s3.createBucket({
                        Bucket: bucket
                    },()=>{
                        s3.upload(
                            {
                                Bucket: bucket,
                                Key: `overlay/${fieldname}/${uuid}`,
                                ContentType: mimetype,
                                ACL: 'public-read',
                                Body: file
                            }, function(e, data) {
                                // handle response
                                if (e) {
                                    global.logger.error(e);
                                    rejFileA(e);
                                    rejPre(e);
                                    // res.sendStatus(status.INTERNAL_SERVER_ERROR)
                                } else{
                                    global.logger.log(data);
                                    switch (fieldname){
                                        case "androidFile":
                                            resFileA(uuid);
                                            break;

                                        case "iosFile":
                                            resFileI(uuid);
                                            break;

                                        case "preview":
                                            resPre(uuid);
                                            break;

                                        default:
                                            rejFileA(`Unknown field name ${fieldname}`);
                                            rejFileI(`Unknown field name ${fieldname}`);
                                            rejPre(`Unknown field name ${fieldname}`);
                                    }
                                }
                            }
                        )
                    })
                });

                req.pipe(busboy);
            } else{
                res.sendStatus(status.NOT_FOUND)
            }
        }
    ).catch(e => {
        global.logger.error(e);
        res.sendStatus(status.INTERNAL_SERVER_ERROR)
    });
});

router.put('/:overlayId', (request, response) => {
    const overlayId = parseInt(request.params.overlayId);
    if (!overlayId) {
        return response.sendStatus(status.BAD_REQUEST)
    }
    const object = request.body;
    if (typeof request.body !== 'object') {
        return response.sendStatus(status.BAD_REQUEST)
    }
    const name = String(object.name)
        , previewUuid = String(object.previewUuid)
        , type = object.type
        , fileUuid = String(object.fileUuid);
    if (!name || !previewUuid || !fileUuid || !type) {
        return response.sendStatus(status.BAD_REQUEST)
    }
    global.db.overlay.update({
        type,
        name,
        previewUuid,
        fileUuid
    }, {
        where: {id: overlayId}
    }).then(
        object => response.send(object)
    ).catch(e => {
        global.logger.error(e);
        response.sendStatus(status.INTERNAL_SERVER_ERROR)
    });
});

module.exports = router;
