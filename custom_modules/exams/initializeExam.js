const client = require("../../db/server").client;

function initializeExam(req, res) {
  let accessKey = Math.floor(Math.random() * 10120).toString();
  let identifier = req.body.examObj.title.split(" ").join("-").toLowerCase();
  let initializerObject = {
    ...req.body.examObj,
    identifier,
    accessKey,
    deployed: false,
    participants: [],
    writable: false
  };
  const examCollection = client.db(process.env.DATABASE).collection("Exams");
  examCollection.findOne({ identifier: identifier }, (err, result) => {
    if (err) throw err;
    if (result == null) {
      examCollection.insertOne(initializerObject, (err, result_two) => {
        if (err) {
          throw err;
        } else {
          if (result_two.acknowledged == true) {
            res.send({
              message: `You have successfully initialized exam ${initializerObject.title}`,
            });
          } else {
            res.send({ message: "There was an error creating exam." });
          }
        }
      });
    } else {
      res.send({ message: "This exam already exists." });
    }
  });
}

module.exports = initializeExam;
