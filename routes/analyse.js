var express = require('express');
router = express.Router();

var analyser = require('../src/analyser')

router.get('/', function (req, res, next) 
{
    // Get the current time to determine the time taken.
    var initTime = Date.now();
    // Scrape the page for images.
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
        // Average the images.
        analyser.averageImages(result, function(imgAvg, imgProp) 
        {
            // Render the result page based on results.
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