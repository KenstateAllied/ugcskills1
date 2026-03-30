const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("../modals/User");

dotenv.config();

const [, , emailArg, passwordArg] = process.argv;
const email = (emailArg || "").trim().toLowerCase();
const password = (passwordArg || "").trim();

if (!email || !password) {
  console.error("Usage: npm.cmd run create-admin -- <email> <password>");
  process.exit(1);
}

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 8000,
  });

  const hashedPassword = await bcryptjs.hash(password, 10);

  const user = await User.findOneAndUpdate(
    { email },
    { email, password: hashedPassword, role: "admin" },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  console.log(`Admin account ready for ${user.email}`);
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error("Failed to create admin account:", error.message);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
