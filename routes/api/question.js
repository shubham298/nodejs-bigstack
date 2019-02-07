const express = require("express");

const router = express.Router();
router.get("/", (req, res) => {
    res.json({ test: "Question is successfull" })
})
module.exports = router;