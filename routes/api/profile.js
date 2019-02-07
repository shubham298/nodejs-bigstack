const express = require('express');
const router = express.Router();
//router will serve to path api/profile/
router.get("/", (req, res) => res.json({ test: "Profile is success" }));

module.exports = router;