const client = require("../../db/server").client;

function getLiveExams(res) {
  const examCollection = client.db(process.env.DATABASE).collection("Exams");
  examCollection
    .find(
      { deployed: true },
      { projection: { sections: 0, _id: 0, accessKey: 0 } }
    )
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
}

module.exports = getLiveExams;
