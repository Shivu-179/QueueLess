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

  console.log('--- Clearing old data cleanly ---');
  await client.query('DELETE FROM "feedbacks";');
  await client.query('DELETE FROM "queue_reports";');
  await client.query('DELETE FROM "places";');
  await client.query('DELETE FROM "users";');
  console.log('Database tables completely cleared.');

  // Create hashed passwords
  const adminHash = await bcrypt.hash('admin123', 10);
  const userHash = await bcrypt.hash('user123', 10);

  // Insert Users
  console.log('--- Seeding Clean Users ---');
  await client.query(`
    INSERT INTO "users" ("id", "name", "email", "password", "role", "updatedAt")
    VALUES 
      ('user_admin', 'QueueLess Administrator', 'admin@queueless.com', $1, 'ADMIN', NOW()),
      ('user_demo', 'Rahul Sharma (Citizen)', 'user@queueless.com', $2, 'USER', NOW());
  `, [adminHash, userHash]);

  // Insert 7 Facilities with Specific Admin Office, Room, Location, Contact Person, Phone & Email
  console.log('--- Seeding Facilities with Detailed Office, Rooms & Contacts ---');
  await client.query(`
    INSERT INTO "places" (
      "id", "name", "type", "address", 
      "department", "roomLocation", "contactPerson", "contactPhone", "contactEmail",
      "openingTime", "closingTime", "counters", "isActive", 
      "currentCrowd", "estimatedWait", "bestTimeStart", "bestTimeEnd", "expectedWaitAtBest", "updatedAt"
    )
    VALUES
      (
        'place_1', 
        'City Civil Hospital', 
        'Hospital', 
        'Main Health Complex, Sector 4, Civic Center',
        'OPD Registration & Blood Sample Collection (Room 102)',
        'Ground Floor, Wing A (Adjacent to Emergency Trauma Wing)',
        'Dr. Ramesh Verma (Chief Medical Admin)',
        '+91 98765 43210',
        'opd.admin@citycivilhospital.gov.in',
        '08:00 AM', '08:00 PM', 8, true,
        'HIGH', 35, '02:00 PM', '03:00 PM', 15, NOW()
      ),
      (
        'place_2', 
        'National State Bank', 
        'Bank', 
        '22 Financial Avenue, Commercial Zone',
        'Retail Banking, KYC & Loan Inquiry (Cabin 4, Desks 1-5)',
        'First Floor, Banking Concourse, Tower B',
        'Ms. Priya Nair (Branch Chief Operations Manager)',
        '+91 98220 11223',
        'mgr.sector4@statebank.co.in',
        '09:30 AM', '04:30 PM', 5, true,
        'MEDIUM', 22, '10:30 AM', '11:30 AM', 8, NOW()
      ),
      (
        'place_3', 
        'Regional Passport Seva Kendra', 
        'Government Office', 
        'District Collectorate Complex, Block B',
        'Biometric Verification & Document Clearance (Room 12)',
        '2nd Floor, Citizen Service Annex, Room No. 12',
        'Mr. Suresh K. Patil (Assistant Passport Officer)',
        '1800-258-1800',
        'rpo.counter12@passportindia.gov.in',
        '09:00 AM', '05:00 PM', 10, true,
        'LOW', 12, '09:00 AM', '10:00 AM', 5, NOW()
      ),
      (
        'place_4', 
        'Central Railway Reservation Concourse', 
        'Railway Station', 
        'Platform 1 East Entry, Junction Railway Station',
        'General & Tatkaal Ticket Counters (Counters 1 to 6)',
        'Ground Floor, East Booking Hall, Near Main Porch Gate',
        'Shri R. K. Sharma (Station Commercial Supervisor)',
        '139 / +91 98110 54321',
        'reservation.supervisor@centralrail.gov.in',
        '06:00 AM', '10:00 PM', 6, true,
        'VERY_HIGH', 50, '01:00 PM', '02:00 PM', 18, NOW()
      ),
      (
        'place_5', 
        'State University Student Affairs & Admin Block', 
        'College Office', 
        'Campus Gate 2, Administrative Wing',
        'Student Clearance, Transcript & Fee Counter (Hall Room 108)',
        'Ground Floor, Senate Hall Administrative Wing',
        'Prof. Anjali Saxena (Dean of Student Welfare)',
        '+91 97112 33445',
        'studentaffairs@stateuniv.ac.in',
        '10:00 AM', '04:00 PM', 4, true,
        'MEDIUM', 18, '11:00 AM', '12:00 PM', 7, NOW()
      ),
      (
        'place_6', 
        '24/7 MedPlus Super Pharmacy & Diagnostic Store', 
        'Shop / Store', 
        'Hospital Road, Commercial Plaza, Sector 4',
        'Prescription Dispensation & Jan Aushadhi Counter (Shop 14)',
        'Ground Floor, Shop No. 14, Main Market Complex',
        'Mr. Rajesh Gupta (Chief Registered Pharmacist)',
        '+91 98450 77889',
        'store14.medplus@healthstore.in',
        '07:00 AM', '11:00 PM', 3, true,
        'LOW', 8, '02:30 PM', '04:00 PM', 3, NOW()
      ),
      (
        'place_7', 
        'City Electricity & Water Utility Billing Office', 
        'Government Office', 
        'Civic Center, Vidyut Bhavan, North Circle',
        'Consumer Grievance & Cash Payment Counter (Room 3)',
        'Ground Floor, Counter 1-4, Room No. 3',
        'Mr. Vikas Chawla (Zonal Billing Officer)',
        '1912 / +91 98990 12345',
        'zone4.billing@cityutility.org',
        '09:00 AM', '04:00 PM', 4, true,
        'MEDIUM', 25, '11:30 AM', '12:30 PM', 10, NOW()
      );
  `);

  // Insert Queue Reports (genuine + 1 suspicious fake outlier for Admin Anti-Fake Guard testing)
  console.log('--- Seeding Queue Reports ---');
  await client.query(`
    INSERT INTO "queue_reports" ("id", "placeId", "userId", "waitingTime", "crowdLevel", "peopleWaiting", "isSuspicious", "status", "flagReason", "createdAt")
    VALUES
      ('rep_1', 'place_1', 'user_demo', 35, 'HIGH', 24, false, 'APPROVED', null, NOW() - INTERVAL '15 minutes'),
      ('rep_2', 'place_2', 'user_demo', 22, 'MEDIUM', 12, false, 'APPROVED', null, NOW() - INTERVAL '30 minutes'),
      ('rep_3', 'place_3', 'user_demo', 12, 'LOW', 5, false, 'APPROVED', null, NOW() - INTERVAL '45 minutes'),
      ('rep_4', 'place_4', 'user_demo', 50, 'VERY_HIGH', 40, false, 'APPROVED', null, NOW() - INTERVAL '10 minutes'),
      ('rep_5', 'place_5', 'user_demo', 18, 'MEDIUM', 9, false, 'APPROVED', null, NOW() - INTERVAL '20 minutes'),
      ('rep_6', 'place_6', 'user_demo', 8, 'LOW', 3, false, 'APPROVED', null, NOW() - INTERVAL '12 minutes'),
      ('rep_7', 'place_7', 'user_demo', 25, 'MEDIUM', 14, false, 'APPROVED', null, NOW() - INTERVAL '25 minutes'),
      ('rep_fake_1', 'place_1', null, 500, 'VERY_HIGH', 150, true, 'FLAGGED_FAKE', 'Suspicious outlier: 500 mins reported (exceeds reasonable limit)', NOW() - INTERVAL '5 minutes');
  `);

  // Insert Genuine Citizen Feedback
  console.log('--- Seeding Feedback ---');
  await client.query(`
    INSERT INTO "feedbacks" ("id", "placeId", "userId", "rating", "comment", "createdAt")
    VALUES
      ('fb_1', 'place_1', 'user_demo', 5, 'Visiting Room 102 at 2:15 PM saved me over 30 minutes! Staff was very prompt.', NOW() - INTERVAL '2 hours'),
      ('fb_2', 'place_2', 'user_demo', 4, 'Ms. Priya at Counter 4 resolved KYC quickly. Best time recommendation was accurate.', NOW() - INTERVAL '1 day'),
      ('fb_3', 'place_3', 'user_demo', 5, 'Passport verification in Room 12 took only 10 mins. Very well managed!', NOW() - INTERVAL '3 hours'),
      ('fb_4', 'place_6', 'user_demo', 5, 'MedPlus Shop 14 had zero line at 3 PM. Got medicines instantly!', NOW() - INTERVAL '5 hours');
  `);

  console.log('=== CLEAN DATA WITH OFFICE, ROOM & CONTACTS SEEDED SUCCESSFULLY ===');
  await client.end();
}

main().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
