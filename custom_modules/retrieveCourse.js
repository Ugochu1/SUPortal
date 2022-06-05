const client = require("../db/server").client;

function retrieveCourse(req, res) {
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
        const myresult = result.admins.filter((admin) => {
          return admin == req.body.id;
        })
        if (myresult.length > 0) {
          res.status(200).send(result)
        } else {
          res.send({
            message: "Oops. You do not have administrative rights to this course."
          })
        }
      }
    }
  );
}

module.exports = retrieveCourse;
