const mongoose = require('mongoose');

let mongod = null;

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

    console.log('No MONGO_URI provided or using fallback. Initializing embedded MongoMemoryServer...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log(`Embedded MongoDB Memory Server connected successfully at: ${uri}`);
  } catch (error) {
    console.warn(`Primary MongoDB connection failed: ${error.message}. Falling back to embedded MongoMemoryServer...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
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
