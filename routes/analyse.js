var express = require('express');
router = express.Router();

var analyser = require('../src/analyser')

router.post('/', function (req, res, next) 
{
    analyser.scrapePage(req.body.query, function (result) 
    {
        analyser.averageImages(result, function(imgAvg, totalAvg) {
            res.render('result', {
                'results': imgAvg,
                'totalAvg': totalAvg
            });
        });
    });
});

module.exports = router;