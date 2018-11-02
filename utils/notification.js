/**
 * Created by itersh on 16.10.17.
 */
const FCM  = require('fcm-push')
    , conf = global.config
    , l    = global.logger
    , dao  = require("./dao")

    , serverKey = conf.fcm ? conf.fcm.key : 'AAAANqo4N9s:APA91bFLFkAnda1BYtOap_cItUIFZgbsGX6FC_Sblaohf-e8KhZAPPP3ivN3hpwJm7R54JvQq7IyU9dYnvXb9_13mNXc9i2xwadcq3SGs2W7yy-8UIgssbsA-KD2jldSVtRh4_fZiPEY'
    , fcm = new FCM(serverKey);


/**
 * Send notification to specified user
 * @param userId - target user ID
 * @param type - type of resource
 * @param id - ID instance into resource or NULL
 * @param action - type of action
 * @param from - author ID
 * @param title - title of notification
 */
exports.send = (userId, type, id, action, from, title)=>{

    dao.getUserFCMTokens(userId)
        .then( tokens =>
            tokens.forEach(token => {
                const msg = _buildMessage(token, {type, id, action, from, title});

                fcm.send(msg)
                    .then(r => {
                        l.log(`Successfully sent to user: ${userId} by token ${token} with response: `, r);
                    })
                    .catch(e => {
                        l.log("Something has gone wrong!");
                        l.error(e);
                    })
            })
        ).catch(err => {
            l.log(`Can't get tokens from db for user ${userId}!`);
            l.error(err);
        })
}

/**
 * Send notification to group of users
 * @param to - target group ID
 * @param type - type of resource
 * @param id - ID instance into resource or NULL
 * @param action - type of action
 * @param from - author ID
 * @param title - title of notification
 */
exports.push = (to, type, id, action, from, title)=>{

    const msg = _buildMessage(`/topics/${to}`, {source: to, type, id, action, from, title});

    fcm.send(msg)
        .then(r => {
            l.log(`Successfully sent to topic: ${to} with response: `, r);
        })
        .catch(e => {
            l.log("Something has gone wrong!");
            l.error(e);
        })
}

function _buildMessage(to, {type, id, action, from = null, title = "", source = 'personal'}){

     const message = {
        to, // required fill with device token or topics
        data: {
            type, id, action, author: from, source
        },
        // collapse_key: 'your_collapse_key',
        notification: {
            title,//: 'Title of your push notification',
            // body: 'Body of your push notification',
            // icon : "myicon",
            sound : "default"
        }
    };

    return message;
}