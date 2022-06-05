const client = require("./server").client;

function courseNotFound(req, res, next) {
  const query = req.body;
  const courseCollection = client
    .db(process.env.DATABASE)
    .collection("Courses");
  const identifier = query.title.toLowerCase().split(" ").join("-");

  courseCollection.findOne({ identifier: identifier }, (err, result) => {
    if (err) throw err;

    if (result === null) {
      next();
    } else {
      res.send({message: "This course already exists"});
    }
  });
}

function courseFound(req, res, next) {
  const query = req.body;
  const courseCollection = client
    .db(process.env.DATABASE)
    .collection("Courses");
  const identifier = query.title.toLowerCase().split(" ").join("-");

  courseCollection.findOne(
    { identifier: identifier, facilitator: query.facilitator },
    (err, result) => {
      if (err) throw err;

      if (result === null) {
        res.status(404).send("Course not found");
      } else {
        next();
      }
    }
  );
}

function courseNotDeployed(req, res, next) {
  const query = req.body;
  const courseCollection = client
    .db(process.env.DATABASE)
    .collection("Courses");
  const identifier = query.title.toLowerCase().split(" ").join("-");

  courseCollection.findOne(
    { identifier: identifier, facilitator: query.facilitator, deployed: false },
    (err, result) => {
      if (err) throw err;

      if (result === null) {
        res.status(404).send("The course has already been deployed or does not exist");
      } else {
        next();
      }
    }
  );
}

function courseDeployed(req, res, next) {
  const query = req.body;
  const courseCollection = client
    .db(process.env.DATABASE)
    .collection("Courses");
  const identifier = query.title.toLowerCase().split(" ").join("-");

  courseCollection.findOne(
    { identifier: identifier, facilitator: query.facilitator, deployed: true },
    (err, result) => {
      if (err) throw err;

      if (result === null) {
        res.status(404).send("This course is not ready for viewing");
      } else {
        next();
      }
    }
  );
}

module.exports = {
  courseNotFound,
  courseFound,
  courseNotDeployed,
  courseDeployed,
};
