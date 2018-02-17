var express = require('express');
router = express.Router();

var analyser = require('../src/analyser')

router.post('/', function (req, res, next) 
{
    analyser.scrapePage(req.body.query, function (results) 
    {
        res.render('result', {
            'results': results
        });
    });
});

module.exports = router;