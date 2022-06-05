const client = require("../db/server").client;

function getUndeployedCourses(req, res) {
  const courseCollection = client
    .db(process.env.DATABASE)
    .collection("Courses");
  courseCollection.find({ deployed: false }).toArray((err, result) => {
    if (err) throw err;

    if (result === null) {
      res.status(204).send({ message: "There are no courses in development" });
    } else {
      res.status(200).send(result);
    }
  });
}

module.exports = getUndeployedCourses;
