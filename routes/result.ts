import * as express from "express";
import { Analyser } from "src/Analyser";
import Scrapper from "src/Scrapper";

const router = express.Router();

router.post("/", async (req, res, next) => {
    // Get the current time to determine the time wtaken.
    const initTime = Date.now();
    try {
        const scraper = new Scrapper(req.body.url);
        await scraper.scrape();
    } catch (err) {
        res.send(JSON.stringify(new Error(err)));
    }
    // const analyser = new Analyser();
    // Scrape the page for images.
    // analyser.scrapePage(decodeURIComponent(req.query.query), function (result)
    // {
    //     if (result.err)
    //     {
    //         res.render("error", {
    //             "message": "Analyser error",
    //             "error": {
    //                 "status": 404,
    //                 "stack": result.err
    //             }
    //         });
    //         return;
    //     }
    //     // Average the images.
    //     analyser.averageImages(result, function(imgAvg, imgProp)
    //     {
    //         // Render the result page based on results.
    //         res.render("result",
    //         {
    //             "results": imgAvg,
    //             "timeTaken": Date.now() - initTime,
    //             "prop": {
    //                 "size": imgProp.totalPixels,
    //                 "lum": analyser.getLuminance(imgProp.overallAvg)
    //             },
    //             "colourModes": analyser.getColourModes(imgProp.overallAvg)
    //         });
    //     });
    // });
});

export default router;
