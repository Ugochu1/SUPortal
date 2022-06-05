const { ObjectId } = require("mongodb");
const hasher = require("./hasher");
const client = require("../db/server").client;

function changePassword(req, res) {
  let id = req.body.id;
  let password = hasher(req.body.password);
  const usersCollection = client.db(process.env.DATABASE).collection("Users");
  usersCollection.updateOne(
    { _id: ObjectId(id) },
    { $set: { password: password } },
    { upsert: false },
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
}

module.exports = changePassword;
