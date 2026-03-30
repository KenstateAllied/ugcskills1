const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const connectDB = require("./config/db");
const ensureDevAdmin = require("./utils/ensureDevAdmin");
const authRoute = require("./routes/authRoutes");
const employeRoute = require("./routes/employeRoutes");

dotenv.config();

const app = express();
const frontendBuildPath = path.join(__dirname, "../frontend/build");

app.use(cors());
app.use(express.json());

app.use("/auth", authRoute);
app.use("/employee", employeRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));

  app.get(/^(?!\/(?:auth|employee|uploads)\b).*/, (_req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const connectionInfo = await connectDB();
  await ensureDevAdmin(connectionInfo);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Server startup failed:", error.message);
  process.exit(1);
});
