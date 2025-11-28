import bcrypt from 'bcryptjs';
import db, { saveDb } from './index.js';

const seedDatabase = async () => {
  console.log('🌱 Seeding database...');

  // Clear existing data
  db.exec('DELETE FROM notes');
  db.exec('DELETE FROM users');

  // Hash passwords
  const adminPassword1 = await bcrypt.hash('admin123!', 10);
  const adminPassword2 = await bcrypt.hash('superadmin456!', 10);
  const userPassword = await bcrypt.hash('user123!', 10);

  // Insert admin users
  const insertUser = db.prepare(
    'INSERT INTO users (email, password, name, is_admin) VALUES (?, ?, ?, ?)'
  );

  const admin1 = insertUser.run('admin@notes.app', adminPassword1, 'Admin User', 1);
  const admin2 = insertUser.run('superadmin@notes.app', adminPassword2, 'Super Admin', 1);
  
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
  console.log('\n📋 Admin Credentials:');
  console.log('   Email: admin@notes.app | Password: admin123!');
  console.log('   Email: superadmin@notes.app | Password: superadmin456!');
  console.log('\n👤 Test User Credentials:');
  console.log('   Email: john@example.com | Password: user123!');
  console.log('   Email: jane@example.com | Password: user123!');
};

seedDatabase();
