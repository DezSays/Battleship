const router = require("express").Router();
const db = require("../models");
const auth = require("../auth");

router.get("/habitBoard", auth, async (req, res) => {
    const records = await db.Habits.findAll({
        where: { userId: req.session.passport.user }
    })
    res.render("habitBoard", { habits: records });
})

module.exports = router;