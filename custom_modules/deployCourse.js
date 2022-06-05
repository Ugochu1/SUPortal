const client = require("../db/server").client;

function deployCourse(req, res) {
  const courseDetails = req.body;
  const course_identifier = courseDetails.title.toLowerCase().split(" ").join("-");
  const courseCollection = client
    .db(process.env.DATABASE)
    .collection("Courses");

  courseCollection.updateOne(
    { identifier: course_identifier },
    { $set: { deployed: true } },
    { upsert: false },
    (err) => {
      if (err) throw err;

      res.send({
        message: `Course "${courseDetails.title}" has been deployed successfully`,
      });
    }
  );
}

module.exports = deployCourse;
