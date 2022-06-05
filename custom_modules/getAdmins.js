const { ObjectId } = require("mongodb");
const client = require("../db/server").client;

function getAdmins(req, res) {
  const userCollection = client.db(process.env.DATABASE).collection("Users");

  userCollection
    .find({ role: "admin", _id: { $ne: ObjectId(req.body.id) } })
    .toArray((err, result) => {
      if (err) throw err
      else {
        res.send(result)
      }
    });
}

module.exports = getAdmins;
