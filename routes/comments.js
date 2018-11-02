/**
 * comments
 */

'use strict';

let express = require('express')
    , router = express.Router()
    , notification = require('../utils/notification')
    , notifConst = require('../utils/const').notifacation
    , status = require('http-status');

router.get('/:articleId', (request, response) => {
    return getCommentByPage(0, request, response)
});

router.get('/:feedId/page/:commentId', (request, response) => {
    const commentId = request.params.commentId ? parseInt(request.params.commentId) : 0;
    return getCommentByPage(commentId, request, response)
});

function getCommentByPage(commentId, request, response) {
    const articleId = parseInt(request.params.articleId);
    if (!articleId && articleId !== 0) {
        return response.sendStatus(status.BAD_REQUEST)
    }
    global.db.comment.findAll({
        attributes: ['id', 'datetime', 'text'],
        where: {articleId: articleId},
        include: [{
            model: global.db.user,
            attributes: ['id', 'nickname', 'email']
        }],
        order: [['datetime', 'DESC']]
    }).then(
        array => response.send(array)
    ).catch(e => {
        global.logger.error(e);
        response.sendStatus(status.INTERNAL_SERVER_ERROR)
    });
}

router.post('/:articleId', (request, response) => {
    const userId = parseInt(request.session.userId)
        , articleId = parseInt(request.params.articleId)
        , text = String(request.body.text);
    if (!articleId || !text) {
        return response.sendStatus(status.BAD_REQUEST)
    }

    let author;

    global.db.article.findOne({
        attributes: ['id', 'userId'],
        where: {id: articleId},
        raw: true
    }).then(article => {
        if (!article) {
            response.sendStatus(status.NOT_FOUND)
        } else {
            author = article.userId;
            return global.db.comment.create({
                text: text,
                userId: userId,
                articleId: articleId
            })
        }
    }).then(inserted => {
        return global.db.comment.findOne({
            attributes: ['id', 'datetime', 'text'],
            where: {id: inserted.id},
            include: [{
                model: global.db.user,
                attributes: ['id', 'nickname', 'email']
            }]
        })
    }).then(object => {
        response.send(object)
        global.db.user.findOne({
            raw: true,
            attributes: ['nickname'],
            where: {id: userId}
        }).then(r=>{
            const notificationTitle = `${r.nickname} commented: ${text}`

            notification.send(author, notifConst.type.ARTICLE, articleId, notifConst.action.COMMENT, userId, notificationTitle)
        }).catch(e => {
            global.logger.error(e);
        })
    }).catch(e => {
        global.logger.error(e);
        response.sendStatus(status.INTERNAL_SERVER_ERROR)
    });
});

module.exports = router;
