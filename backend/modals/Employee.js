const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      unique: true,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    sub_industry: {
      type: String,
      trim: true,
    },
    skill: {
      type: String,
      trim: true,
    },
    sub_county: {
      type: String,
      trim: true,
    },
    ward: {
      type: String,
      trim: true,
    },
    experience: {
      type: String,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
