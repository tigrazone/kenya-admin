/**
 * feeds
 */

'use strict';

let express = require('express')
    , router = express.Router()
    , status = require('http-status')
    , dao    = require('../utils/dao')
    , Promise = require('bluebird');

router.get('/', (request, response) => {
    global.db.user.findAll({
        raw: true,
        attributes: {exclude: ['password']}
    }).then(
        array => response.send(array)
    ).catch(e => {
        global.logger.error(e);
        response.sendStatus(status.INTERNAL_SERVER_ERROR);
    });
});

router.get('/:userId', (request, response) => {
    const userId = parseInt(request.session.userId);
    global.db.user.findOne({
        where: {id: userId},
        attributes: {exclude: ['password']}
    }).then(object => {
        if (!object) {
            response.sendStatus(status.NOT_FOUND);
        } else {
            response.send(object)
        }
    }).catch(e => {
        global.logger.error(e);
        response.sendStatus(status.INTERNAL_SERVER_ERROR);
    });
});

router.post('/', (request, response) => {
    delete request.body.id;
    global.db.user.create(request.body).then(
        object => response.send(object)
    ).catch(e => {
        const isNotUnique = e.name === 'SequelizeUniqueConstraintError';
        if (isNotUnique === false) {
            logger.error(e);
        }
        const code = isNotUnique ? status.CONFLICT : status.INTERNAL_SERVER_ERROR;
        response.sendStatus(code);
    });
});

router.get('/check/:key/:value', (request, response) => {
    const key = String(request.params.key)
        , value = String(request.params.value)
        , whereCondition = {};
    if (key !== 'nickname' && key !== 'email') {
        response.sendStatus(status.BAD_REQUEST);
    }
    whereCondition[key] = value;
    global.db.user.findOne({
        raw: true,
        attributes: ['id'],
        where: whereCondition
    }).then(
        object => {
            response.send(object ? status.OK : status.NOT_FOUND)
        }
    ).catch(e => {
        global.logger.error(e);
        response.sendStatus(status.INTERNAL_SERVER_ERROR);
    });
});

router.post('/authorization', (request, response) => {
    if (typeof request.body !== 'object') {
        return response.sendStatus(status.BAD_REQUEST)
    }

    const params = request.body
        , email = String(params.email)
        , password = String(params.password)
        , token = params.token
        , isFB = !!params.isFB;
    if (!email || !password) {
        return response.sendStatus(status.BAD_REQUEST)
    }

    global.db.user.findOne({
        raw: true,
        attributes: {exclude: ['password']},
        where: {
            email: email,
            password: password,
            isFB: isFB
        }
    }).then(
        object => {
            if (object) {
                request.session.userId = object.id;
                response.send(object);
                token && dao.addUserFCMToken(object.id, token)
            } else {
                response.sendStatus(status.NOT_FOUND)
            }
        }
    ).catch(e => {
        global.logger.error(e);
        response.sendStatus(status.INTERNAL_SERVER_ERROR);
    });
});

router.put('/:userId', (request, response) => {
    const userId = parseInt(request.session.userId);
    delete request.body.id;
    global.db.user.findOne({
        attributes: ['id'], raw: true, where: {id: userId}
    }).then(object => {
        let queries = [];
        if (!object) {
            response.send(status.NOT_FOUND)
        } else {
            queries.push(global.db.user.update(request.body, {where: {id: userId}}))
        }
        return new Promise.all(queries);
    }).then(
        updated => response.sendStatus(status.OK)
    ).catch(e => {
        global.logger.error(e);
        response.sendStatus(status.INTERNAL_SERVER_ERROR);
    });
});

module.exports = router;
