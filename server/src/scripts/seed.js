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

    // 3. Seed Questions (10 MCQs + 2 Coding = 150 Points)
    console.log('📝 Seeding CODE VERSE with Java Question Bank (150 Points Total)...');
    const createdQuestions = await Question.insertMany(javaQuestions);
    console.log(`✅ ${createdQuestions.length} Questions seeded successfully (10 MCQs + 2 Coding).`);

    // 4. Create Sample Participants for Initial Leaderboard (out of 150)
    console.log('🏆 Seeding Sample Leaderboard Participants...');
    const participants = [
      {
        name: 'Rahul Sharma',
        email: 'rahul.s@gitam.in',
        studentId: 'GITAM202401',
        mcqScore: 50,
        codingScore: 90,
        totalScore: 140,
        correctCount: 10,
        incorrectCount: 0,
        unansweredCount: 0,
        timeTaken: '22:15',
      },
      {
        name: 'Ananya Verma',
        email: 'ananya.v@gitam.in',
        studentId: 'GITAM202402',
        mcqScore: 45,
        codingScore: 80,
        totalScore: 125,
        correctCount: 9,
        incorrectCount: 1,
        unansweredCount: 0,
        timeTaken: '24:30',
      },
      {
        name: 'Kiran Kumar',
        email: 'kiran.k@gitam.in',
        studentId: 'GITAM202403',
        mcqScore: 40,
        codingScore: 70,
        totalScore: 110,
        correctCount: 8,
        incorrectCount: 2,
        unansweredCount: 0,
        timeTaken: '27:45',
      },
      {
        name: 'Siddharth Rao',
        email: 'siddharth.r@gitam.in',
        studentId: 'GITAM202404',
        mcqScore: 45,
        codingScore: 50,
        totalScore: 95,
        correctCount: 9,
        incorrectCount: 1,
        unansweredCount: 0,
        timeTaken: '31:20',
      },
      {
        name: 'Pooja Reddy',
        email: 'pooja.r@gitam.in',
        studentId: 'GITAM202405',
        mcqScore: 35,
        codingScore: 40,
        totalScore: 75,
        correctCount: 7,
        incorrectCount: 3,
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
          // Coding question
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
    console.log('- Section A: 10 MCQs x 5 pts = 50 pts');
    console.log('- Section B: 2 Coding x 50 pts = 100 pts');
    console.log('- Grand Total: 150 Points');
    console.log('- Duration: 40 Minutes');
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
