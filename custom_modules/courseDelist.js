const client = require("../db/server").client;
const { ObjectId } = require("mongodb");

function courseDelist(req, res) {
  const { title, facilitator } = req.body;
  const courseCollection = client
    .db(process.env.DATABASE)
    .collection("Courses");
  const usersCollection = client.db(process.env.DATABASE).collection("Users");
  const identifier = title.toLowerCase().split(" ").join("-");

  let responseArray = [];

  usersCollection.findOne(
    {
      _id: ObjectId(req.body.id)
    },
    (err, result) => {
      if (err) throw err;

      let { firstname, lastname, email, phone_number, _id } = result;
      let stringId = _id.toString();
      courseCollection.updateOne(
        {
          identifier: identifier,
          "participants.email": email,
          "participants.phone_number": phone_number,
        },
        {
          $pull: { participants: { firstname, lastname, email, phone_number, id: stringId } },
        },
        { upsert: false },
        (err, result) => {
          if (err) throw err;
          responseArray.push(result);
        }
      );
    }
  );

  usersCollection.updateOne(
    {
      _id: ObjectId(req.body.id),
      "courses.identifier": identifier,
      "courses.facilitator": facilitator,
    },
    { $pull: { courses: { identifier, facilitator } } },
    { upsert: false },
    (err, result) => {
      if (err) throw err;
      responseArray.push(result);
      res.send({ responseArray });
    }
  );
}

module.exports = courseDelist;
