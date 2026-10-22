const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Question = require('../models/Question');
const ExamAttempt = require('../models/ExamAttempt');
const Setting = require('../models/Setting');
const { javaQuestions } = require('./javaQuestions');

const autoSeedIfEmpty = async () => {
  try {
    const questionCount = await Question.countDocuments({});

    // If already seeded with 22 questions (20 MCQs + 2 Coding), verify settings and return
    if (questionCount === 22) {
      await Setting.getConfig();
      console.log(`Database is already populated with 22 CODE VERSE with Java questions (150 Points).`);
      return;
    }

    console.log(`🌱 Detected ${questionCount} questions. Re-seeding official 22-question CODE VERSE exam (150 Points)...`);
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
      const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPass, salt);
      await User.create({
        name: 'GUSAC Administrator',
        email: 'admin@gusac.org',
        studentId: 'ADMIN-01',
        role: 'admin',
        password: hashedPassword,
      });
      console.log('✅ Auto-seed: Admin account configured (admin@gusac.org)');
    }

    // 3. Insert 22 Java Questions
    const createdQuestions = await Question.insertMany(javaQuestions);
    console.log(`✅ Auto-seed: ${createdQuestions.length} Questions seeded (20 MCQs + 2 Coding).`);

    // 4. Create Sample Leaderboard if empty
    const attemptCount = await ExamAttempt.countDocuments({});
    if (attemptCount === 0) {
      const participants = [
        { name: 'Rahul Sharma', email: 'rahul.s@gitam.in', studentId: 'GITAM202401', mcqScore: 90, codingScore: 45, totalScore: 135, timeTaken: '22:15', correct: 18, incorrect: 2, unanswered: 0 },
        { name: 'Ananya Verma', email: 'ananya.v@gitam.in', studentId: 'GITAM202402', mcqScore: 85, codingScore: 40, totalScore: 125, timeTaken: '24:30', correct: 17, incorrect: 3, unanswered: 0 },
        { name: 'Kiran Kumar', email: 'kiran.k@gitam.in', studentId: 'GITAM202403', mcqScore: 80, codingScore: 35, totalScore: 115, timeTaken: '27:45', correct: 16, incorrect: 4, unanswered: 0 },
        { name: 'Siddharth Rao', email: 'siddharth.r@gitam.in', studentId: 'GITAM202404', mcqScore: 70, codingScore: 25, totalScore: 95, timeTaken: '31:20', correct: 14, incorrect: 6, unanswered: 0 },
        { name: 'Pooja Reddy', email: 'pooja.r@gitam.in', studentId: 'GITAM202405', mcqScore: 60, codingScore: 20, totalScore: 80, timeTaken: '34:10', correct: 12, incorrect: 8, unanswered: 0 },
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
            const qScore = idx === 20 ? Math.round(p.codingScore / 2) : (p.codingScore - Math.round(p.codingScore / 2));
            const passedTests = Math.round((qScore / 25) * 5);
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
