import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import db, { saveDb } from './index.js';

dotenv.config();

// Get credentials from environment variables (required in production)
const ADMIN1_EMAIL = process.env.ADMIN1_EMAIL;
const ADMIN1_PASSWORD = process.env.ADMIN1_PASSWORD;
const ADMIN1_NAME = process.env.ADMIN1_NAME || 'Admin User';

const ADMIN2_EMAIL = process.env.ADMIN2_EMAIL;
const ADMIN2_PASSWORD = process.env.ADMIN2_PASSWORD;
const ADMIN2_NAME = process.env.ADMIN2_NAME || 'Super Admin';

const seedDatabase = async () => {
  console.log('🌱 Seeding database...');

  // Validate required environment variables
  const missingVars = [];
  if (!ADMIN1_EMAIL) missingVars.push('ADMIN1_EMAIL');
  if (!ADMIN1_PASSWORD) missingVars.push('ADMIN1_PASSWORD');
  if (!ADMIN2_EMAIL) missingVars.push('ADMIN2_EMAIL');
  if (!ADMIN2_PASSWORD) missingVars.push('ADMIN2_PASSWORD');

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    console.error(`   ${missingVars.join(', ')}`);
    console.error('\n📝 Create a .env file in the server directory with:');
    console.error('   ADMIN1_EMAIL=admin@notes.app');
    console.error('   ADMIN1_PASSWORD=your-secure-password');
    console.error('   ADMIN2_EMAIL=superadmin@notes.app');
    console.error('   ADMIN2_PASSWORD=your-secure-password');
    console.error('\n   Or copy from .env.example and fill in values.');
    process.exit(1);
  }

  // Clear existing data
  db.exec('DELETE FROM notes');
  db.exec('DELETE FROM users');

  // Hash passwords
  const adminPassword1 = await bcrypt.hash(ADMIN1_PASSWORD, 10);
  const adminPassword2 = await bcrypt.hash(ADMIN2_PASSWORD, 10);
  const userPassword = await bcrypt.hash('testuser123!', 10);

  // Insert admin users
  const insertUser = db.prepare(
    'INSERT INTO users (email, password, name, is_admin) VALUES (?, ?, ?, ?)'
  );

  const admin1 = insertUser.run(ADMIN1_EMAIL, adminPassword1, ADMIN1_NAME, 1);
  const admin2 = insertUser.run(ADMIN2_EMAIL, adminPassword2, ADMIN2_NAME, 1);
  
  // Insert regular test users
  const user1 = insertUser.run('john@example.com', userPassword, 'John Doe', 0);
  const user2 = insertUser.run('jane@example.com', userPassword, 'Jane Smith', 0);

  // Insert sample notes
  const insertNote = db.prepare(
    'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)'
  );

  // Admin 1 notes
  insertNote.run(admin1.lastInsertRowid, 'Admin Dashboard Ideas', 'Consider adding analytics and user management features to the admin panel.');
  insertNote.run(admin1.lastInsertRowid, 'Security Checklist', '1. Implement rate limiting\n2. Add input validation\n3. Set up HTTPS\n4. Regular backups');

  // Admin 2 notes
  insertNote.run(admin2.lastInsertRowid, 'Platform Roadmap', 'Q1: User features\nQ2: Mobile app\nQ3: API integrations\nQ4: Enterprise features');

  // User 1 notes
  insertNote.run(user1.lastInsertRowid, 'Meeting Notes - Project Kickoff', 'Discussed project timeline and deliverables. Next meeting scheduled for Friday.');
  insertNote.run(user1.lastInsertRowid, 'Shopping List', '- Milk\n- Eggs\n- Bread\n- Coffee');
  insertNote.run(user1.lastInsertRowid, 'Book Recommendations', '1. Atomic Habits\n2. Deep Work\n3. The Pragmatic Programmer');

  // User 2 notes
  insertNote.run(user2.lastInsertRowid, 'Recipe: Pasta Carbonara', 'Ingredients: pasta, eggs, parmesan, pancetta, black pepper\n\nCook pasta, fry pancetta, mix eggs with cheese, combine all.');
  insertNote.run(user2.lastInsertRowid, 'Workout Plan', 'Monday: Chest/Triceps\nWednesday: Back/Biceps\nFriday: Legs\nSaturday: Shoulders/Core');

  saveDb();
  
  console.log('✅ Database seeded successfully!');
  console.log('\n📋 Admin accounts created:');
  console.log(`   ${ADMIN1_EMAIL} (${ADMIN1_NAME})`);
  console.log(`   ${ADMIN2_EMAIL} (${ADMIN2_NAME})`);
  console.log('\n👤 Test User Credentials:');
  console.log('   Email: john@example.com | Password: testuser123!');
  console.log('   Email: jane@example.com | Password: testuser123!');
};

seedDatabase();
