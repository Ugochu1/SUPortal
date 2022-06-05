const client = require("../db/server").client;
const hasher = require("./hasher")

function signup(req, res) {
  let {firstname, lastname, email, phone_number, password} = req.body;
  password = hasher(password);
  const role = req.params.role;
  const usersCollection = client.db(process.env.DATABASE).collection("Users");
  if (role === "admin" || role === "user") {
    var insertObject = {
      firstname, lastname, email, phone_number, password,
      role,
      courses: [],
      mentors: [],
      school: "",
    };
  } else if (role === "mentor") {
    insertObject = {...user, role};
  }
  usersCollection.insertOne(insertObject, (err) => {
    if (err) throw err;

    res.send({ message: "1 user has been created successfully" });
  });
}

module.exports = signup;
