const client = require("./server").client;
const { ObjectId } = require("mongodb");
const decryptId = require("../crypto/decryptId");
const hasher = require("../custom_modules/hasher");

function getUser(req, res) {
  let { id } = req.body;
  const usersCollection = client.db(process.env.DATABASE).collection("Users");

  usersCollection.findOne(
    {
      _id: ObjectId(id)
    },
    (err, result) => {
      if (err) throw err;

      if (result === null) {
        res.status(204).send({ message: "User not found" });
      } else {
        res.status(200).send(result);
      }
    }
  );
}

module.exports = getUser;
