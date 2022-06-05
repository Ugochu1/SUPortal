const client = require("../db/server").client;

function getAccount(req, res) {
  const usersCollection = client.db(process.env.DATABASE).collection("Users");

  usersCollection.findOne(
    {
      $or: [
        { email: req.body.inputValue },
        { phone_number: req.body.inputValue },
      ],
    },
    { projection: { firstname: 1, lastname: 1, email: 1 } },
    (err, result) => {
      if (err) throw err;
      res.send(result)
    }
  );
}

module.exports = getAccount;
