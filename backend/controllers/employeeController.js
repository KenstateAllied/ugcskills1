const Employee = require("../modals/Employee");
const { nanoid } = require("nanoid");
const fs = require("fs");
const path = require("path");

const normalizeText = (value) =>
  typeof value === "string" ? value.trim() : value;

const normalizeEmail = (value) => {
  const email = normalizeText(value);
  return email ? email.toLowerCase() : email;
};

const getUploadedImagePath = (req) =>
  req.file ? path.posix.join("uploads", req.file.filename) : "";

const removeImage = (imagePath) => {
  if (!imagePath) {
    return;
  }

  const absoluteImagePath = path.join(__dirname, "..", imagePath);
  if (fs.existsSync(absoluteImagePath)) {
    fs.unlinkSync(absoluteImagePath);
  }
};

const buildEmployeePayload = (data = {}) => ({
  name: normalizeText(data.name),
  email: normalizeEmail(data.email),
  mobile: normalizeText(data.mobile),
  industry: normalizeText(data.industry),
  sub_industry: normalizeText(data.sub_industry),
  skill: normalizeText(data.skill),
  sub_county: normalizeText(data.sub_county),
  ward: normalizeText(data.ward),
  experience: normalizeText(data.experience),
});

const validateLength = (value, minLength, label) => {
  if (value && value.length < minLength) {
    return `${label} must be at least ${minLength} characters long`;
  }

  return null;
};

const validateEmployeePayload = (payload, { requireAllFields = false } = {}) => {
  const requiredFields = [
    "name",
    "email",
    "mobile",
    "industry",
    "sub_industry",
    "skill",
    "sub_county",
    "ward",
    "experience",
  ];

  if (requireAllFields) {
    const missingField = requiredFields.find((field) => !payload[field]);
    if (missingField) {
      return "All employee fields are required";
    }
  }

  const nameError = validateLength(payload.name, 3, "Name");
  if (nameError) {
    return nameError;
  }

  if (payload.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      return "Invalid email format";
    }
  }

  if (payload.mobile && !/^\d{10}$/.test(payload.mobile)) {
    return "Mobile number must be 10 digits";
  }

  const fieldChecks = [
    ["industry", "Industry"],
    ["sub_industry", "Sub industry"],
    ["skill", "Skill"],
    ["sub_county", "Sub county"],
    ["ward", "Ward"],
    ["experience", "Experience"],
  ];

  for (const [field, label] of fieldChecks) {
    const error = validateLength(payload[field], 2, label);
    if (error) {
      return error;
    }
  }

  return null;
};

exports.addEmployee = async (req, res) => {
  try {
    const payload = buildEmployeePayload(req.body);
    const validationError = validateEmployeePayload(payload, {
      requireAllFields: true,
    });

    if (validationError) {
      return res.status(400).json({
        message: validationError,
        success: false,
      });
    }

    if (await Employee.findOne({ email: payload.email })) {
      return res.status(400).json({
        message: "Email already exists",
        success: false,
      });
    }

    if (await Employee.findOne({ mobile: payload.mobile })) {
      return res.status(400).json({
        message: "Mobile number already exists",
        success: false,
      });
    }

    await Employee.create({
      id: nanoid(8),
      ...payload,
      image: getUploadedImagePath(req),
      user: req.user._id,
    });

    return res.status(201).json({
      message: "Professional added successfully",
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to add new professional",
      error: error.message,
      success: false,
    });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const empId = req.params.id || req.query.id;

    if (!empId) {
      return res.status(400).json({
        message: "Professional ID is required",
        success: false,
      });
    }

    const employee = await Employee.findById(empId);
    if (!employee) {
      return res.status(404).json({
        message: "Professional not found",
        success: false,
      });
    }

    const payload = buildEmployeePayload(req.body);
    const providedPayload = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined && value !== "")
    );

    if (!Object.keys(providedPayload).length && !req.file) {
      return res.status(400).json({
        message: "No changes were provided",
        success: false,
      });
    }

    const validationError = validateEmployeePayload(providedPayload);
    if (validationError) {
      return res.status(400).json({
        message: validationError,
        success: false,
      });
    }

    if (providedPayload.email) {
      const existingEmail = await Employee.findOne({
        email: providedPayload.email,
        _id: { $ne: empId },
      });

      if (existingEmail) {
        return res.status(400).json({
          message: "Email already exists",
          success: false,
        });
      }
    }

    if (providedPayload.mobile) {
      const existingMobile = await Employee.findOne({
        mobile: providedPayload.mobile,
        _id: { $ne: empId },
      });

      if (existingMobile) {
        return res.status(400).json({
          message: "Mobile number already exists",
          success: false,
        });
      }
    }

    if (req.file && employee.image) {
      removeImage(employee.image);
      providedPayload.image = getUploadedImagePath(req);
    } else if (req.file) {
      providedPayload.image = getUploadedImagePath(req);
    }

    await Employee.findByIdAndUpdate(empId, providedPayload, {
      runValidators: true,
    });

    return res.status(200).json({
      message: "Professional data updated successfully",
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to update professional data",
      error: error.message,
      success: false,
    });
  }
};

exports.getAllEmployee = async (_req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Professionals fetched successfully",
      employees,
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to fetch professionals",
      error: error.message,
      success: false,
    });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const empId = req.params.id || req.query.id;

    if (!empId) {
      return res.status(400).json({
        message: "Employee ID is required",
        success: false,
      });
    }

    const employee = await Employee.findById(empId);
    if (!employee) {
      return res.status(404).json({
        message: "Professional not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Professional details fetched successfully",
      employee,
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to find professional",
      error: error.message,
      success: false,
    });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const empId = req.params.id || req.query.id;
    const employee = await Employee.findById(empId);

    if (!employee) {
      return res.status(404).json({
        message: "Professional not found",
        success: false,
      });
    }

    if (employee.image) {
      removeImage(employee.image);
    }

    await Employee.findByIdAndDelete(empId);

    return res.status(200).json({
      message: "Professional deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Professional deletion failed",
      error: error.message,
      success: false,
    });
  }
};
