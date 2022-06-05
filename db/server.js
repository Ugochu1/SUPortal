const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb+srv://Yugee_O:ugoMONGODB19@su-portal.zoa3a.mongodb.net/test");

async function main() {
  await client.connect();
  console.log("Successfully connected to database...");
}

module.exports = {
  main,
  client
};
