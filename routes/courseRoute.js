const express = require("express");
const {
  createCourseSchedule,
  getCourseSchedule,
} = require("../controller/courseController");
const router = express.Router();

router.post("/enroll", createCourseSchedule);
router.post("/get-schedule", getCourseSchedule);

module.exports = router;
