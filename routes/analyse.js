var express = require('express');
router = express.Router();

var analyser = require('../src/analyser')

router.post('/', function (req, res, next) 
{
    analyser.scrapePage(req.body.query, function (result) 
    {
        analyser.averageImages(result, function(result) {
            res.render('result', {
                'results': result
            });
        });
    });
});

module.exports = router;