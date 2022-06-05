const client = require("../db/server").client;

function getAllCourses(res) {
  const courseCollection = client
    .db(process.env.DATABASE)
    .collection("Courses");
  courseCollection.find({ deployed: true }).toArray((err, result) => {
    if (err) throw err;
    res.send(result);
  });
}

module.exports = getAllCourses;
