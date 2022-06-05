const client = require("../db/server").client;

function updateCourse(req, res) {
  const course_identifier = req.body.title.toLowerCase().split(" ").join("-");
  const updatedValues = {
    title: req.body.title,
    facilitator: req.body.facilitator,
    modules: req.body.modules,
    participants: req.body.participants,
    admins: req.body.admins,
    chat_room: req.body.chat_room,
    deployed: req.body.deployed,
    identifier: course_identifier,
  };
  const courseCollection = client
    .db(process.env.DATABASE)
    .collection("Courses");

  courseCollection.updateOne(
    { identifier: course_identifier },
    { $set: updatedValues },
    { upsert: false },
    (err) => {
      if (err) throw err;

      res.send({
        message: `Course "${updatedValues.title}" has been updated successfully`,
      });
    }
  );
}

module.exports = updateCourse;
