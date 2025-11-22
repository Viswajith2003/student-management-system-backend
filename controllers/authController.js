const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const Student = require("../models/student");

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token expires in 7 days
  });
};

// @desc    Admin login
// @route   POST /api/auth/admin-login
// @access  Public
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(admin._id, "admin");

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// @desc    Student login
// @route   POST /api/auth/student-login
// @access  Public
const studentLogin = async (req, res) => {
  try {
    const { regNo, password } = req.body;

    // Validation
    if (!regNo || !password) {
      return res
        .status(400)
        .json({ message: "Please provide registration number and password" });
    }

    // Check if student exists
    const student = await Student.findOne({ regNo: regNo.toUpperCase() });

    if (!student) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if student has a password field (you may need to add this to student model)
    if (!student.password) {
      return res.status(401).json({
        message:
          "Student account not activated. Please contact administration.",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(student._id, "student");

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: student._id,
        name: student.name,
        regNo: student.regNo,
        email: student.email,
        role: "student",
      },
    });
  } catch (error) {
    console.error("Student login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// @desc    Register initial admin (for development/setup only)
// @route   POST /api/auth/register-admin
// @access  Public (should be protected/removed in production)
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });

    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const admin = await Admin.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // Generate token
    const token = generateToken(admin._id, "admin");

    res.status(201).json({
      message: "Admin registered successfully",
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// @desc    Register new student (self-registration)
// @route   POST /api/auth/register-student
// @access  Public
const registerStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      regNo,
      gender,
      phone,
      department,
      dob,
      address,
    } = req.body;

    // Validation
    if (
      !name ||
      !email ||
      !password ||
      !regNo ||
      !gender ||
      !phone ||
      !department
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: name, email, password, regNo, gender, phone, department",
      });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({
      $or: [{ email: email.toLowerCase() }, { regNo: regNo.toUpperCase() }],
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message:
          "Student with this email or registration number already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create student
    const student = await Student.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      regNo: regNo.toUpperCase(),
      gender,
      phone,
      department,
      dob: dob || null,
      address: address || "",
      subjects: [],
    });

    // Generate token
    const token = generateToken(student._id, "student");

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      token,
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        regNo: student.regNo,
        role: "student",
      },
    });
  } catch (error) {
    console.error("Student registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error.message,
    });
  }
};

module.exports = {
  adminLogin,
  studentLogin,
  registerAdmin,
  registerStudent,
};
