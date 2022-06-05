const client = require("../db/server").client;
const { ObjectId } = require("mongodb");
const hasher = require("./hasher");

function courseEnroll(req, res) {
  let { title, facilitator, phone_number, email, password } = req.body;
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

      if(result == null) {}
      
      else {
        let { firstname, lastname, email, phone_number, _id } = result;
        courseCollection.updateOne(
          {
            identifier: identifier,
            "participants.email": { $ne: email },
            "participants.phone_number": { $ne: phone_number },
          },
          {
            $push: { participants: { firstname, lastname, email, phone_number, id: _id.toString() } },
          },
          { upsert: false },
          (err, result) => {
            if (err) throw err;
            responseArray.push(result);
          }
        );
      }
    }
  );

  usersCollection.updateOne(
    {
      _id: ObjectId(req.body.id),
      "courses.identifier": { $ne: identifier },
      "courses.facilitator": { $ne: facilitator },
    },
    { $push: { courses: { identifier, facilitator, title } } },
    { upsert: false },
    (err, result) => {
      if (err) throw err;
      responseArray.push(result);
      res.send({ responseArray });
    }
  );
}

module.exports = courseEnroll;
