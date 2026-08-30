import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Rights from '../models/Rights.js';
import Lawyer from '../models/Lawyer.js';
import { initialRightsData, initialLawyersData } from './seedData.js';

dotenv.config();

const seed = async () => {
  console.log('[Seed] Initializing legal database seed script...');
  const connected = await connectDB();

  if (!connected) {
    console.log('[Seed] MongoDB not running locally. Local in-memory fallback will serve this data automatically.');
    process.exit(0);
  }

  try {
    await Rights.deleteMany({});
    await Lawyer.deleteMany({});

    await Rights.insertMany(initialRightsData);
    await Lawyer.insertMany(initialLawyersData);

    console.log('[Seed] Successfully seeded Citizen Rights and Lawyers Directory database!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seed();
