const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.DATABASE_URL);

async function main() {
  await client.connect();
  console.log("Successfully connected to database...");
}

module.exports = {
  main,
  client
};
