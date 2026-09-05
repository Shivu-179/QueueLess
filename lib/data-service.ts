import { query } from './db';
import { calculateCrowdLevel, calculateBestTimeSlot, predictWaitingTime, detectFakeReport } from './prediction';

export async function getPlaces(searchQuery?: string, category?: string) {
  try {
    let sql = 'SELECT * FROM "places" WHERE "isActive" = true ORDER BY "createdAt" ASC;';
    const res = await query(sql);
    let places = res.rows.map((p) => ({
      id: p.id,
      name: p.name,
      type: p.type,
      address: p.address,
      department: p.department || 'General Administration',
      roomLocation: p.roomLocation || p.address,
      contactPerson: p.contactPerson || 'Office In-Charge',
      contactPhone: p.contactPhone || '1800-11-0000',
      contactEmail: p.contactEmail || 'contact@queueless.org',
      openingTime: p.openingTime,
      closingTime: p.closingTime,
      counters: p.counters,
      isActive: p.isActive,
      currentCrowd: p.currentCrowd,
      estimatedWait: p.estimatedWait,
      bestTime: `${p.bestTimeStart} – ${p.bestTimeEnd}`,
      expectedWaitAtBest: p.expectedWaitAtBest,
    }));

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      places = places.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.department.toLowerCase().includes(q) ||
          p.contactPerson.toLowerCase().includes(q)
      );
    }
    if (category && category !== 'all') {
      places = places.filter((p) => p.type.toLowerCase().includes(category.toLowerCase()));
    }
    return places;
  } catch (e) {
    console.error('Database query error in getPlaces:', e);
    return [];
  }
}

export async function getPlaceById(id: string) {
  try {
    const placeRes = await query('SELECT * FROM "places" WHERE "id" = $1 LIMIT 1;', [id]);
    if (placeRes.rows.length === 0) return null;
    const p = placeRes.rows[0];

    const reportsRes = await query(
      'SELECT r.*, u.name as "userName" FROM "queue_reports" r LEFT JOIN "users" u ON r."userId" = u.id WHERE r."placeId" = $1 ORDER BY r."createdAt" DESC LIMIT 15;',
      [id]
    );

    return {
      id: p.id,
      name: p.name,
      type: p.type,
      address: p.address,
      department: p.department || 'Main Counter & Administration',
      roomLocation: p.roomLocation || p.address,
      contactPerson: p.contactPerson || 'Office In-Charge',
      contactPhone: p.contactPhone || '1800-11-0000',
      contactEmail: p.contactEmail || 'contact@queueless.org',
      openingTime: p.openingTime,
      closingTime: p.closingTime,
      counters: p.counters,
      isActive: p.isActive,
      currentCrowd: p.currentCrowd,
      estimatedWait: p.estimatedWait,
      bestTime: `${p.bestTimeStart} – ${p.bestTimeEnd}`,
      expectedWaitAtBest: p.expectedWaitAtBest,
      reports: reportsRes.rows.map((r) => ({
        id: r.id,
        waitingTime: r.waitingTime,
        crowdLevel: r.crowdLevel,
        peopleWaiting: r.peopleWaiting,
        isSuspicious: r.isSuspicious,
        userName: r.userName || 'Citizen',
        createdAt: r.createdAt,
      })),
    };
  } catch (e) {
    console.error('Database query error in getPlaceById:', e);
    return null;
  }
}

export async function createPlace(data: any) {
  const id = 'place_' + Date.now();
  const sql = `
    INSERT INTO "places" ("id", "name", "type", "address", "department", "roomLocation", "contactPerson", "contactPhone", "contactEmail", "openingTime", "closingTime", "counters", "isActive", "currentCrowd", "estimatedWait", "bestTimeStart", "bestTimeEnd", "expectedWaitAtBest")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true, 'LOW', 10, '10:00 AM', '11:00 AM', 5)
    RETURNING *;
  `;
  const res = await query(sql, [
    id,
    data.name,
    data.type,
    data.address,
    data.department || 'General Administration',
    data.roomLocation || data.address,
    data.contactPerson || 'Duty Officer',
    data.contactPhone || '1800-11-0000',
    data.contactEmail || 'support@queueless.org',
    data.openingTime || '09:00 AM',
    data.closingTime || '05:00 PM',
    parseInt(data.counters) || 1,
  ]);
  return res.rows[0];
}

export async function togglePlaceStatus(id: string) {
  const res = await query('UPDATE "places" SET "isActive" = NOT "isActive" WHERE "id" = $1 RETURNING *;', [id]);
  return res.rows[0];
}

