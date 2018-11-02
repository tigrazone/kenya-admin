/**
 * index
 */

const express = require('express')
    , router = express.Router();

/* GET home page. */
router.get('/', (request, response) => {
    response.render('index', {title: 'Express'});
});

module.exports = router;

