var express = require("express");
router = express.Router();

router.get("/", function (req, res, next) 
{
    res.render("index", {
        "title":"SiteAverager"
    });
});

module.exports = router;