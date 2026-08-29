import dns from 'node:dns';
import mongoose from 'mongoose';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (error) {
  console.warn('DNS override skipped:', error.message);
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    throw new Error('Missing MONGODB_URI in backend/.env. Set your Atlas connection string before starting the backend.');
  }

  if (!/^mongodb(?:\+srv)?:\/\//i.test(uri)) {
    throw new Error('MONGODB_URI must start with mongodb:// or mongodb+srv://');
  }

  const options = {
    family: 4,
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    socketTimeoutMS: 60000,
    maxPoolSize: 10,
    minPoolSize: 2,
    retryWrites: true,
    retryReads: true,
  };

  let retryCount = 0;
  const maxRetries = 4;

  while (retryCount < maxRetries) {
    try {
      await mongoose.connect(uri, options);
      console.log('MongoDB connected successfully');
      return;
    } catch (error) {
      retryCount += 1;
      console.error(`MongoDB connection attempt ${retryCount}/${maxRetries} failed`);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);

      if (retryCount < maxRetries) {
        const delay = Math.min(retryCount * 2000, 5000);
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      console.error('\n⚠️  MongoDB connection could not be established.');
      console.error('Possible causes:');
      console.error('1. The current IP is not whitelisted in MongoDB Atlas Network Access');
      console.error('2. The MONGODB_URI value is expired, incorrect, or missing credentials');
      console.error('3. Network, firewall, or DNS restrictions are blocking Atlas access');
      console.error('4. The connection is being refused while Atlas is unavailable');
      throw error;
    }
  }
}