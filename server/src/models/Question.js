const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true, // 'A', 'B', 'C', 'D'
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const testCaseSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      default: '',
    },
    expectedOutput: {
      type: String,
      default: '',
    },
    explanation: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      default: 'Java Output Prediction',
      trim: true,
    },
    description: {
      type: String,
      default: 'What will be the output of the following Java program?',
    },
    codeSnippet: {
      type: String,
      default: '',
    },
    options: [optionSchema],
    correctOption: {
      type: String,
      trim: true,
      // 'A', 'B', 'C', 'D'
    },
    explanation: {
      type: String,
      default: '',
    },
    inputFormat: {
      type: String,
      default: 'None',
    },
    outputFormat: {
      type: String,
      default: 'Select one of the four options (A, B, C, D)',
    },
    constraints: {
      type: String,
      default: 'Standard Java SE 17+ environment',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    marks: {
      type: Number,
      default: 1,
    },
    order: {
      type: Number,
      default: 1,
    },
    sampleTestCases: [testCaseSchema],
    hiddenTestCases: [testCaseSchema],
    supportedLanguages: {
      type: [String],
      default: ['java'],
    },
    starterCode: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Question', questionSchema);
