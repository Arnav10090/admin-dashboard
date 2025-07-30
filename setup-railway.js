const { exec } = require('child_process');
const dotenv = require('dotenv');

// Load production env
dotenv.config({ path: '.env.production' });

console.log('Setting up Railway database...');

// Run Prisma commands
const commands = [
  'npx prisma generate',
  'npx prisma db push --force-reset',  // This will recreate the database schema
  'npx ts-node --project ./prisma/tsconfig.json prisma/seed.ts'
];

commands.forEach(command => {
  console.log(`Running: ${command}`);
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error}`);
      return;
    }
    console.log(`Output: ${stdout}`);
  });
});
