const client = require("./server").client;
const hasher = require("../custom_modules/hasher");

function validateUser(req, res, next) {
  let { email, phone_number, password } = req.body;
  password = hasher(password);
  const usersCollection = client.db(process.env.DATABASE).collection("Users");

  usersCollection.findOne(
    {
      password: password,
      $or: [{ email: email }, { phone_number: phone_number }],
    },
    (err, result) => {
      if (err) throw err;

      if (result === null) {
        res.status(200).send({ message: "Invalid phone number, email or password" });
      } else {
        req.body.id = result._id.toString();
        req.body.role = result.role;
        next();
      }
    }
  );
}

module.exports = validateUser;
