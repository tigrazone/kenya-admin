/**
 * feeds
 */

'use strict';

let express = require('express')
    , router = express.Router()
    , status = require('http-status')
    , Promise = require('bluebird');

router.get('/', (request, response) => {
    global.db.feed.findAll({
        raw: true
    }).then(
        array => response.send(array)
    ).catch(e => {
        global.logger.error(e);
        response.sendStatus(status.INTERNAL_SERVER_ERROR);
    });
});

router.get('/:feedId', (request, response) => {
    return getFeedByPage(Number.MAX_SAFE_INTEGER, request, response);
});

router.get('/:feedId/page/:articleId', (request, response) => {
    let articleId = request.params.articleId ? parseInt(request.params.articleId) : 0;
    if (articleId === 0) {
        articleId = Number.MAX_SAFE_INTEGER;
    }
    return getFeedByPage(articleId, request, response);
});

function getFeedByPage(articleId, request, response) {
    const userId = parseInt(request.session.userId)
        , feedId = parseInt(request.params.feedId);
    if (!feedId) {
        return response.sendStatus(status.BAD_REQUEST)
    }
    let limit = 0;
    if (global.config && global.config.paginationLimit && parseInt(global.config.paginationLimit)) {
        limit = parseInt(global.config.paginationLimit);
    }

    let feed = null;
    global.db.feed.findOne({
        where: {id: feedId}
    }).then(feedI => {
        feed = feedI;
        return global.db.article.findAll({
            attributes: {exclude: ['feedId', 'userId']},
            where: {
                feedId: feedId,
                id: {$lt: articleId}
            },
            order: [['datetime', 'DESC']],
            limit: limit,
            include: [{
                model: global.db.user,
                as: 'author',
                attributes: {exclude: ['password']},
                required: true
            }, {
                model: global.db.user,
                as: 'like',
                attributes: ['id'],
                through: {attributes: []},
                where: {id: userId},
                required: false
            }, {
                model: global.db.medialink,
                required: false
            }]
        })
    }).then(articles => {
        feed.dataValues.articles = articles;
        const queries = [];
        for (const i in articles) {
            queries.push(
                global.db.comment.findAll({
                    attributes: [[global.db.sequelize.fn('COUNT', global.db.sequelize.col('id')), '`count`']],
                    where: {articleId: articles[i].id},
                    raw: true
                })
            )
        }
        return Promise.all(queries);
    }).then(array => {
        if (!feed) {
            return response.send([]);
        } else {
            const result = JSON.parse(JSON.stringify(feed));
            for (const i in result.articles) {
                let row = result.articles[i];
                row.isLiked = !!row.like.length;
                row.commentCount = array[i][0].count;
                delete row.like;
            }
            response.send(result)
        }
    }).catch(e => {
        global.logger.error(e);
        response.sendStatus(status.INTERNAL_SERVER_ERROR);
    });
}

router.post('/', (request, response) => {
    const feedName = String(request.body.name);
    if (!feedName) {
        return response.sendStatus(status.BAD_REQUEST);
    }
    global.db.feed.create({
        name: feedName
    }).then(
        object => response.send(object)
    ).catch(e => {
        const isNotUnique = e.name === 'SequelizeUniqueConstraintError';
        if (!isNotUnique) {
            logger.error(e);
        }
        const code = isNotUnique ? status.CONFLICT : status.INTERNAL_SERVER_ERROR;
        response.sendStatus(code);
    });
});

router.put('/:feedId', (request, response) => {
    const feedId = parseInt(request.params.feedId)
        , feedName = String(request.body.name);
    if (!feedId || !feedName) {
        return response.sendStatus(status.BAD_REQUEST);
    }
    global.db.feed.findOne({
        raw: true,
        attributes: ['id'],
        where: {id: feedId}
    }).then(object => {
        let queries = [];
        if (!object) {
            response.send(status.NOT_FOUND)
        } else {
            queries.push(global.db.feed.update({name: feedName}, {where: {id: feedId}}))
        }
        return new Promise.all(queries);
    }).then(
        updated => response.send(status.OK)
    ).catch(e => {
        global.logger.error(e);
        response.sendStatus(status.INTERNAL_SERVER_ERROR);
    })
});

module.exports = router;
