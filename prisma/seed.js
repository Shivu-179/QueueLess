const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding QueueLess Database ---');

  // 1. Clean existing records (if any)
  try {
    await prisma.feedback.deleteMany();
    await prisma.favoritePlace.deleteMany();
    await prisma.prediction.deleteMany();
    await prisma.operatingHours.deleteMany();
    await prisma.queueReport.deleteMany();
    await prisma.place.deleteMany();
    await prisma.user.deleteMany();
  } catch (e) {
    console.log('Database empty or reset, continuing...');
  }

  // 2. Create Users
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const userPasswordHash = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'QueueLess Administrator',
      email: 'admin@queueless.com',
      password: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: 'Rahul Sharma',
      email: 'rahul@student.edu',
      password: userPasswordHash,
      role: 'USER',
    },
  });

  console.log('Created Users:', admin.email, demoUser.email);

  // 3. Create Places
  const hospital = await prisma.place.create({
    data: {
      name: 'City Civil Hospital',
      type: 'Hospital',
      address: 'Main Health Complex, Sector 4, Civic Center',
      openingTime: '08:00 AM',
      closingTime: '08:00 PM',
      counters: 8,
      currentCrowd: 'HIGH',
      estimatedWait: 35,
      bestTimeStart: '02:00 PM',
      bestTimeEnd: '03:00 PM',
      expectedWaitAtBest: 15,
    },
  });

  const bank = await prisma.place.create({
    data: {
      name: 'National Central Bank',
      type: 'Bank',
      address: '22 Financial Avenue, Commercial Zone',
      openingTime: '09:30 AM',
      closingTime: '04:30 PM',
      counters: 5,
      currentCrowd: 'MEDIUM',
      estimatedWait: 25,
      bestTimeStart: '10:30 AM',
      bestTimeEnd: '11:30 AM',
      expectedWaitAtBest: 8,
    },
  });

  const govtOffice = await prisma.place.create({
    data: {
      name: 'Regional Passport & Govt Office',
      type: 'Government Office',
      address: 'District Collectorate Complex, Block B',
      openingTime: '09:00 AM',
      closingTime: '05:00 PM',
      counters: 10,
      currentCrowd: 'LOW',
      estimatedWait: 12,
      bestTimeStart: '09:00 AM',
      bestTimeEnd: '10:00 AM',
      expectedWaitAtBest: 5,
    },
  });

  const railway = await prisma.place.create({
    data: {
      name: 'Central Railway Reservation Center',
      type: 'Railway Station',
      address: 'Platform 1 East Entry, Junction Station',
      openingTime: '06:00 AM',
      closingTime: '10:00 PM',
      counters: 6,
      currentCrowd: 'VERY_HIGH',
      estimatedWait: 50,
      bestTimeStart: '01:00 PM',
      bestTimeEnd: '02:00 PM',
      expectedWaitAtBest: 18,
    },
  });

  const college = await prisma.place.create({
    data: {
      name: 'University Student Affairs & Admin Block',
      type: 'College Office',
      address: 'Campus Gate 2, Administrative Wing',
      openingTime: '10:00 AM',
      closingTime: '04:00 PM',
      counters: 4,
      currentCrowd: 'MEDIUM',
      estimatedWait: 20,
      bestTimeStart: '11:00 AM',
      bestTimeEnd: '12:00 PM',
      expectedWaitAtBest: 7,
    },
  });

  console.log('Created 5 Places:', hospital.name, bank.name, govtOffice.name, railway.name, college.name);

  // 4. Create Sample Initial Reports
  await prisma.queueReport.createMany({
    data: [
      {
        placeId: hospital.id,
        userId: demoUser.id,
        waitingTime: 32,
        crowdLevel: 'HIGH',
        peopleWaiting: 45,
        status: 'APPROVED',
      },
      {
        placeId: hospital.id,
        waitingTime: 38,
        crowdLevel: 'HIGH',
        peopleWaiting: 50,
        status: 'APPROVED',
      },
      {
        placeId: bank.id,
        userId: demoUser.id,
        waitingTime: 22,
        crowdLevel: 'MEDIUM',
        peopleWaiting: 18,
        status: 'APPROVED',
      },
      {
        placeId: govtOffice.id,
        waitingTime: 10,
        crowdLevel: 'LOW',
        peopleWaiting: 8,
        status: 'APPROVED',
      },
      // Sample suspicious/fake report to test anti-fake system
      {
        placeId: hospital.id,
        waitingTime: 500,
        crowdLevel: 'VERY_HIGH',
        peopleWaiting: 900,
        isSuspicious: true,
        status: 'FLAGGED_FAKE',
        flagReason: 'Suspicious outlier: 500 minutes reported',
      },
    ],
  });

  console.log('Created sample queue reports and outlier anti-fake test cases.');
  console.log('--- Seeding Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });