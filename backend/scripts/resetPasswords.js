require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const pool = require('../src/config/db');

async function resetPasswords() {
  const users = [
    { email: 'admin@campus.edu',     password: 'Admin@123' },
    { email: 'sarah.chen@campus.edu', password: 'Research@123' },
    { email: 'james.ok@campus.edu',   password: 'Research@123' },
    { email: 'priya.s@campus.edu',    password: 'Research@123' },
    { email: 'viewer@campus.edu',     password: 'Viewer@123' },
  ];

  console.log('Resetting passwords...');

  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 12);
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE email = $2',
      [hash, u.email]
    );
    console.log(`✅ ${u.email} → password set to: ${u.password}`);
  }

  console.log('\nDone! You can now login with:');
  console.log('  admin@campus.edu  /  Admin@123');
  process.exit(0);
}

resetPasswords().catch(err => { console.error(err); process.exit(1); });
