const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const dbUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_miH2lKqILX9T@ep-shy-frost-ayio04x6-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require';

const client = new Client({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  console.log('--- Connecting to Neon Cloud PostgreSQL ---');
  await client.connect();
  console.log('Connected successfully!');

  // Seed Initial Demo Data
  const adminHash = await bcrypt.hash('admin123', 10);
  const userHash = await bcrypt.hash('user123', 10);

  // Insert Users
  await client.query(`
    INSERT INTO "users" ("id", "name", "email", "password", "role")
    VALUES 
      ('user_admin', 'QueueLess Admin', 'admin@queueless.com', $1, 'ADMIN'),
      ('user_demo', 'Rahul Sharma', 'user@queueless.com', $2, 'USER')
    ON CONFLICT ("email") DO NOTHING;
  `, [adminHash, userHash]);

  // Insert Places
  await client.query(`
    INSERT INTO "places" ("id", "name", "type", "address", "openingTime", "closingTime", "counters", "currentCrowd", "estimatedWait", "bestTimeStart", "bestTimeEnd", "expectedWaitAtBest")
    VALUES
      ('place_1', 'City Civil Hospital', 'Hospital', 'Main Health Complex, Sector 4, Civic Center', '08:00 AM', '08:00 PM', 8, 'HIGH', 35, '02:00 PM', '03:00 PM', 15),
      ('place_2', 'National Central Bank', 'Bank', '22 Financial Avenue, Commercial Zone', '09:30 AM', '04:30 PM', 5, 'MEDIUM', 25, '10:30 AM', '11:30 AM', 8),
      ('place_3', 'Regional Passport & Govt Office', 'Government Office', 'District Collectorate Complex, Block B', '09:00 AM', '05:00 PM', 10, 'LOW', 12, '09:00 AM', '10:00 AM', 5),
      ('place_4', 'Central Railway Reservation Center', 'Railway Station', 'Platform 1 East Entry, Junction Station', '06:00 AM', '10:00 PM', 6, 'VERY_HIGH', 52, '01:00 PM', '02:00 PM', 18),
      ('place_5', 'University Student Affairs & Admin Block', 'College Office', 'Campus Gate 2, Administrative Wing', '10:00 AM', '04:00 PM', 4, 'MEDIUM', 20, '11:00 AM', '12:00 PM', 7)
    ON CONFLICT ("id") DO NOTHING;
  `);

  console.log('Neon database seeded successfully!');
  await client.end();
}

main().catch(console.error);