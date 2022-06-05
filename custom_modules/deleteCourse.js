const client = require("../db/server").client;

function deleteCourse(req, res) {
  const courseIdentifier = req.body.title.toLowerCase().split(" ").join("-");
  const { facilitator } = req.body;
  const courseCollection = client
    .db(process.env.DATABASE)
    .collection("Courses");

  const usersCollection = client.db(process.env.DATABASE).collection("Users");

  const responseArray = [];

  courseCollection.deleteOne(
    { identifier: courseIdentifier, facilitator },
    (err, result) => {
      if (err) throw err;

      responseArray.push(result);
    }
  );

  usersCollection.updateMany(
    {
      "courses.identifier": courseIdentifier,
      "courses.facilitator": facilitator,
    },
    { $pull: { courses: { identifier: courseIdentifier, facilitator } } },
    { upsert: false },
    (err, result) => {
      if (err) throw err;

      responseArray.push(result);
      res.send({ responseArray });
    }
  );
}

module.exports = deleteCourse;
