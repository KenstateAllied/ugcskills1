const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"], // only admin or user
      default: "user",         // default role if none provided
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);