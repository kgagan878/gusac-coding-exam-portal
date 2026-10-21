const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Question = require('../models/Question');
const ExamAttempt = require('../models/ExamAttempt');
const Setting = require('../models/Setting');
const { javaQuestions } = require('./javaQuestions');

const autoSeedIfEmpty = async () => {
  try {
    const questionCount = await Question.countDocuments({});

    // If already seeded with 12 questions (10 MCQs + 2 Coding), verify settings and return
    if (questionCount === 12) {
      await Setting.getConfig();
      console.log(`Database is already populated with 12 CODE VERSE with Java questions (150 Points).`);
      return;
    }

    console.log(`🌱 Detected ${questionCount} questions. Re-seeding official 12-question CODE VERSE exam (150 Points)...`);
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

    // 3. Insert 12 Java Questions
    const createdQuestions = await Question.insertMany(javaQuestions);
    console.log(`✅ Auto-seed: ${createdQuestions.length} Questions seeded (10 MCQs + 2 Coding).`);

    // 4. Create Sample Leaderboard if empty
    const attemptCount = await ExamAttempt.countDocuments({});
    if (attemptCount === 0) {
      const participants = [
        { name: 'Rahul Sharma', email: 'rahul.s@gitam.in', studentId: 'GITAM202401', mcqScore: 50, codingScore: 90, totalScore: 140, timeTaken: '22:15', correct: 10, incorrect: 0, unanswered: 0 },
        { name: 'Ananya Verma', email: 'ananya.v@gitam.in', studentId: 'GITAM202402', mcqScore: 45, codingScore: 80, totalScore: 125, timeTaken: '24:30', correct: 9, incorrect: 1, unanswered: 0 },
        { name: 'Kiran Kumar', email: 'kiran.k@gitam.in', studentId: 'GITAM202403', mcqScore: 40, codingScore: 70, totalScore: 110, timeTaken: '27:45', correct: 8, incorrect: 2, unanswered: 0 },
        { name: 'Siddharth Rao', email: 'siddharth.r@gitam.in', studentId: 'GITAM202404', mcqScore: 45, codingScore: 50, totalScore: 95, timeTaken: '31:20', correct: 9, incorrect: 1, unanswered: 0 },
        { name: 'Pooja Reddy', email: 'pooja.r@gitam.in', studentId: 'GITAM202405', mcqScore: 35, codingScore: 40, totalScore: 75, timeTaken: '34:10', correct: 7, incorrect: 3, unanswered: 0 },
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
          if (q.section === 'A') {
            const isCorrect = idx < p.correct;
            return {
              questionId: q._id,
              selectedOption: isCorrect ? q.correctOption : (q.correctOption === 'A' ? 'B' : 'A'),
              isMarkedForReview: false,
              isCorrect,
              score: isCorrect ? 5 : 0,
              answeredAt: new Date(startTime.getTime() + (idx + 1) * 60 * 1000),
              submittedAt: endTime,
            };
          } else {
            const qScore = idx === 10 ? Math.round(p.codingScore / 2) : (p.codingScore - Math.round(p.codingScore / 2));
            const passedTests = Math.round((qScore / 50) * 5);
            return {
              questionId: q._id,
              code: q.starterCode?.java || '',
              language: 'java',
              score: qScore,
              passedTests,
              totalTests: 5,
              answeredAt: new Date(startTime.getTime() + (idx + 1) * 60 * 1000),
              submittedAt: endTime,
            };
          }
        });

        await ExamAttempt.create({
          userId: user._id,
          startTime,
          endTime,
          duration: 40,
          status: 'completed',
          mcqScore: p.mcqScore,
          codingScore: p.codingScore,
          totalScore: p.totalScore,
          maxScore: 150,
          correctCount: p.correct,
          incorrectCount: p.incorrect,
          unansweredCount: p.unanswered,
          timeTaken: p.timeTaken,
          answers,
        });
      }
      console.log('✅ Auto-seed: Initial leaderboard records seeded (out of 150).');
    }
  } catch (error) {
    console.error('Auto-seed check warning:', error.message);
  }
};

module.exports = { autoSeedIfEmpty };
