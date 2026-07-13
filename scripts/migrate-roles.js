// One-off migration: rename the old "user" role to "client".
// Run with: node scripts/migrate-roles.js
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

function readMongoUri() {
  if (process.env.MONGO_URI) return process.env.MONGO_URI;
  const envFile = path.join(__dirname, "..", ".env.local");
  const line = fs
    .readFileSync(envFile, "utf8")
    .split("\n")
    .find((l) => l.trim().startsWith("MONGO_URI"));
  if (!line) throw new Error("MONGO_URI not found in .env.local");
  return line.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
}

async function main() {
  await mongoose.connect(readMongoUri());
  const users = mongoose.connection.collection("users");

  const before = await users.countDocuments({ role: "user" });
  const result = await users.updateMany(
    { role: "user" },
    { $set: { role: "client" } }
  );
  console.log(`Users with old "user" role: ${before}`);
  console.log(`Updated to "client": ${result.modifiedCount}`);

  const summary = await users
    .aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }])
    .toArray();
  console.log("Current role counts:", summary);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
