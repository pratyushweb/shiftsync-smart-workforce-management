import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/User.js';
import Business from '../models/Business.js';

const MANAGER_EMAIL = 'pratyushkumarindia8@gmail.com';

const EMPLOYEES_TO_SEED = [
  { fullName: 'Aarav Sharma', email: 'aarav.sharma@shiftsync.com' },
  { fullName: 'Riya Patel', email: 'riya.patel@shiftsync.com' },
  { fullName: 'Kabir Singh', email: 'kabir.singh@shiftsync.com' },
  { fullName: 'Ananya Iyer', email: 'ananya.iyer@shiftsync.com' }
];

async function run() {
  console.log('[seeder] Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('[seeder] Connected successfully.');

  // 1. Ensure Manager exists
  let manager = await User.findOne({ email: MANAGER_EMAIL });
  if (!manager) {
    console.log(`[seeder] Manager user "${MANAGER_EMAIL}" not found. Creating...`);
    manager = new User({
      email: MANAGER_EMAIL,
      password: 'Pratyush2005',
      fullName: 'Pratyush Kumar',
      role: 'manager'
    });
    await manager.save();
  }

  // 2. Ensure Business exists for Manager
  let business = manager.businessId ? await Business.findById(manager.businessId) : null;
  if (!business) {
    console.log('[seeder] Creating new Business for Manager...');
    business = await Business.create({
      name: 'Pratyush Corporate Services',
      managerId: manager._id
    });
    manager.businessId = business._id;
    await manager.save();
  }

  console.log(`[seeder] Manager: ${manager.fullName} | Business ID: ${business._id}`);

  // 3. Seed the 4 Employees
  for (const empInfo of EMPLOYEES_TO_SEED) {
    let emp = await User.findOne({ email: empInfo.email });
    if (!emp) {
      console.log(`[seeder] Creating employee: ${empInfo.fullName} (${empInfo.email})...`);
      emp = new User({
        email: empInfo.email,
        fullName: empInfo.fullName,
        password: 'EmployeePassword123',
        role: 'employee',
        businessId: business._id
      });
      await emp.save();
      console.log(`   Added: ${empInfo.fullName} with ID: ${emp._id}`);
    } else {
      console.log(`[seeder] Employee "${empInfo.fullName}" already exists.`);
      // Ensure business ID is aligned
      if (!emp.businessId || emp.businessId.toString() !== business._id.toString()) {
        emp.businessId = business._id;
        await emp.save();
      }
    }
  }

  console.log('\n✅ Success! 4 employees have been successfully seeded in the database.');
  await mongoose.disconnect();
}

run().catch(err => {
  console.error('[seeder] Error seeding database:', err.message);
  process.exit(1);
});
