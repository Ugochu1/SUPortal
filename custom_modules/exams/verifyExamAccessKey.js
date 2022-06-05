const client = require("../../db/server").client;

function verifyExamAccessKey(req, res) {
  let identifier = req.params.exam;
  const examCollection = client.db(process.env.DATABASE).collection("Exams");
  examCollection.findOne(
    {
      identifier,
      accessKey: req.body.accessKey,
      writable: true,
      "participants.userId": { $ne: req.body.id },
      creator: { $ne: req.body.id },
      "sections.examiner": { $ne: req.body.id },
    },
    (err, result) => {
      if (err) throw err;
      if (result != null) {
        res.send("Access granted");
      } else {
        res.send("Access denied");
      }
    }
  );
}

module.exports = verifyExamAccessKey;
