const client = require("../db/server").client;

function getCourse(req, res) {
  let course_identifier = req.body.title.toLowerCase().split(" ").join("-");
  const courseCollection = client
    .db(process.env.DATABASE)
    .collection("Courses");
  courseCollection.findOne(
    { identifier: course_identifier },
    { projection: { _id: 0 } },
    (err, result) => {
      if (err) throw err;

      if (result === null) {
        res.sendStatus(404);
      } else {
        res.send(result);
      }
    }
  );
}

module.exports = getCourse;
