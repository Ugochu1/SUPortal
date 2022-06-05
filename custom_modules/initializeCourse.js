const client = require("../db/server").client;

function initializeCourse(req, res) {
  const initialValues = req.body;
  const courseCollection = client.db(process.env.DATABASE).collection("Courses");

  const fullInit = {
    title: initialValues.title,
    facilitator: initialValues.facilitator,
    identifier: initialValues.title.toLowerCase().split(" ").join("-"),
    modules: [],
    participants: [],
    admins: [initialValues.id],
    chat_room: initialValues.title.toLowerCase().split(" ").join("-"),
    deployed: false
  }

  courseCollection.insertOne(fullInit, (err) => {
    if (err) throw err;

    res.send({message: `Course "${fullInit.title}" has been added successfully`})
  })
}

module.exports = initializeCourse;