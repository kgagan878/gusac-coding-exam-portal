const mongoose = require('mongoose');

let mongod = null;

const fs = require('fs');
const path = require('path');

const getOptimalMongoDbPath = () => {
  if (process.env.MONGO_TMP_DIR) {
    if (!fs.existsSync(process.env.MONGO_TMP_DIR)) {
      try {
        fs.mkdirSync(process.env.MONGO_TMP_DIR, { recursive: true });
      } catch (e) {}
    }
    return process.env.MONGO_TMP_DIR;
  }

  if (process.platform === 'win32' && fs.existsSync('D:\\')) {
    const dPath = 'D:\\.gusac_mongodb_data';
    if (!fs.existsSync(dPath)) {
      try {
        fs.mkdirSync(dPath, { recursive: true });
      } catch (e) {}
    }
    if (fs.existsSync(dPath)) {
      return dPath;
    }
  }

  return undefined;
};

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (mongoUri && mongoUri.trim() !== '') {
      console.log(`Connecting to MongoDB at: ${mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('MongoDB connected successfully.');
      return;
    }

    console.log('No MONGO_URI provided. Initializing embedded MongoMemoryServer...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const optimalDbPath = getOptimalMongoDbPath();
    const serverOptions = optimalDbPath ? { instance: { dbPath: optimalDbPath } } : {};

    mongod = await MongoMemoryServer.create(serverOptions);
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log(`Embedded MongoDB Memory Server connected successfully at: ${uri}`);
  } catch (error) {
    console.warn(`Primary MongoDB connection failed: ${error.message}. Retrying embedded MongoMemoryServer with fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const optimalDbPath = getOptimalMongoDbPath();
      const serverOptions = optimalDbPath ? { instance: { dbPath: optimalDbPath } } : {};

      mongod = await MongoMemoryServer.create(serverOptions);
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log(`Fallback MongoMemoryServer connected successfully at: ${uri}`);
    } catch (fallbackError) {
      console.error('Fatal MongoDB connection error:', fallbackError);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
    console.log('MongoDB disconnected.');
  } catch (error) {
    console.error('Error disconnecting MongoDB:', error);
  }
};

module.exports = { connectDB, disconnectDB };
