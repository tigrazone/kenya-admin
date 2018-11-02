/**
 * friendships
 */

'use strict';

let express = require('express')
    , router = express.Router()
    , status = require('http-status')
    , Promise = require('bluebird');

router.get('/', (request, response) => {
    const userId = parseInt(request.session.userId);

    Promise.all([
        global.db.friendship.findAll({
            include: [{all: true}],
            where: {userA: userId}
        }),
        global.db.friendship.findAll({
            include: [{all: true}],
            where: {userB: userId}
        })
    ]).then(queries => {
        const array = [];
        if (queries[0]) {
            queries[0].map(line => {
                array.push(line.userBIdFK)
            })
        }
        if (queries[1]) {
            queries[1].map(line => {
                array.push(line.userAIdFK)
            })
        }
        if (array) {
            response.send(array);
        } else {
            response.sendStatus(status.NOT_FOUND);
        }
    }).catch(e => {
        global.logger.error(e);
        response.sendStatus(status.INTERNAL_SERVER_ERROR);
    });
});

router.post('/:otherUserId', (request, response) => {
    let userId = parseInt(request.session.userId)
        , otherUserId = parseInt(request.params.otherUserId);

    if (!otherUserId) {
        return response.sendStatus(status.BAD_REQUEST);
    } else if (userId === otherUserId) {
        return response.sendStatus(status.CONFLICT);
    }

    // I. Choose an entry that reflects the relationship of the two users.
    const userA = userId
        , userB = otherUserId;

    global.db.friendship.findOne({
        raw: true,
        where: {$or: [{userA: userA, userB: userB}, {userA: userB, userB: userA}]}
    }).then(friendship => {
        // II. Define the current relationship state.
        const friendshipId = friendship ? friendship.id : null
            , stateIsNoRelationship = !friendship
            , stateIsFriends = friendship && friendship.isAccepted
            , stateIsOutcome = friendship && friendship.isAccepted === 0 && userA === friendship.userA
            , stateIsIncome = friendship && friendship.isAccepted === 0 && userA === friendship.userB;

        /**
         * III. Run the function required:
         * 1. If haven't А  ~  B - creates A --> B
         * 2. If have    A --> B - sets    A <-> B
         * 3. If have    A <-> B - sets    B --> A
         * 4. If have    B --> A - deletes A  ~  B
         */
        if (stateIsNoRelationship) {
            return requestAdd(userId, otherUserId, response);
        } else if (stateIsIncome) {
            return friendshipAdd(friendshipId, response);
        } else if (stateIsFriends) {
            const direction = friendship.userA === userId;
            return friendshipDelete(friendshipId, direction, userId, otherUserId, response);
        } else if (stateIsOutcome) {
            return requestDelete(friendshipId, response);
        }
    }).catch(e => {
        global.logger.error(e);
        response.sendStatus(status.INTERNAL_SERVER_ERROR);
    });
});

// add request
function requestAdd(userId, otherUserId, response) {
    return global.db.friendship.create({
        userA: userId,
        userB: otherUserId,
        isAccepted: false
    }).then(inserted => {
        response.sendStatus(inserted ? status.OK : status.INTERNAL_SERVER_ERROR);
    })
}

// add friendship
function friendshipAdd(friendshipId, response) {
    return global.db.friendship.update({
        isAccepted: true
    }, {
        where: {id: friendshipId}
    }).then(updated => {
        response.sendStatus(updated ? status.OK : status.INTERNAL_SERVER_ERROR);
    })
}

// delete friendship
function friendshipDelete(friendshipId, direction, userId, otherUserId, response) {
    return global.db.friendship.update({
        userA: direction ? otherUserId : userId,
        userB: direction ? userId : otherUserId,
        isAccepted: false
    }, {
        where: {id: friendshipId}
    }).then(updated => {
        response.sendStatus(updated ? status.OK : status.INTERNAL_SERVER_ERROR);
    })
}

// delete request
function requestDelete(friendshipId, response) {
    return global.db.friendship.destroy({
        where: {id: friendshipId}
    }).then(count => {
        response.sendStatus(count ? status.OK : status.INTERNAL_SERVER_ERROR);
    })
}

module.exports = router;
