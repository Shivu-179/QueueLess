const { Client } = require('pg');

const dbUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_miH2lKqILX9T@ep-shy-frost-ayio04x6-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require';

const client = new Client({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false },
});

async function clearAll() {
  console.log('--- Connecting to Neon Cloud PostgreSQL ---');
  await client.connect();
  console.log('Connected.');

  console.log('--- Purging ALL Data from All Tables ---');
  await client.query('DELETE FROM "feedbacks";');
  await client.query('DELETE FROM "queue_reports";');
  await client.query('DELETE FROM "favorite_places";');
  await client.query('DELETE FROM "predictions";');
  await client.query('DELETE FROM "operating_hours";');
  await client.query('DELETE FROM "places";');
  await client.query('DELETE FROM "users";');

  // Verify counts
  const uCount = await client.query('SELECT COUNT(*) FROM "users";');
  const pCount = await client.query('SELECT COUNT(*) FROM "places";');
  const rCount = await client.query('SELECT COUNT(*) FROM "queue_reports";');
  const fCount = await client.query('SELECT COUNT(*) FROM "feedbacks";');

  console.log(`Users count: ${uCount.rows[0].count}`);
  console.log(`Places count: ${pCount.rows[0].count}`);
  console.log(`Queue reports count: ${rCount.rows[0].count}`);
  console.log(`Feedbacks count: ${fCount.rows[0].count}`);

  console.log('=== ALL DEMO DATA DELETED 100% CLEANLY ===');
  await client.end();
}

clearAll().catch(err => {
  console.error('Error clearing data:', err);
  process.exit(1);
});

