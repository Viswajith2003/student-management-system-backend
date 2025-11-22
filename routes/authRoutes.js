const express = require("express");
const router = express.Router();
const {
  adminLogin,
  studentLogin,
  registerAdmin,
  registerStudent,
} = require("../controllers/authController");

// @route   POST /api/auth/admin-login
// @desc    Admin login
// @access  Public
router.post("/admin-login", adminLogin);

// @route   POST /api/auth/student-login
// @desc    Student login
// @access  Public
router.post("/student-login", studentLogin);

// @route   POST /api/auth/register-admin
// @desc    Register initial admin (for development/setup)
// @access  Public (should be protected in production)
router.post("/register-admin", registerAdmin);

// @route   POST /api/auth/register-student
// @desc    Student self-registration
// @access  Public
router.post("/register-student", registerStudent);

module.exports = router;
