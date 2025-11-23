const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://studentdb:studentdb@cluster0.7hxagh4.mongodb.net/studentdb",
    {
      serverSelectionTimeoutMS: 5000,
    }
  )
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    // Don't exit in production, allow retry
  });

// Routes - MAKE SURE THIS IS CORRECT
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);

// Health check route
app.get("/", (req, res) => {
  // const dbStatus =
  //   mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  res.json({
    message: "Student Management System API is running",
    // database: dbStatus,
  });
});

// Diagnostic route - Check environment setup
app.get("/api/health", async (req, res) => {
  try {
    const dbStatus =
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
    const hasMongoUri = !!process.env.MONGO_URI;
    const hasJwtSecret = !!process.env.JWT_SECRET;

    res.json({
      status: "OK",
      database: dbStatus,
      environment: {
        mongoUriSet: hasMongoUri,
        jwtSecretSet: hasJwtSecret,
        nodeEnv: process.env.NODE_ENV || "development",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      error: error.message,
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server (only if not in Vercel serverless environment)
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 3000;
  const HOST = process.env.HOST || "0.0.0.0";

  app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running on ${HOST}:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
  });
}

module.exports = app;
