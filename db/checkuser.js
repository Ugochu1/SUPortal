const client = require("./server").client;

function checkUser(req, res, next) {
  const { email, phone_number } = req.body;
  const usersCollection = client.db(process.env.DATABASE).collection("Users");

  usersCollection.findOne({
    $or: [{ email: email }, { phone_number: phone_number }],
  }, (err, result) => {
    if(err) throw err;

    if (result === null) {
      next();
    } else {
      res.send({message: "This user exists"});
    }
  });

};

module.exports = checkUser;