export async function addQueueReport(data: {
  placeId: string;
  waitingTime: number;
  crowdLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  peopleWaiting?: number;
  userId?: string;
  userName?: string;
}) {
  const existingReportsRes = await query('SELECT * FROM "queue_reports" WHERE "placeId" = $1;', [data.placeId]);
  const fakeCheck = detectFakeReport(data.waitingTime, existingReportsRes.rows);
  const isSuspicious = fakeCheck.isSuspicious;
  const status = isSuspicious ? 'FLAGGED_FAKE' : 'APPROVED';

  const crowdCalc = calculateCrowdLevel(data.waitingTime);
  const crowdLevel = data.crowdLevel || crowdCalc.level;
  const repId = 'rep_' + Date.now();

  await query(
    `INSERT INTO "queue_reports" ("id", "placeId", "userId", "waitingTime", "crowdLevel", "peopleWaiting", "isSuspicious", "status", "flagReason")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
    [
      repId,
      data.placeId,
      data.userId || null,
      data.waitingTime,
      crowdLevel,
      data.peopleWaiting || 0,
      isSuspicious,
      status,
      fakeCheck.reason || null,
    ]
  );

  // If approved, update live prediction in Neon
  if (!isSuspicious) {
    const validReportsRes = await query(
      'SELECT "waitingTime", "isSuspicious" FROM "queue_reports" WHERE "placeId" = $1 AND "isSuspicious" = false;',
      [data.placeId]
    );
    const newAverage = predictWaitingTime(validReportsRes.rows);
    const newCrowd = calculateCrowdLevel(newAverage).level;
    const bestSlot = calculateBestTimeSlot(newAverage);

    await query(
      `UPDATE "places" 
       SET "estimatedWait" = $1, "currentCrowd" = $2, "bestTimeStart" = $3, "bestTimeEnd" = $4, "expectedWaitAtBest" = $5, "updatedAt" = NOW()
       WHERE "id" = $6;`,
      [
        newAverage,
        newCrowd,
        bestSlot.timeSlot.split(' – ')[0],
        bestSlot.timeSlot.split(' – ')[1] || '04:00 PM',
        bestSlot.expectedWait,
        data.placeId,
      ]
    );
  }

  return {
    id: repId,
    placeId: data.placeId,
    waitingTime: data.waitingTime,
    crowdLevel,
    isSuspicious,
    status,
    flagReason: fakeCheck.reason,
  };
}

export async function getReports(placeId?: string) {
  const sql = placeId
    ? `SELECT r.*, p.name as "placeName", u.name as "userName" FROM "queue_reports" r JOIN "places" p ON r."placeId" = p.id LEFT JOIN "users" u ON r."userId" = u.id WHERE r."placeId" = $1 ORDER BY r."createdAt" DESC LIMIT 50;`
    : `SELECT r.*, p.name as "placeName", u.name as "userName" FROM "queue_reports" r JOIN "places" p ON r."placeId" = p.id LEFT JOIN "users" u ON r."userId" = u.id ORDER BY r."createdAt" DESC LIMIT 50;`;

  const params = placeId ? [placeId] : [];
  const res = await query(sql, params);
  return res.rows.map((r) => ({
    id: r.id,
    placeId: r.placeId,
    placeName: r.placeName,
    userName: r.userName || 'Citizen',
    waitingTime: r.waitingTime,
    crowdLevel: r.crowdLevel,
    peopleWaiting: r.peopleWaiting,
    isSuspicious: r.isSuspicious,
    status: r.status,
    flagReason: r.flagReason,
    createdAt: r.createdAt,
  }));
}

export async function moderateReport(reportId: string, action: 'APPROVE' | 'DELETE') {
  if (action === 'DELETE') {
    await query('DELETE FROM "queue_reports" WHERE "id" = $1;', [reportId]);
  } else {
    await query('UPDATE "queue_reports" SET "status" = $1, "isSuspicious" = false WHERE "id" = $2;', ['APPROVED', reportId]);
  }
  return true;
}

export async function getAdminDashboardStats() {
  const usersRes = await query('SELECT COUNT(*) FROM "users";');
  const placesRes = await query('SELECT * FROM "places";');
  const reportsRes = await query(
    'SELECT r.*, p.name as "placeName", u.name as "userName" FROM "queue_reports" r JOIN "places" p ON r."placeId" = p.id LEFT JOIN "users" u ON r."userId" = u.id ORDER BY r."createdAt" DESC LIMIT 20;'
  );

  const places = placesRes.rows;
  const reports = reportsRes.rows;
  const totalUsers = parseInt(usersRes.rows[0].count) || 0;
  const totalPlaces = places.length;
  const reportsToday = reports.length;

  const validReports = reports.filter((r) => !r.isSuspicious);
  const avgWait = validReports.length > 0
    ? Math.round(validReports.reduce((s, r) => s + r.waitingTime, 0) / validReports.length)
    : 22;

  const mostCrowded = [...places].sort((a, b) => b.estimatedWait - a.estimatedWait)[0];
  const suspiciousReports = reports.filter((r) => r.isSuspicious || r.status === 'FLAGGED_FAKE');

  return {
    totalUsers,
    totalPlaces,
    reportsToday,
    avgWait,
    mostCrowdedPlace: mostCrowded ? `${mostCrowded.name} (${mostCrowded.estimatedWait} mins)` : 'N/A',
    suspiciousCount: suspiciousReports.length,
    recentReports: reports,
    places,
  };
}