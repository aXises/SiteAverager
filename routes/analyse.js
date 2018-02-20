var express = require('express');
router = express.Router();

var analyser = require('../src/analyser')

router.get('/', function (req, res, next) 
{
    analyser.scrapePage(req.query.query, function (result) 
    {
        if (result.code && result.errno) 
        {
            res.render('error', {
                'error': result
            });
            return;
        }
        analyser.averageImages(result, function(imgAvg, totalAvg) 
        {
            res.render('result', {
                'results': imgAvg,
                'totalAvg': totalAvg
            });
        });
    });
});

module.exports = router;