# Student Management System - Backend

A robust REST API backend for managing students, authentication, and academic records. Built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Authentication**: JWT-based authentication for admin and students
- **Student Management**: Complete CRUD operations for student records
- **Subject Management**: Add, edit, delete subjects and marks
- **Grade Calculation**: Automatic grade assignment based on marks
- **Pagination & Search**: Efficient data retrieval with search functionality
- **Validation**: Input validation and error handling
- **Security**: Password hashing with bcrypt, JWT token authentication

## 🛠️ Tech Stack

- **Node.js**: Runtime environment
- **Express.js 5.1.0**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose 9.0.0**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

## 🔧 Installation

1. Clone the repository:

```bash
git clone <your-backend-repo-url>
cd student-management-system-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file in the root directory:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/student-management
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
NODE_ENV=development
```

4. Start MongoDB (if using local):

```bash
mongod
```

5. Start the development server:

```bash
npm run dev
```

The server will run at `http://localhost:5001`

## 📦 Production Build

```bash
npm start
```

## 🌐 Environment Variables

| Variable      | Description               | Required | Default     |
| ------------- | ------------------------- | -------- | ----------- |
| `PORT`        | Server port               | No       | 5001        |
| `MONGODB_URI` | MongoDB connection string | Yes      | -           |
| `JWT_SECRET`  | Secret key for JWT        | Yes      | -           |
| `NODE_ENV`    | Environment mode          | No       | development |

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js  # Authentication logic
│   └── studentController.js # Student CRUD operations
├── middleware/
│   └── authMiddleware.js  # JWT verification
├── models/
│   ├── Admin.js           # Admin schema
│   └── Student.js         # Student schema
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   └── studentRoutes.js   # Student endpoints
├── .env                   # Environment variables
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies
└── server.js             # Entry point
```

## 🔌 API Endpoints

### Authentication

#### Admin Login

```http
POST /api/auth/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

#### Student Login

```http
POST /api/auth/student/login
Content-Type: application/json

{
  "regNo": "REG001",
  "password": "student123"
}
```

#### Student Registration

```http
POST /api/auth/student/register
Content-Type: application/json

{
  "name": "John Doe",
  "regNo": "REG001",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "gender": "Male",
  "department": "Computer Science"
}
```

### Students (Protected Routes)

#### Get All Students (with pagination & search)

```http
GET /api/students?page=1&limit=10&search=john
Authorization: Bearer <token>
```

#### Get Student by ID

```http
GET /api/students/:id
Authorization: Bearer <token>
```

#### Create Student (Admin only)

```http
POST /api/students
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "regNo": "REG002",
  "email": "jane@example.com",
  "password": "password123",
  "phone": "0987654321",
  "gender": "Female",
  "department": "Electrical Engineering",
  "subjects": []
}
```

#### Update Student

```http
PUT /api/students/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "janesmith@example.com",
  "phone": "1112223333",
  "gender": "Female"
}
```

#### Delete Student (Admin only)

```http
DELETE /api/students/:id
Authorization: Bearer <token>
```

#### Update Student Subjects

```http
PUT /api/students/:id/subjects
Authorization: Bearer <token>
Content-Type: application/json

{
  "subjects": [
    {
      "subjectName": "Mathematics",
      "mark": 85
    },
    {
      "subjectName": "Physics",
      "mark": 92
    }
  ]
}
```

## 📊 Data Models

### Student Schema

```javascript
{
  name: String (required),
  regNo: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String (required),
  gender: String (required),
  department: String (required),
  subjects: [{
    subjectName: String,
    mark: Number
  }],
  role: String (default: 'student'),
  createdAt: Date,
  updatedAt: Date
}
```

### Admin Schema

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (default: 'admin'),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication Flow

1. User sends credentials to login endpoint
2. Server validates credentials
3. If valid, server generates JWT token
4. Token sent back to client
5. Client includes token in Authorization header for protected routes
6. Server verifies token using middleware
7. Request proceeds if token is valid

## 🎯 Grade Calculation

Grades are automatically calculated based on marks:

| Grade | Marks Range |
| ----- | ----------- |
| S     | 90-100      |
| A+    | 85-89       |
| A     | 80-84       |
| B+    | 70-79       |
| B     | 60-69       |
| C     | 50-59       |
| D     | 40-49       |
| F     | Below 40    |

## 🚦 Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [...],
  "total": 50,
  "totalPages": 5,
  "currentPage": 1
}
```

## 🛡️ Security Features

- Password hashing using bcrypt (10 salt rounds)
- JWT token expiration (7 days)
- Input validation and sanitization
- Protected routes with authentication middleware
- Role-based access control (Admin/Student)
- CORS configuration for frontend integration

## 🔧 Available Scripts

| Command       | Description                           |
| ------------- | ------------------------------------- |
| `npm start`   | Start production server               |
| `npm run dev` | Start development server with nodemon |

## ⚙️ Dependencies

```json
{
  "express": "^5.1.0",
  "mongoose": "^9.0.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "cors": "^2.8.5",
  "dotenv": "^16.4.7"
}
```

## 🐛 Error Handling

The API includes comprehensive error handling:

- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500)

## 🧪 Testing

Test the API using tools like:

- Postman
- Thunder Client (VS Code extension)
- curl commands
- Frontend application

## 📝 Database Setup

### Create Admin User

You can create an admin user using MongoDB:

```javascript
// Connect to MongoDB and run:
db.admins.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "$2a$10$hashedPasswordHere",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

Or use the registration endpoint with admin role.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



---

