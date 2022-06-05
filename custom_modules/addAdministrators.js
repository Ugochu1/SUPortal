const client = require("../db/server").client;

function addAdministrators(req, res) {
  const courseCollection = client
    .db(process.env.DATABASE)
    .collection("Courses");
  courseCollection.updateOne(
    { identifier: req.body.identifier },
    { $push: { admins: { $each: req.body.admins } } },
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
}

module.exports = addAdministrators;
