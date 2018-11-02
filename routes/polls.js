/**
 * polls
 */

'use strict';

let express = require('express')
    , router = express.Router()
    , status = require('http-status')
    , Promise = require('bluebird');

//get all	
router.get('/', (request, response) => {
    global.db.poll.findAll({
        raw: true
    }).then(
        array => response.send(array)
    ).catch(e => {
        global.logger.error(e);
        response.sendStatus(status.INTERNAL_SERVER_ERROR);
    });
});


//get one
router.get('/:pollId', (request, response) => {

    const pollId = parseInt(request.params.pollId);
    if (!pollId) {
        return response.sendStatus(status.BAD_REQUEST)
    }
	
    global.db.poll.findOne({
        where: {id: pollId}
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


//vote
router.get('/:pollId/:answer', (request, response) => {
	
    const userId = parseInt(request.session.userId);

    const pollId = parseInt(request.params.pollId);
    const answer = parseInt(request.params.answer);
	
    if (!pollId) {
        return response.sendStatus(status.BAD_REQUEST)
    }
	
	//сначала найти голосование
	//затем проверить, не голосовал ли этот пользователь раньше
	//голосовал - 500
	//нет - записать
    global.db.poll.findOne({    
        where: {id: pollId, isActive: true}
    }).then(object => {
        if (!object) {
            response.sendStatus(status.NOT_FOUND);
        } else {
			
					
					var data =
					{
						pollId: pollId,
						userId: userId,
						answer: answer
					}
					console.log('90')
					global.db.poll_result.create(data).then(
						object3 => response.send(object3)
					).catch(e => {
						const isNotUnique = e.name === 'SequelizeUniqueConstraintError';
						if (!isNotUnique) {
							logger.error(e);
						}
						const code = isNotUnique ? status.CONFLICT : status.INTERNAL_SERVER_ERROR;
						console.log('code='+code)
						
						response.sendStatus(code);
					});					
        }
    }).catch(e => {
        global.logger.error(e);
        response.sendStatus(status.INTERNAL_SERVER_ERROR);
    });
	
});


//create
router.post('/', (request, response) => {
	
    var query = request.body;
	
	if(
		!query.hasOwnProperty('name')
		&&
		!query.hasOwnProperty('active')
	)
        return response.sendStatus(status.BAD_REQUEST);		
	
	
    const pollName = String(query.name);
	/*
    if (!pollName) {
        return response.sendStatus(status.BAD_REQUEST);
    }
	*/
	
	var data = {};
	if(query.hasOwnProperty('name'))
		data.name = pollName;
	if(query.hasOwnProperty('active'))
	{
		var isActive = Boolean(query.active);
		data.isActive = isActive;
	}
	
	
    global.db.poll.create(data).then(
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


//update
router.put('/:pollId', (request, response) => {
    const pollId = parseInt(request.params.pollId);
	
    if (!pollId) {
        return response.sendStatus(status.BAD_REQUEST);
    }
	
	
    var query = request.body;
	
	if(
		!query.hasOwnProperty('name')
		&&
		!query.hasOwnProperty('active')
	)
        return response.sendStatus(status.BAD_REQUEST);		
	
	
    const pollName = String(query.name);
	/*
    if (!pollName) {
        return response.sendStatus(status.BAD_REQUEST);
    }
	*/
	
	var data = {};
	if(query.hasOwnProperty('name'))
		data.name = pollName;
	if(query.hasOwnProperty('active'))
	{
		var isActive = Boolean(query.active);
		data.isActive = isActive;
	}
	
	
	
    global.db.poll.findOne({
        raw: true,
        attributes: ['id'],
        where: {id: pollId}
    }).then(object => {
        let queries = [];
        if (!object) {
            response.send(status.NOT_FOUND)
        } else {
            queries.push(global.db.poll.update(data, {where: {id: pollId}}))
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
