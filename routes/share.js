/**
 * Created by itersh on 25.10.17.
 */
let express = require('express')
    , router = express.Router()
    , status = require('http-status')
    , dao = require('../utils/dao')
    , utils = require('../utils/utils')
    , appConst = require('../utils/const').app

router.get('/article/:articleId', (request, response) => {
    const articleId = parseInt(request.params.articleId);
    if (!articleId) {
        return response.sendStatus(status.BAD_REQUEST)
    }
    const userId = 0;
    dao.getArticleFromDB(articleId, userId)
        .then(article => {
            if (!article || article.id === null) {
                response.sendStatus(status.NOT_FOUND);
            } else {
                article.dataValues.isLiked = article.dataValues.like && !!article.dataValues.like.length;
                delete article.dataValues.like;

                const requrl   = utils.getRequrl(request)
                    , apptitle = appConst.sharing.TITLE
                    , appdesc  = appConst.sharing.DESCRIPTION;

                response.render('share_post', { article, requrl, apptitle, appdesc });
            }
        }).catch(e => {
        global.logger.error(e);
        response.sendStatus(status.INTERNAL_SERVER_ERROR);
    });
});

module.exports = router;