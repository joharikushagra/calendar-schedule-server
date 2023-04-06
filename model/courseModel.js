var mongoose = require("mongoose");

const userCourseSchema = mongoose.Schema({
  userId: { type: String },
  committedTime: { type: String },
  tasks: { type: Object },
});


const UserCourseModel = mongoose.model("userCourse", userCourseSchema);
module.exports = { UserCourseModel };
