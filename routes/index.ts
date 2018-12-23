import * as express from "express";

const router = express.Router();

router.get("/", async (req, res, next) => {
    res.render("index", {
        title: "Site Averager",
    });
});

export default router;
