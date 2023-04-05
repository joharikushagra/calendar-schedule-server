const { course } = require("../data");
const moment = require("moment");

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

exports.courseController = async (req, res) => {
  let time = 2;
  const items = distribute(time);
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
    currDate.date(currDate.date() + 1);
    currDate = moment(currDate);
    const key = currDate.toISOString().split("T")[0];
    schedule[key] = items[i];
    i++;
  }

  return res.status(200).json({ data: schedule });
};
