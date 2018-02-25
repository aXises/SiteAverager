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
            // Generate colour modes.
            analyser.getColourModes(imgProp.overallAvg, function (colourModes)
            {
                // Render the result page based on results.
                res.render('result', {
                    'results': imgAvg,
                    'timeTaken': Date.now() - initTime,
                    'prop': {
                        'size': imgProp.totalPixels,
                        'lum': analyser.getLuminance(imgProp.overallAvg)
                    },
                    'colourModes': colourModes
                });
            });
        });
    });
});

module.exports = router;