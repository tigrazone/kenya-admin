/**
 * articles
 */

'use strict';

let express = require('express')
    , router = express.Router()
    , status = require('http-status')
    , dao = require('../utils/dao')
    , notification = require('../utils/notification')
    , utils = require('../utils/utils')
    , notifConst = require('../utils/const').notifacation
    , Promise = require('bluebird');

router.get('/', (request, response) => {
    global.db.article.findAll().then(
        array => response.send(array)
    ).catch(e => {
        global.logger.error(e);
        response.sendStatus(status.INTERNAL_SERVER_ERROR);
    });
});

router.get('/:articleId', (request, response) => {
    const articleId = parseInt(request.params.articleId);
    if (!articleId) {
        return response.sendStatus(status.BAD_REQUEST)
    }
    const userId = parseInt(request.session.userId)
    dao.getArticleFromDB(articleId, userId)
        .then(object => {
            if (!object) {
                response.sendStatus(status.NOT_FOUND);
            } else {
                object.dataValues.isLiked = object.dataValues.like && !!object.dataValues.like.length;
                delete object.dataValues.like;

                response.send(object)
            }
        }).catch(e => {
            global.logger.error(e);
            response.sendStatus(status.INTERNAL_SERVER_ERROR);
        });
});

router.post('/', (request, response) => {
    const userId = parseInt(request.session.userId)
        , object = request.body;
    if (typeof request.body !== 'object') {
        return response.sendStatus(status.BAD_REQUEST)
    }
    let feedId = parseInt(object.feedId)
        , mediaType = String(object.mediatype)
        , medialinkUuid = String(object.medialink)
        , title = String(object.title)
        , subtitle = String(object.subtitle)
        , description = String(object.description);
    if (mediaType === 'text') {
        medialinkUuid = null;
    } else if ((mediaType !== 'image' && mediaType !== 'video') || !medialinkUuid) {
        return response.sendStatus(status.BAD_REQUEST)
    } else if (!feedId) {
        return response.sendStatus(status.BAD_REQUEST)
    }
    global.db.article.create({
        title: title,
        subtitle: subtitle,
        description: description,
        mediatype: mediaType,
        medialinkUuid: medialinkUuid,
        feedId: feedId,
        userId: userId
    }).then(
        object => {
            if (feedId === 1){
                const notificationTitle = `Kenya Posted ${object.title}`
                notification.push(notifConst.topic.KM_WALL, notifConst.type.ARTICLE, object.id, notifConst.action.ADD, userId, notificationTitle)
            }
            return response.send(object)
        }
    ).catch(e => {
        global.logger.error(e);
        const isNotUnique = e.name === 'SequelizeUniqueConstraintError';
        if (!isNotUnique) {
            logger.error(e);
        }
        const code = isNotUnique ? status.CONFLICT : status.INTERNAL_SERVER_ERROR;
        response.sendStatus(code);
    });
});

router.put('/:articleId', (request, response) => {
    const articleId = parseInt(request.params.articleId);
    if (!articleId) {
        return response.sendStatus(status.INTERNAL_SERVER_ERROR);
    }
    delete request.body.id;
    global.db.article.findOne({
        raw: true,
        attributes: ['id'],
        where: {id: articleId}
    }).then(object => {
        let queries = [];
        if (!object) {
            response.send(status.NOT_FOUND)
        } else {
            queries.push(global.db.feed.update(request.body, {where: {id: articleId}}))
        }
        return new Promise.all(queries);
    }).then(
        updated => response.send(status.OK)
    ).catch(e => {
        global.logger.error(e);
        response.sendStatus(status.INTERNAL_SERVER_ERROR)
    });
});

router.post('/like/:articleId', (request, response) => {
    const userId = parseInt(request.session.userId)
        , articleId = parseInt(request.params.articleId);
    if (!articleId) {
        return response.sendStatus(status.BAD_REQUEST)
    }
    let isExists = false;
    global.db.sequelize.transaction(t => {

        return global.db.userArticleLike.findOne({
            raw: true,
            where: [{userId: userId}, {articleId: articleId}],
            transaction: t
        }).then(result => {
            isExists = !!result;
            if (isExists) {
                return global.db.userArticleLike.destroy({
                    where: {
                        userId: userId,
                        articleId: articleId
                    }
                }, {
                    transaction: t
                })
            } else {
                return global.db.userArticleLike.create({
                    userId: userId,
                    articleId: articleId
                }, {
                    transaction: t
                })
            }
        }).then(() => {
            const operator = isExists ? '-' : '+';
            return global.db.article.update({
                likes: global.db.sequelize.literal(`likes ${operator} 1`)
            }, {
                where: {id: articleId},
                transaction: t
            });
        }).then(() => {
            return global.db.article.findOne({
                raw: true,
                attributes: ['userId', 'likes'],
                where: {id: articleId},
                transaction: t
            })
        }).then(article => {
            if (!isExists){
                global.db.user.findOne({
                    raw: true,
                    attributes: ['nickname'],
                    where: {id: userId}
                }).then(r=>{
                    const notificationTitle = `${r.nickname} liked your post`

                    notification.send(article.userId, notifConst.type.ARTICLE, articleId, notifConst.action.LIKE, userId, notificationTitle)
                }).catch(e => {
                    global.logger.error(e);
                })
            }
            response.send({articleId: articleId, isLiked: !isExists, likes: article.likes})
        }).catch(e => {
            if (e.name === 'SequelizeForeignKeyConstraintError') {
                response.sendStatus(status.BAD_REQUEST)
            } else {
                global.logger.error(e);
                response.sendStatus(status.INTERNAL_SERVER_ERROR)
            }
        });
    });
});

module.exports = router;

