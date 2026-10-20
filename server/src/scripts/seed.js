require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Question = require('../models/Question');
const ExamAttempt = require('../models/ExamAttempt');
const Submission = require('../models/Submission');
const Setting = require('../models/Setting');
const { javaQuestions } = require('../config/javaQuestions');

const seedData = async () => {
  try {
    await connectDB();
    console.log('🌱 Clearing existing collections for fresh 20-question Java exam seed...');
    await User.deleteMany({});
    await Question.deleteMany({});
    await ExamAttempt.deleteMany({});
    await Submission.deleteMany({});
    await Setting.deleteMany({});

    // 1. Create Default Exam Setting
    console.log('⚙️ Initializing Exam Settings (40-min duration, explanations enabled)...');
    await Setting.create({
      key: 'exam_config',
      durationMinutes: 40,
      showExplanations: true,
    });

    // 2. Create Admin Account
    console.log('🔑 Creating Admin Account...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = await User.create({
      name: 'GUSAC Administrator',
      email: 'admin@gusac.org',
      studentId: 'ADMIN-01',
      role: 'admin',
      password: hashedPassword,
    });
    console.log(`✅ Admin created: ${admin.email} (Password: admin123)`);

    // 3. Seed 20 Java Questions
    console.log('📝 Seeding 20 Java Output Prediction Questions...');
    const createdQuestions = await Question.insertMany(javaQuestions);
    console.log(`✅ ${createdQuestions.length} Java Questions seeded successfully.`);

    // 4. Create Sample Participants for Initial Leaderboard
    console.log('🏆 Seeding Sample Leaderboard Participants...');
    const participants = [
      {
        name: 'Rahul Sharma',
        email: 'rahul.s@gitam.in',
        studentId: 'GITAM202401',
        score: 19,
        correctCount: 19,
        incorrectCount: 1,
        unansweredCount: 0,
        timeTaken: '18:21',
      },
      {
        name: 'Ananya Verma',
        email: 'ananya.v@gitam.in',
        studentId: 'GITAM202402',
        score: 18,
        correctCount: 18,
        incorrectCount: 2,
        unansweredCount: 0,
        timeTaken: '21:14',
      },
      {
        name: 'Kiran Kumar',
        email: 'kiran.k@gitam.in',
        studentId: 'GITAM202403',
        score: 16,
        correctCount: 16,
        incorrectCount: 3,
        unansweredCount: 1,
        timeTaken: '24:35',
      },
      {
        name: 'Siddharth Rao',
        email: 'siddharth.r@gitam.in',
        studentId: 'GITAM202404',
        score: 15,
        correctCount: 15,
        incorrectCount: 5,
        unansweredCount: 0,
        timeTaken: '28:10',
      },
      {
        name: 'Pooja Reddy',
        email: 'pooja.r@gitam.in',
        studentId: 'GITAM202405',
        score: 14,
        correctCount: 14,
        incorrectCount: 4,
        unansweredCount: 2,
        timeTaken: '31:45',
      },
    ];

    for (const p of participants) {
      const user = await User.create({
        name: p.name,
        email: p.email,
        studentId: p.studentId,
        role: 'student',
      });

      const now = new Date();
      const startTime = new Date(now.getTime() - 40 * 60 * 1000);
      const endTime = new Date(startTime.getTime() + 22 * 60 * 1000);

      // Generate answers array
      const answers = createdQuestions.map((q, idx) => {
        let isCorrect = true;
        let selected = q.correctOption;

        // Simulate a few wrong or unanswered for realistic distribution
        if (p.score === 19 && idx === 15) {
          isCorrect = false;
          selected = q.correctOption === 'A' ? 'B' : 'A';
        } else if (p.score === 18 && (idx === 9 || idx === 17)) {
          isCorrect = false;
          selected = q.correctOption === 'A' ? 'C' : 'A';
        } else if (p.score === 16) {
          if (idx === 19) {
            selected = null;
            isCorrect = false;
          } else if (idx === 8 || idx === 14 || idx === 18) {
            isCorrect = false;
            selected = q.correctOption === 'B' ? 'C' : 'B';
          }
        } else if (p.score === 15 && idx >= 15) {
          isCorrect = false;
          selected = q.correctOption === 'C' ? 'D' : 'C';
        } else if (p.score === 14) {
          if (idx >= 18) {
            selected = null;
            isCorrect = false;
          } else if (idx % 4 === 0) {
            isCorrect = false;
            selected = 'D';
          }
        }

        return {
          questionId: q._id,
          selectedOption: selected,
          isMarkedForReview: idx % 6 === 0,
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
        correctCount: p.correctCount,
        incorrectCount: p.incorrectCount,
        unansweredCount: p.unansweredCount,
        timeTaken: p.timeTaken,
        answers,
      });
    }

    console.log('✅ Sample participants and leaderboard records seeded successfully.');
    console.log('\n======================================================');
    console.log('🎉 20-QUESTION JAVA EXAM DATABASE SEEDING COMPLETED');
    console.log('======================================================');
    console.log('Exam Configuration:');
    console.log('- Language: Java only');
    console.log('- Questions: 20 Multiple-Choice Snippets');
    console.log('- Duration: 40 Minutes');
    console.log('- Max Score: 20 Marks (1 mark/question)');
    console.log('\nAdmin Credentials:');
    console.log('Email: admin@gusac.org');
    console.log('Password: admin123');
    console.log('======================================================\n');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
