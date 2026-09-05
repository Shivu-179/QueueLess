const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_miH2lKqILX9T@ep-shy-frost-ayio04x6-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to Neon!');
    await client.query('ALTER TABLE "places" ADD COLUMN IF NOT EXISTS "department" TEXT;');
    await client.query('ALTER TABLE "places" ADD COLUMN IF NOT EXISTS "roomLocation" TEXT;');
    await client.query('ALTER TABLE "places" ADD COLUMN IF NOT EXISTS "contactPerson" TEXT;');
    await client.query('ALTER TABLE "places" ADD COLUMN IF NOT EXISTS "contactPhone" TEXT;');
    await client.query('ALTER TABLE "places" ADD COLUMN IF NOT EXISTS "contactEmail" TEXT;');
    console.log('Columns added successfully!');
    await client.end();
  } catch (err) {
    console.error('Error adding columns:', err);
    process.exit(1);
  }
}

run();

