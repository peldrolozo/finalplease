// migrate.js
import 'dotenv/config';
import { exec } from 'child_process';

console.log('Starting database migration...');
console.log('Using DATABASE_URL:', process.env.DATABASE_URL ? 'Available' : 'Not available');

exec('npx drizzle-kit push', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(`Migration completed: ${stdout}`);
  console.log('Database structure created successfully!');
});