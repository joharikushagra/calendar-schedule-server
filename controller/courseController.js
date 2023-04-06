const { course } = require("../data");
const moment = require("moment");
const { UserCourseModel } = require("../model/courseModel");
const { getResult } = require("../utils/responseUtil");

const distribute = (hours) => {
  const minsPerDay = hours * 60;
  let scheduleItems = [];

  for (let i = 0; i < course.length; i) {
    let task = course[i];
    let tasksForDay = [];
    let timeUsed = 0;

    while (task?.duration + timeUsed <= minsPerDay && i < course.length) {
      tasksForDay.push(task);
      timeUsed += task.duration;
      task = course[i + 1];
      i++;
    }

    scheduleItems.push(tasksForDay);
  }

  return scheduleItems;
};

const isWeekend = (dayOfWeek) => dayOfWeek === 6 || dayOfWeek === 0;

exports.createCourseSchedule = async (req, res) => {
  const { userId, committedTime } = req.body;

  const items = distribute(committedTime);

  let schedule = {};
  let tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

  let currDate = moment(new Date());
  currDate.date(currDate.date() + 1);
  let i = 0;
  while (i < items.length) {
    if (isWeekend(currDate.day())) {
      currDate.date(currDate.date() + 1);
      currDate = moment(currDate);
      continue;
    }
    const key = currDate.format("YYYY-MM-DD");
    // Debug
    console.log({ key });
    schedule[key] = items[i];
    currDate.date(currDate.date() + 1);
    i++;
  }

  try {
    let course_present = await UserCourseModel.findOne({ userId: userId });
    if (course_present) {
      course_present["committedTime"] = committedTime;
      course_present["tasks"] = schedule;
      await course_present.save();
    } else {
      const course = new UserCourseModel(course_details);
      await course.save();
    }
    return res
      .status(200)
      .json(await getResult(200, "Schedule Created!", course));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(await getResult(500, "Internal Server Error", ""));
  }
};

exports.getCourseSchedule = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(404).json(await getResult(404, "Not Found", ""));
  }
  try {
    const courseSchedule = await UserCourseModel.findOne({ userId: userId });
    return res
      .status(200)
      .json(await getResult(200, "Course fetched!", courseSchedule));
  } catch (error) {
    return res
      .status(500)
      .json(await getResult(500, "Internal Server Error", ""));
  }
};
