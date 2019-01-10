import * as express from "express";
import Analyser from "src/Analyser";
import Scrapper from "src/Scrapper";
import { RequestError } from "request-promise/errors";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const initTime = Date.now();
        const scraper = new Scrapper(req.body.url);
        const images = await scraper.scrape();
        const analyser = new Analyser(images);
        await analyser.analyse();
        res.render("result", {
            imageData: analyser.getImageData(),
            totalColourModes: analyser.getTotalColourModes(),
            totalPixels: analyser.getTotalPixels(),
            totalLuminance: analyser.getTotalLuminance(),
            timeTaken: Date.now() - initTime,
        });
    } catch (err) {
        if (err instanceof RequestError) {
            res.render("error", {
                message: "Invalid URI",
            });
        } else {
            res.render("error", {
                message: "Analyser error. Please see logs.",
                error: {
                    status: 500,
                    stack: err,
                },
            });
        }
    }
});

export default router;
