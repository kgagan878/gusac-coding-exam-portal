const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Question = require('../models/Question');
const ExamAttempt = require('../models/ExamAttempt');
const Setting = require('../models/Setting');
const { javaQuestions } = require('./javaQuestions');

const autoSeedIfEmpty = async () => {
  try {
    const questionCount = await Question.countDocuments({});

    // If already seeded with 20 questions, verify settings and return
    if (questionCount === 20) {
      await Setting.getConfig();
      console.log(`Database is already populated with 20 Java exam questions.`);
      return;
    }

    console.log(`🌱 Detected ${questionCount} questions. Re-seeding official 20-question Java exam...`);
    await Question.deleteMany({});

    // 1. Ensure Setting exists
    await Setting.deleteMany({});
    await Setting.create({
      key: 'exam_config',
      durationMinutes: 40,
      showExplanations: true,
    });

    // 2. Ensure Admin exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      await User.create({
        name: 'GUSAC Administrator',
        email: 'admin@gusac.org',
        studentId: 'ADMIN-01',
        role: 'admin',
        password: hashedPassword,
      });
      console.log('✅ Auto-seed: Admin account created (admin@gusac.org)');
    }

    // 3. Insert 20 Java Questions
    const createdQuestions = await Question.insertMany(javaQuestions);
    console.log(`✅ Auto-seed: ${createdQuestions.length} Java Questions seeded.`);

    // 4. Create Sample Leaderboard if empty
    const attemptCount = await ExamAttempt.countDocuments({});
    if (attemptCount === 0) {
      const participants = [
        { name: 'Rahul Sharma', email: 'rahul.s@gitam.in', studentId: 'GITAM202401', score: 19, timeTaken: '18:21', correct: 19, incorrect: 1, unanswered: 0 },
        { name: 'Ananya Verma', email: 'ananya.v@gitam.in', studentId: 'GITAM202402', score: 18, timeTaken: '21:14', correct: 18, incorrect: 2, unanswered: 0 },
        { name: 'Kiran Kumar', email: 'kiran.k@gitam.in', studentId: 'GITAM202403', score: 16, timeTaken: '24:35', correct: 16, incorrect: 3, unanswered: 1 },
        { name: 'Siddharth Rao', email: 'siddharth.r@gitam.in', studentId: 'GITAM202404', score: 15, timeTaken: '28:10', correct: 15, incorrect: 5, unanswered: 0 },
        { name: 'Pooja Reddy', email: 'pooja.r@gitam.in', studentId: 'GITAM202405', score: 14, timeTaken: '31:45', correct: 14, incorrect: 4, unanswered: 2 },
      ];

      for (const p of participants) {
        let user = await User.findOne({ email: p.email });
        if (!user) {
          user = await User.create({
            name: p.name,
            email: p.email,
            studentId: p.studentId,
            role: 'student',
          });
        }

        const now = new Date();
        const startTime = new Date(now.getTime() - 40 * 60 * 1000);
        const endTime = new Date(startTime.getTime() + 25 * 60 * 1000);

        const answers = createdQuestions.map((q, idx) => {
          const isCorrect = idx < p.score;
          const selected = isCorrect ? q.correctOption : (q.correctOption === 'A' ? 'B' : 'A');
          return {
            questionId: q._id,
            selectedOption: selected,
            isMarkedForReview: idx % 5 === 0,
            isCorrect,
            score: isCorrect ? 1 : 0,
            answeredAt: new Date(startTime.getTime() + (idx + 1) * 60 * 1000),
            submittedAt: endTime,
          };
        });

        await ExamAttempt.create({
          userId: user._id,
          startTime,
          endTime,
          duration: 40,
          status: 'completed',
          totalScore: p.score,
          correctCount: p.correct,
          incorrectCount: p.incorrect,
          unansweredCount: p.unanswered,
          timeTaken: p.timeTaken,
          answers,
        });
      }
      console.log('✅ Auto-seed: Initial leaderboard records seeded.');
    }
  } catch (error) {
    console.error('Auto-seed error:', error);
  }
};

module.exports = { autoSeedIfEmpty };
