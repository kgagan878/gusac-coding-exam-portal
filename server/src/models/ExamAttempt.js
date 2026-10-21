const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    selectedOption: {
      type: String,
      default: null, // 'A', 'B', 'C', 'D' or null
    },
    isMarkedForReview: {
      type: Boolean,
      default: false,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
    score: {
      type: Number,
      default: 0,
    },
    code: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      default: 'java',
    },
    passedTests: {
      type: Number,
      default: 0,
    },
    totalTests: {
      type: Number,
      default: 0,
    },
    answeredAt: {
      type: Date,
      default: Date.now,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const examAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    duration: {
      type: Number,
      default: 40, // 40 minutes
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed'],
      default: 'in-progress',
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    mcqScore: {
      type: Number,
      default: 0,
    },
    codingScore: {
      type: Number,
      default: 0,
    },
    maxScore: {
      type: Number,
      default: 150,
    },
    correctCount: {
      type: Number,
      default: 0,
    },
    incorrectCount: {
      type: Number,
      default: 0,
    },
    unansweredCount: {
      type: Number,
      default: 0,
    },
    timeTaken: {
      type: String,
      default: '00:00',
    },
    answers: [answerSchema],
  },
  {
    timestamps: true,
  }
);

examAttemptSchema.index({ userId: 1, status: 1 });
examAttemptSchema.index({ totalScore: -1, updatedAt: 1 });

module.exports = mongoose.model('ExamAttempt', examAttemptSchema);
