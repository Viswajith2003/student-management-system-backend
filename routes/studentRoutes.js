const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  updateStudentSubjects,
} = require("../controllers/studentController");

// @route   GET /api/students
// @desc    Get all students
// @access  Private (Admin)
router.get("/", authMiddleware, getAllStudents);

// @route   GET /api/students/:id
// @desc    Get student by ID
// @access  Private
router.get("/:id", authMiddleware, getStudentById);

// @route   POST /api/students
// @desc    Create new student
// @access  Private (Admin)
router.post("/", authMiddleware, createStudent);

// @route   PUT /api/students/:id
// @desc    Update student
// @access  Private (Admin)
router.put("/:id", authMiddleware, updateStudent);

// @route   DELETE /api/students/:id
// @desc    Delete student
// @access  Private (Admin)
router.delete("/:id", authMiddleware, deleteStudent);

// @route   PUT /api/students/:id/subjects
// @desc    Update student subjects/marks
// @access  Private (Admin)
router.put("/:id/subjects", authMiddleware, updateStudentSubjects);

module.exports = router;
