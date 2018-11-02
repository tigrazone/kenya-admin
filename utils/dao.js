/**
 * Created by itersh on 17.10.17.
 */
const db = global.db
    , l  = global.logger;

/**
 * Function select all user FCM tokens from db
 * @param userId - user ID
 * @returns {Promise.<String[]>} - array of FCM tokens
 */
exports.getUserFCMTokens = (userId)=>{

    return db.fcm.findAll({
            raw: true,
            attributes: ['token'],
            where: {userId}
        }).then(
            r => r.map(el => el.token)
    )
}

/**
 * Function select all user FCM tokens from db
 * @param userId - user ID
 * @param token  - FCM token
 * @returns {Promise.<boolean>} - token was added or not
 */
exports.addUserFCMToken = (userId, token)=>{

    return db.fcm.findOne({
            where: {userId, token}
        }).then(
            r =>
                r ? false
                  : db.fcm.create(
                    {
                        userId,
                        token
                    }
                )
        ).then(
            r => !!r
        ).catch(
            e=>{
                l.error(e)
            }
        )
}

/**
 * Get artile from db by ID
 * @param articleId
 * @param userId
 * @returns {Promise.<Model>}
 */
exports.getArticleFromDB = (articleId, userId) => {
    return global.db.article.findOne({
        attributes: {
            include: [
                [global.db.sequelize.fn('COUNT', global.db.sequelize.col('comments.id')), 'countComments'],
                // [global.db.sequelize.fn('COUNT', 'like'), 'isLiked']
            ],
            exclude: ['feedId', 'userId']
        },
        where: {id: articleId},
        include: [{
            model: global.db.comment,
            attributes: ['id', 'datetime', 'text'],
            required: false,
            include: [{
                model: global.db.user,
                attributes: ['id', 'nickname', 'email']
            }]
        }, {
            model: global.db.medialink,
            required: false
        },{
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
        }],
    })
}

/**
 * Save msg into DB
 * @param userId
 * @param text
 *
 * @returns {Promise.<chatmsg>}
 */
exports.saveMsg = (userId, text) => {
    return global.db.chatmsg.create({
        userId, text
    }).then(
        r => global.db.chatmsg.findOne({
            include: [{
                model: global.db.user,
                // as: 'author',
                attributes: {exclude: ['password']},
                required: true,
            }],
            where: {
                id: r.id
            }
        })
    )
}

/**
 * Get messages from DB
 * @param limit
 * @param offset
 *
 * @returns {Promise.<[chatmsg]>}
 */
exports.getMsgs = (limit, offset) => {
    return global.db.chatmsg.findAll({
        include: [{
            model: global.db.user,
            // as: 'author',
            attributes: {exclude: ['password']},
            required: true
        }],
        limit,
        offset,
        order: global.db.sequelize.literal(`datetime DESC`)
    })
}
