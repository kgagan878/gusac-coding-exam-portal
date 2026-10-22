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
    console.log('🌱 Clearing existing collections for fresh CODE VERSE with Java seed...');
    await User.deleteMany({});
    await Question.deleteMany({});
    await ExamAttempt.deleteMany({});
    await Submission.deleteMany({});
    await Setting.deleteMany({});

    // 1. Create Default Exam Setting
    console.log('⚙️ Initializing Event Settings (40-min duration, explanations enabled)...');
    await Setting.create({
      key: 'exam_config',
      durationMinutes: 40,
      showExplanations: true,
    });

    // 2. Create Admin Account (Securely using environment variable)
    console.log('🔑 Creating Admin Account...');
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const admin = await User.create({
      name: 'GUSAC Administrator',
      email: 'admin@gusac.org',
      studentId: 'ADMIN-01',
      role: 'admin',
      password: hashedPassword,
    });
    console.log(`✅ Admin created: ${admin.email}`);

    // 3. Seed Questions (20 MCQs x 5 pts + 2 Coding x 25 pts = 150 Points Total)
    console.log('📝 Seeding CODE VERSE with Java Question Bank (150 Points Total)...');
    const createdQuestions = await Question.insertMany(javaQuestions);
    console.log(`✅ ${createdQuestions.length} Questions seeded successfully (20 MCQs + 2 Coding).`);

    // 4. Create Sample Participants for Initial Leaderboard (out of 150)
    console.log('🏆 Seeding Sample Leaderboard Participants...');
    const participants = [
      {
        name: 'Rahul Sharma',
        email: 'rahul.s@gitam.in',
        studentId: 'GITAM202401',
        mcqScore: 90,
        codingScore: 45,
        totalScore: 135,
        correctCount: 18,
        incorrectCount: 2,
        unansweredCount: 0,
        timeTaken: '22:15',
      },
      {
        name: 'Ananya Verma',
        email: 'ananya.v@gitam.in',
        studentId: 'GITAM202402',
        mcqScore: 85,
        codingScore: 40,
        totalScore: 125,
        correctCount: 17,
        incorrectCount: 3,
        unansweredCount: 0,
        timeTaken: '24:30',
      },
      {
        name: 'Kiran Kumar',
        email: 'kiran.k@gitam.in',
        studentId: 'GITAM202403',
        mcqScore: 80,
        codingScore: 35,
        totalScore: 115,
        correctCount: 16,
        incorrectCount: 4,
        unansweredCount: 0,
        timeTaken: '27:45',
      },
      {
        name: 'Siddharth Rao',
        email: 'siddharth.r@gitam.in',
        studentId: 'GITAM202404',
        mcqScore: 70,
        codingScore: 25,
        totalScore: 95,
        correctCount: 14,
        incorrectCount: 6,
        unansweredCount: 0,
        timeTaken: '31:20',
      },
      {
        name: 'Pooja Reddy',
        email: 'pooja.r@gitam.in',
        studentId: 'GITAM202405',
        mcqScore: 60,
        codingScore: 20,
        totalScore: 80,
        correctCount: 12,
        incorrectCount: 8,
        unansweredCount: 0,
        timeTaken: '34:10',
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
      const endTime = new Date(startTime.getTime() + 25 * 60 * 1000);

      // Generate answers array
      const answers = createdQuestions.map((q, idx) => {
        if (q.section === 'A') {
          // MCQ
          const isCorrect = idx < p.correctCount;
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
          // Coding question (idx 20 and 21)
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
        correctCount: p.correctCount,
        incorrectCount: p.incorrectCount,
        unansweredCount: p.unansweredCount,
        timeTaken: p.timeTaken,
        answers,
      });
    }

    console.log('✅ Sample participants and leaderboard records seeded successfully.');
    console.log('\n======================================================');
    console.log('🎉 CODE VERSE WITH JAVA DATABASE SEEDING COMPLETED');
    console.log('======================================================');
    console.log('Event Configuration:');
    console.log('- Language: Java only');
    console.log('- Total Questions: 22 Questions');
    console.log('- Section A: 20 MCQs x 5 pts = 100 pts');
    console.log('- Section B: 2 Coding x 25 pts = 50 pts');
    console.log('- Grand Total: 150 Points');
    console.log('- Duration: 40 Minutes');
    console.log('======================================================\n');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
