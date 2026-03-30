const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let memoryServer;

const connectAtlas = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 8000,
  });

  return { mode: "atlas" };
};

const connectInMemory = async () => {
  memoryServer = await MongoMemoryServer.create({
    instance: {
      dbName: "ugcskills-dev",
    },
  });

  const memoryUri = memoryServer.getUri();

  await mongoose.connect(memoryUri, {
    dbName: "ugcskills-dev",
  });

  return { mode: "memory", uri: memoryUri };
};

const stopInMemory = async () => {
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};

const connectDB = async () => {
  try {
    const atlasConnection = await connectAtlas();
    console.log("DB connected!");
    return atlasConnection;
  } catch (error) {
    console.log("MongoDB connection failed!", error.message);

    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    const memoryConnection = await connectInMemory();
    console.log("Using in-memory MongoDB for local development.");
    return memoryConnection;
  }
};

const closeDB = async () => {
  await mongoose.disconnect();
  await stopInMemory();
};

module.exports = connectDB;
module.exports.closeDB = closeDB;
