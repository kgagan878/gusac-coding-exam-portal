const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    studentId: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    password: {
      type: String,
      // Only required for admin role
      required: function () {
        return this.role === 'admin';
      },
    },
  },
  {
    timestamps: true,
  }
);

// Helpful index
userSchema.index({ studentId: 1 });

module.exports = mongoose.model('User', userSchema);
