const mongoose = require('mongoose');
const Question = require('../models/Question');
const ExamAttempt = require('../models/ExamAttempt');
const Setting = require('../models/Setting');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gusac_exam';

async function runVerification() {
  console.log('Connecting to MongoDB for verification...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB.\n');

  let passedAll = true;

  // 1. Verify Questions & Scoring
  const questions = await Question.find({}).sort({ order: 1 });
  console.log(`[Check 1] Total Questions in DB: ${questions.length}`);
  if (questions.length !== 22) {
    console.error(`❌ Expected exactly 22 questions, found ${questions.length}`);
    passedAll = false;
  } else {
    console.log('✅ Exactly 22 questions present.');
  }

  const secA = questions.filter(q => q.section === 'A');
  const secB = questions.filter(q => q.section === 'B');
  console.log(`[Check 2] Section A questions: ${secA.length}, Section B questions: ${secB.length}`);

  if (secA.length !== 20) {
    console.error(`❌ Expected 20 Section A MCQs, found ${secA.length}`);
    passedAll = false;
  }
  if (secB.length !== 2) {
    console.error(`❌ Expected 2 Section B Coding problems, found ${secB.length}`);
    passedAll = false;
  }

  let secAPoints = 0;
  secA.forEach((q, i) => {
    secAPoints += q.marks;
    if (q.marks !== 5) {
      console.error(`❌ Section A Q${i + 1} has ${q.marks} marks instead of 5`);
      passedAll = false;
    }
  });

  let secBPoints = 0;
  secB.forEach((q, i) => {
    secBPoints += q.marks;
    if (q.marks !== 25) {
      console.error(`❌ Section B Q${i + 1} has ${q.marks} marks instead of 25`);
      passedAll = false;
    }
  });

  const totalPoints = secAPoints + secBPoints;
  console.log(`[Check 3] Section A Points: ${secAPoints} / 100 (20 MCQs x 5 pts)`);
  console.log(`[Check 4] Section B Points: ${secBPoints} / 50 (2 Coding x 25 pts)`);
  console.log(`[Check 5] Grand Total Points: ${totalPoints} / 150`);

  if (totalPoints !== 150) {
    console.error(`❌ Total points is ${totalPoints}, expected 150!`);
    passedAll = false;
  } else {
    console.log('✅ Total scoring strictly equals 150 points.');
  }

  // 2. Verify Sample Attempts and Leaderboard
  const attempts = await ExamAttempt.find({ status: 'completed' });
  console.log(`\n[Check 6] Completed Exam Attempts: ${attempts.length}`);
  attempts.forEach((att, idx) => {
    if (att.maxScore !== 150) {
      console.error(`❌ Attempt #${idx + 1} maxScore is ${att.maxScore}, expected 150`);
      passedAll = false;
    }
    if (att.mcqScore > 100 || att.codingScore > 50) {
      console.error(`❌ Attempt #${idx + 1} scores out of bounds: MCQ=${att.mcqScore}/100, Coding=${att.codingScore}/50`);
      passedAll = false;
    }
    if (att.totalScore !== (att.mcqScore + att.codingScore)) {
      console.error(`❌ Attempt #${idx + 1} totalScore (${att.totalScore}) != mcqScore (${att.mcqScore}) + codingScore (${att.codingScore})`);
      passedAll = false;
    }
  });
  console.log('✅ All completed attempts verified with maxScore: 150, mcqScore <= 100, codingScore <= 50.');

  // 3. Verify Admin Account
  const admin = await User.findOne({ email: 'admin@gusac.org', role: 'admin' });
  if (!admin) {
    console.error('❌ Admin account not found.');
    passedAll = false;
  } else {
    console.log('✅ Admin account admin@gusac.org exists and configured.');
  }

  // 4. Verify Event Settings
  const settings = await Setting.getConfig();
  console.log(`[Check 7] Event Duration: ${settings.durationMinutes} minutes`);
  console.log(`[Check 8] Explanations Enabled: ${settings.showExplanations}`);

  await mongoose.disconnect();

  if (passedAll) {
    console.log('\n=============================================');
    console.log('🎉 ALL SYSTEM & SCORING VERIFICATIONS PASSED!');
    console.log('=============================================');
    process.exit(0);
  } else {
    console.error('\n❌ SOME VERIFICATIONS FAILED.');
    process.exit(1);
  }
}

runVerification().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
