const client = require("../../db/server").client;

function updateExamSection(req, res) {
  let { exam, section } = req.params;
  let questions = req.body.data;
  const examCollection = client.db(process.env.DATABASE).collection("Exams");

  examCollection.updateOne(
    { identifier: exam, "sections.title": section },
    { $set: { "sections.$.questions": questions } },
    { upsert: false },
    (err, result) => {
      if (err) throw err;
      if (result != null) {
        res.send(result);
      }
    }
  );
}

module.exports = updateExamSection;
