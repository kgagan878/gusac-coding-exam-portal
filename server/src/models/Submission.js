const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    attemptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExamAttempt',
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    passedTests: {
      type: Number,
      default: 0,
    },
    totalTests: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
    },
    executionTime: {
      type: Number,
      default: 0, // in seconds
    },
    status: {
      type: String,
      enum: ['Accepted', 'Passed', 'Partial', 'Failed', 'Wrong Answer', 'Time Limit Exceeded', 'Compilation Error', 'Runtime Error', 'Internal Error'],
      default: 'Wrong Answer',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

submissionSchema.index({ userId: 1, questionId: 1, attemptId: 1 });
submissionSchema.index({ attemptId: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
