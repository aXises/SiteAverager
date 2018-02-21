var express = require('express');
router = express.Router();

var analyser = require('../src/analyser')

router.get('/', function (req, res, next) 
{
    var initTime = Date.now();
    analyser.scrapePage(decodeURIComponent(req.query.query), function (result) 
    {
        if (result.err)
        {
            res.render('error', {
                'message': 'Analyser error',
                'error': {
                    'status': 404,
                    'stack': result.err
                }
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