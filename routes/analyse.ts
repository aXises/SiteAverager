import * as express from "express";
import { Analyser } from "../src/Analyser";
import { Scrapper } from "../src/Scrapper";

export const router = express.Router();

router.post("/", (req, res, next) => {
    // Get the current time to determine the time taken.
    const initTime = Date.now();
    const scrapper = new Scrapper(req.body.url);
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
