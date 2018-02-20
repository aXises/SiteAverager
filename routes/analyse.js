var express = require('express');
router = express.Router();

var analyser = require('../src/analyser')

router.get('/', function (req, res, next) 
{
    var initTime = Date.now();
    analyser.scrapePage(decodeURIComponent(req.query.query), function (result) 
    {
        if (result.code && result.errno) 
        {
            res.render('error', {
                'error': result
            });
            return;
        }
        analyser.averageImages(result, function(imgAvg, imgProp) 
        {
            res.render('result', {
                'results': imgAvg,
                'timeTaken': Date.now() - initTime,
                'lum': analyser.getLuminance(imgProp.overallAvg),
                'prop': {
                    'size': imgProp.totalPixels,
                    'averageRGB': imgProp.overallAvg
                }
            });
        });
    });
});

module.exports = router;