// QueueLess Prediction & Anti-Fake Engine (Pure TypeScript)

export type CrowdLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';

export interface ReportItem {
  id: string;
  placeId: string;
  waitingTime: number; // in minutes
  crowdLevel: CrowdLevel;
  peopleWaiting: number;
  isSuspicious?: boolean;
  status?: string;
  createdAt: string | Date;
}

/**
 * Categorize waiting time into standard 4 crowd levels
 * 0-15m -> LOW
 * 16-30m -> MEDIUM
 * 31-50m -> HIGH
 * 51m+ -> VERY HIGH
 */
export function calculateCrowdLevel(waitingMinutes: number): {
  level: CrowdLevel;
  label: string;
  emoji: string;
  badgeClass: string;
} {
  if (waitingMinutes <= 15) {
    return { level: 'LOW', label: 'LOW', emoji: '🟢', badgeClass: 'badge-low' };
  } else if (waitingMinutes <= 30) {
    return { level: 'MEDIUM', label: 'MEDIUM', emoji: '🟡', badgeClass: 'badge-medium' };
  } else if (waitingMinutes <= 50) {
    return { level: 'HIGH', label: 'HIGH', emoji: '🟠', badgeClass: 'badge-high' };
  } else {
    return { level: 'VERY_HIGH', label: 'VERY HIGH', emoji: '🔴', badgeClass: 'badge-very-high' };
  }
}

/**
 * Anti-Fake Outlier Detection
 * Flags reports that deviate drastically from current trends (e.g. 500 min when avg is 20 min)
 * or impossible extremes (< 1 min or > 240 min without special cause).
 */
export function detectFakeReport(
  newWaitingTime: number,
  existingReports: ReportItem[]
): { isSuspicious: boolean; reason?: string } {
  // Extreme boundary check
  if (newWaitingTime <= 0) {
    return { isSuspicious: true, reason: 'Invalid waiting time (zero or negative).' };
  }
  if (newWaitingTime > 240) {
    return {
      isSuspicious: true,
      reason: `Unusually extreme duration (${newWaitingTime} mins). Typical limit is 240 mins.`,
    };
  }

  // Statistical outlier check against valid approved reports
  const validReports = existingReports.filter((r) => !r.isSuspicious);
  if (validReports.length >= 3) {
    const sum = validReports.reduce((acc, r) => acc + r.waitingTime, 0);
    const avg = sum / validReports.length;

    // If report is more than 3.5x the rolling average and difference > 45 mins
    if (newWaitingTime > avg * 3.5 && newWaitingTime - avg > 45) {
      return {
        isSuspicious: true,
        reason: `Extreme outlier: ${newWaitingTime} mins reported while current average is ${Math.round(avg)} mins.`,
      };
    }
  }

  return { isSuspicious: false };
}

/**
 * Predict estimated waiting time using previous reports.
 * Calculates the trimmed rolling average to exclude noise.
 */
export function predictWaitingTime(reports: ReportItem[]): number {
  const validReports = reports.filter((r) => !r.isSuspicious);
  if (validReports.length === 0) return 15; // default reasonable baseline

  // Sort reports chronologically
  const recentReports = [...validReports].slice(-10); // take latest 10 reports
  const sum = recentReports.reduce((acc, r) => acc + r.waitingTime, 0);
  return Math.round(sum / recentReports.length);
}

/**
 * Calculate the Best Time to Visit Today
 * Simulates expected wait times across standard operational hourly slots (9 AM to 5 PM)
 * and selects the window with the lowest predicted waiting time.
 */
export function calculateBestTimeSlot(baseWaitTime: number): {
  timeSlot: string;
  expectedWait: number;
} {
  // Typical hourly traffic factors (relative multipliers)
  // 9-10 AM (low/opening), 10-12 PM (peak), 1-2 PM (lunch dip), 2-4 PM (rush), 4-5 PM (clearing)
  const hourlyTraffic = [
    { slot: '09:00 AM – 10:00 AM', factor: 0.45 },
    { slot: '10:00 AM – 11:00 AM', factor: 0.85 },
    { slot: '11:00 AM – 12:00 PM', factor: 1.15 },
    { slot: '12:00 PM – 01:00 PM', factor: 1.30 },
    { slot: '01:00 PM – 02:00 PM', factor: 0.70 },
    { slot: '02:00 PM – 03:00 PM', factor: 0.50 },
    { slot: '03:00 PM – 04:00 PM', factor: 0.95 },
    { slot: '04:00 PM – 05:00 PM', factor: 0.60 },
  ];

  let best = hourlyTraffic[0];
  let minWait = Math.round(baseWaitTime * best.factor);

  for (const item of hourlyTraffic) {
    const est = Math.max(5, Math.round(baseWaitTime * item.factor));
    if (est < minWait) {
      minWait = est;
      best = item;
    }
  }

  return {
    timeSlot: best.slot,
    expectedWait: minWait,
  };
}