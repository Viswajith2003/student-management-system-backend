const Student = require("../models/student");
const bcrypt = require("bcryptjs");

// @desc    Get all students with pagination
// @route   GET /api/students?page=1&limit=10
// @access  Private (Admin only)
const getAllStudents = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Search query (optional)
    const searchQuery = req.query.search || "";
    const filter = searchQuery
      ? {
          $or: [
            { name: { $regex: searchQuery, $options: "i" } },
            { email: { $regex: searchQuery, $options: "i" } },
            { regNo: { $regex: searchQuery, $options: "i" } },
            { department: { $regex: searchQuery, $options: "i" } },
          ],
        }
      : {};

    // Get total count
    const totalStudents = await Student.countDocuments(filter);

    // Get paginated students
    const students = await Student.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: students.length,
      total: totalStudents,
      totalPages: Math.ceil(totalStudents / limit),
      currentPage: page,
      data: students,
    });
  } catch (error) {
    console.error("Get all students error:", error);
    res.status(500).json({ message: "Server error while fetching students" });
  }
};

// @desc    Get single student by ID
// @route   GET /api/students/:id
// @access  Private
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Get student by ID error:", error);

    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(500).json({ message: "Server error while fetching student" });
  }
};

// @desc    Create new student
// @route   POST /api/students
// @access  Private (Admin only)
const createStudent = async (req, res) => {
  try {
    const { name, email, regNo, gender, phone, department, password } =
      req.body;

    // Validation
    if (!name || !email || !regNo || !gender || !phone || !department) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Check if student with email or regNo already exists
    const existingStudent = await Student.findOne({
      $or: [{ email: email.toLowerCase() }, { regNo: regNo.toUpperCase() }],
    });

    if (existingStudent) {
      if (existingStudent.email === email.toLowerCase()) {
        return res
          .status(400)
          .json({ message: "Student with this email already exists" });
      }
      return res.status(400).json({
        message: "Student with this registration number already exists",
      });
    }

    // Prepare student data
    const studentData = {
      name,
      email: email.toLowerCase(),
      regNo: regNo.toUpperCase(),
      gender,
      phone,
      department,
    };

    // Hash password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      studentData.password = await bcrypt.hash(password, salt);
    }

    // Create student
    const student = await Student.create(studentData);

    // Return student without password
    const studentResponse = student.toObject();
    delete studentResponse.password;

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: studentResponse,
    });
  } catch (error) {
    console.error("Create student error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    res.status(500).json({ message: "Server error while creating student" });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private (Admin only)
const updateStudent = async (req, res) => {
  try {
    const { name, email, gender, phone, department, password } = req.body;

    // Find student
    let student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if email is being changed and if it already exists
    if (email && email.toLowerCase() !== student.email) {
      const existingEmail = await Student.findOne({
        email: email.toLowerCase(),
      });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (gender) updateData.gender = gender;
    if (phone) updateData.phone = phone;
    if (department) updateData.department = department;

    // Hash password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Update student
    student = await Student.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    console.error("Update student error:", error);

    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Student not found" });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    res.status(500).json({ message: "Server error while updating student" });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (Admin only)
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Delete student error:", error);

    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(500).json({ message: "Server error while deleting student" });
  }
};

// @desc    Update student subjects/marks
// @route   PUT /api/students/:id/subjects
// @access  Private (Admin only)
const updateStudentSubjects = async (req, res) => {
  try {
    const { subjects } = req.body;

    if (!subjects || !Array.isArray(subjects)) {
      return res
        .status(400)
        .json({ message: "Please provide subjects as an array" });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { subjects },
      { new: true, runValidators: true }
    ).select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      success: true,
      message: "Student subjects updated successfully",
      data: student,
    });
  } catch (error) {
    console.error("Update student subjects error:", error);

    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(500).json({ message: "Server error while updating subjects" });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  updateStudentSubjects,
};
