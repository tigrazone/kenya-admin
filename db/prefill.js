/**
 * Created by itersh on 10.10.17.
 */
module.exports = function (db) {

    db.sequelize.query(
        'SET FOREIGN_KEY_CHECKS = 0'
    ).then(() => {
        return db.sequelize.sync({
            force: global.config.database.force,
            logging: global.config.database.logging ? global.logger.info : false
        });
    }).then(() => {
        global.logger.info('database synced');
        return db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    }).then(() => {
        if (global.config.database.force !== true) {
            return;
        }
        // db.sequelize.drop()
        addEssences("user", defaultUsers)
            .then(r => addEssences("feed", defaultFeeds))
            .then(r => addEssences("medialink", defaultMedialinks))
            .then(r => addEssences("overlay", defaultOverlays))
            .then(r => addEssences("article", defaultArticles))
            .then(r => addEssences("comment", defaultComments))
    }).catch(e => global.logger.error(e));

    const defaultUsers = [{
        "id": 1,
        "nickname": "Ivan",
        "email": "plopr@ya.ru",
        "password": "11111"
    }, {
        "id": 2,
        "nickname": "test",
        "email": "test@test.com",
        "password": "1111"
    }, {
        "id": 3,
        "nickname": "ysimkin",
        "email": "ysimkin@gmail.com",
        "password": "7e240de74fb1ed08fa08d38063f6a6a91462a815"
    }, {
        "id": 4,
        "nickname": "Kenya Moore",
        "email": "km@maildrop.cc",
        "password": "km2017"
    }];

    const defaultFeeds = [{
        "id": 1,
        "name": "kenya"
    }, {
        "id": 2,
        "name": "community"
    }];

    const defaultOverlays = [{
        "id": 1,
        "name": "Vandam",
        "type": "video",
        "previewUuid": "452354de-ad74-4d44-99a6-73229915b5be",
        "androidFileUuid": "452354de-ad74-4d44-99a6-73229915b5be",
        "iosFileUuid": "452354de-ad74-4d44-99a6-73229915b5be"

    }, {
        "id": 2,
        "name": "community",
        "type": "image",
    },{
        "id": 3,
        "name": "Real Housewifes",
        "type": "image",
        "previewUuid": "1cb144a6-187a-47c6-b46d-ca6e5d093889",
        "androidFileUuid": "1cb144a6-187a-47c6-b46d-ca6e5d093889",
        "iosFileUuid": "1cb144a6-187a-47c6-b46d-ca6e5d093889"
    },
    {
        "id": 4,
        "name": "KM",
        "type": "image",
        "previewUuid": "acbb459e-fad3-4f0d-97c0-fe4516873b30",
        "androidFileUuid": "acbb459e-fad3-4f0d-97c0-fe4516873b30",
        "iosFileUuid": "acbb459e-fad3-4f0d-97c0-fe4516873b30"
    }];

    const defaultMedialinks = [{
        "uuid": "59ac309b-c982-4776-9737-cfebaa891824",
        "": "1.0000"
    }, {
        "uuid": "3c5b8dfa-0e5e-4810-8607-3e940c51f1a5",
        "ratio": "0.6660"
    }, {
        "uuid": "8b5596c0-6b2b-42d0-bad8-606a3930e2a3",
        "ratio": "0.6660"
    }];

    const defaultArticles = [{
        "id": 1,
        "datetime": "2017-09-30 22:39:31",
        "description": "description",
        "mediatype": "video",
        "medialinkUuid": "59ac309b-c982-4776-9737-cfebaa891824",
        "userId": 1,
        "feedId": 1
    }, {
        "id": 2,
        "datetime": "2017-09-30 22:39:31",
        "description": "description",
        "mediatype": "video",
        "medialinkUuid": "59ac309b-c982-4776-9737-cfebaa891824",
        "userId": 1,
        "feedId": 2
    }, {
        "id": 3,
        "datetime": "2017-09-30 22:39:31",
        "description": "Kenya Moore's first encounter with Sheree Whitfield in the Season 8 premiere of The Real Housewives of Atlanta is a moment we'll never forget.",
        "mediatype": "image",
        "medialinkUuid": "3c5b8dfa-0e5e-4810-8607-3e940c51f1a5",
        "userId": 3,
        "feedId": 1
    }, {
        "id": 4,
        "datetime": "2017-09-30 22:39:31",
        "description": "Home, sweet home! For those who can't get enough Real Housewives real estate, here's a taste of what's inside Kenya Moore's buzzed-about Moore Manor.",
        "mediatype": "image",
        "medialinkUuid": "8b5596c0-6b2b-42d0-bad8-606a3930e2a3",
        "userId": 3,
        "feedId": 1
    }];

    const defaultComments = [{
        "id": 1,
        "datetime": "2017-09-30 22:39:30",
        "text": "Comment 1",
        "userId": 2,
        "articleId": 2
    }, {
        "id": 2,
        "datetime": "2017-09-30 22:39:31",
        "text": "Comment 2",
        "userId": 2,
        "articleId": 2
    }, {
        "id": 3,
        "datetime": "2017-09-30 22:39:32",
        "text": "Comment 3",
        "userId": 2,
        "articleId": 2
    }, {
        "id": 4,
        "datetime": "2017-09-30 22:39:33",
        "text": "Comment 4",
        "userId": 2,
        "articleId": 2
    }, {
        "id": 5,
        "datetime": "2017-09-30 22:39:34",
        "text": "Comment 5",
        "userId": 2,
        "articleId": 2
    }, {
        "id": 6,
        "datetime": "2017-09-30 22:39:35",
        "text": "Comment 6",
        "userId": 2,
        "articleId": 2
    }, {
        "id": 7,
        "datetime": "2017-09-30 22:39:36",
        "text": "Comment 7",
        "userId": 2,
        "articleId": 2
    }, {
        "id": 8,
        "datetime": "2017-09-30 22:39:37",
        "text": "Comment 8",
        "userId": 2,
        "articleId": 2
    }, {
        "id": 9,
        "datetime": "2017-09-30 22:39:38",
        "text": "Comment 9",
        "userId": 2,
        "articleId": 2
    }, {
        "id": 10,
        "datetime": "2017-09-30 22:39:39",
        "text": "Comment 10",
        "userId": 2,
        "articleId": 2
    }, {
        "id": 11,
        "datetime": "2017-09-30 22:39:40",
        "text": "Comment 11",
        "userId": 2,
        "articleId": 2
    }];


    function addEssences(type, essences) {
        global.logger.info(`Start add ${type}s`);
        return db[type].bulkCreate(essences).then(() => {
                global.logger.info(`Success add ${type}s`);
                return Promise.resolve();
            }
        )
    }
};
