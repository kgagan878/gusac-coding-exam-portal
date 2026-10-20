const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'gusac_exam_secret_jwt_key_2026_super_secure';
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    secret,
    { expiresIn: '12h' }
  );
};

// Student Login / Registration
const loginStudent = async (req, res) => {
  try {
    const { name, email, studentId } = req.body;

    if (!name || !email || !studentId) {
      return res.status(400).json({ message: 'Name, email, and student ID are required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedStudentId = studentId.trim();
    const trimmedName = name.trim();

    let user = await User.findOne({ email: trimmedEmail });

    if (user) {
      // Update name/studentId if changed
      user.name = trimmedName;
      user.studentId = trimmedStudentId;
      await user.save();
    } else {
      user = await User.create({
        name: trimmedName,
        email: trimmedEmail,
        studentId: trimmedStudentId,
        role: 'student',
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Student login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Student login error:', error);
    return res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase(), role: 'admin' });
    if (!user) {
      return res.status(401).json({ message: 'Invalid admin credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials.' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Admin login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ message: 'Server error during admin login', error: error.message });
  }
};

// Current User Profile
const getMe = async (req, res) => {
  return res.status(200).json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      studentId: req.user.studentId,
      role: req.user.role,
    },
  });
};

module.exports = {
  loginStudent,
  loginAdmin,
  getMe,
};
