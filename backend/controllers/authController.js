const User = require("../modals/User");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "24h" });
};

const normalizeEmail = (email = "") => email.trim().toLowerCase();
const canRegisterAdmin =
  process.env.ALLOW_ADMIN_REGISTRATION === "true" || process.env.NODE_ENV !== "production";

// REGISTER
exports.registerUser = async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = typeof req.body.password === "string" ? req.body.password : "";
  const role = req.body.role === "admin" ? "admin" : "user";

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (role === "admin" && !canRegisterAdmin) {
      return res.status(403).json({
        message: "Admin registration is disabled in production",
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "Registration failed: user already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user with role
    user = await User.create({ email, password: hashedPassword, role });

    res.status(201).json({
      success: true,
      user: {
        _id: user.id,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user.id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
exports.loginUser = async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = typeof req.body.password === "string" ? req.body.password : "";

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(401).json({ message: "Email not registered" });
    }

    const isPasswordValid = await bcryptjs.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({
      success: true,
      user: {
        _id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      },
      token: generateToken(existingUser.id),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
