const { execSync } = require('child_process');
const dotenv = require('dotenv');

// Load production env
dotenv.config({ path: '.env.production' });

console.log('Setting up Railway database...');

try {
  // Run commands synchronously
  console.log('Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  console.log('Pushing database schema...');
  execSync('npx prisma db push --force-reset', { stdio: 'inherit' });

  console.log('Seeding database...');
  execSync('npx ts-node --project ./prisma/tsconfig.json prisma/seed.ts', { stdio: 'inherit' });

  console.log('Successfully set up Railway database!');
} catch (error) {
  console.error('Error setting up Railway database:', error);
  process.exit(1);
}
