import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

import connectDB from '../config/db.js';
import AdminUser from '../models/AdminUser.js';

dotenv.config();

const seedAdminUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    }

    await connectDB();

    const existingAdmin = await AdminUser.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`Admin already exists for email: ${adminEmail}`);
      return;
    }

    const passwordHash = await bcrypt.hash(adminPassword, 12);

    await AdminUser.create({
      email: adminEmail,
      passwordHash,
    });

    console.log(`Admin user created for email: ${adminEmail}`);
  } catch (error) {
    console.error('Failed to seed admin user:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

seedAdminUser();
