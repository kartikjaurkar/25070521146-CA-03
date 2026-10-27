const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('\nMongoDB connection error: MONGODB_URI is missing from server/.env');
    console.error('Copy server/.env.example to server/.env and set your connection string.\n');
    process.exit(1);
  }

  try {
    const connection = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`MongoDB connected: ${connection.connection.host}/${connection.connection.name}`);
  } catch (error) {
    console.error('\nMongoDB connection failed.');
    console.error(`Reason: ${error.message}`);
    console.error('Check that the MongoDB Community Server service is running.');
    console.error('Windows PowerShell: Get-Service -Name MongoDB');
    console.error('Default local URI: mongodb://127.0.0.1:27017/cinebook\n');
    process.exit(1);
  }
};

module.exports = connectDB;
