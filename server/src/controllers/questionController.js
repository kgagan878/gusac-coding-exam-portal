const Question = require('../models/Question');

// Get all questions (excl correctOption, explanation, hiddenTestCases for student security)
const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({})
      .select('-correctOption -explanation -hiddenTestCases')
      .sort({ order: 1, createdAt: 1 });

    return res.status(200).json({ questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return res.status(500).json({ message: 'Failed to fetch questions', error: error.message });
  }
};

// Get single question by ID (excl correctOption, explanation, hiddenTestCases)
const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id).select('-correctOption -explanation -hiddenTestCases');

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    return res.status(200).json({ question });
  } catch (error) {
    console.error('Error fetching question:', error);
    return res.status(500).json({ message: 'Failed to fetch question', error: error.message });
  }
};

module.exports = {
  getQuestions,
  getQuestionById,
};
