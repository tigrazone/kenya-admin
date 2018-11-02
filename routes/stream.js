'use strict';

let express = require('express')
    , router = express.Router()
    , status = require('http-status')
    , notification = require('../utils/notification')
    , notifConst = require('../utils/const').notifacation

//get all	
router.get('/new', (req, res) => {
    const {clip_key, operation_name} = req.query;
    switch (operation_name){
        case "edit_video":
            notification.push(notifConst.topic.KM_STREAM, notifConst.type.STREAM, 0, notifConst.action.ADD, null, `Kenya Moore On Air`)
            break;
    }
    res.end();
});

module.exports = router;


