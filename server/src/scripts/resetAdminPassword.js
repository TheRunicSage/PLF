import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

import connectDB from '../config/db.js';
import AdminUser from '../models/AdminUser.js';

dotenv.config();

const resetAdminPassword = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    }

    await connectDB();

    const existingAdmin = await AdminUser.findOne({ email: adminEmail });

    if (!existingAdmin) {
      throw new Error(
        `Admin not found for email: ${adminEmail}. Run "node src/scripts/seedAdminUser.js" first.`
      );
    }

    const passwordHash = await bcrypt.hash(adminPassword, 12);
    existingAdmin.passwordHash = passwordHash;
    await existingAdmin.save();

    console.log(`Admin password reset for email: ${adminEmail}`);
  } catch (error) {
    console.error('Failed to reset admin password:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

resetAdminPassword();
