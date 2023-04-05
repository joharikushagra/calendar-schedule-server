const express = require("express");
const { courseController } = require("../controller/courseController");
const router = express.Router();

router.post("/enroll", courseController);

module.exports = router;
