const bcryptjs = require("bcryptjs");

const User = require("../modals/User");

const shouldSeedDefaultUsers =
  process.env.SEED_DEFAULT_USERS === "true" || process.env.NODE_ENV !== "production";

const DEFAULT_DEV_USERS = [
  {
    label: "Admin",
    email: process.env.DEFAULT_ADMIN_EMAIL || process.env.DEV_ADMIN_EMAIL || "email@gmail.com",
    password: process.env.DEFAULT_ADMIN_PASSWORD || process.env.DEV_ADMIN_PASSWORD || "admin123",
    role: "admin",
  },
  {
    label: "User",
    email: process.env.DEFAULT_USER_EMAIL || process.env.DEV_USER_EMAIL || "user@gmail.com",
    password: process.env.DEFAULT_USER_PASSWORD || process.env.DEV_USER_PASSWORD || "user123",
    role: "user",
  },
];

const syncDefaultUser = async (account) => {
  const existingUser = await User.findOne({ email: account.email });

  if (!existingUser) {
    const hashedPassword = await bcryptjs.hash(account.password, 10);

    await User.create({
      email: account.email,
      password: hashedPassword,
      role: account.role,
    });

    return "created";
  }

  let shouldSave = false;

  if (existingUser.role !== account.role) {
    existingUser.role = account.role;
    shouldSave = true;
  }

  const passwordMatches = await bcryptjs.compare(account.password, existingUser.password);

  if (!passwordMatches) {
    existingUser.password = await bcryptjs.hash(account.password, 10);
    shouldSave = true;
  }

  if (shouldSave) {
    await existingUser.save();
    return "updated";
  }

  return "unchanged";
};

const ensureDevAdmin = async (connectionInfo = {}) => {
  if (!shouldSeedDefaultUsers) {
    return;
  }

  const syncedUsers = [];

  for (const account of DEFAULT_DEV_USERS) {
    const syncResult = await syncDefaultUser(account);

    if (syncResult !== "unchanged") {
      syncedUsers.push({ ...account, syncResult });
    }
  }

  if (syncedUsers.length > 0) {
    console.log("Synchronized configured default login accounts.");
  }

  console.log(`Auth mode: ${connectionInfo.mode || "database"}`);
  console.log("Configured default credentials:");

  DEFAULT_DEV_USERS.forEach((account) => {
    console.log(`${account.label}: ${account.email} / ${account.password}`);
  });
};

module.exports = ensureDevAdmin;
