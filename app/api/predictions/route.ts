import { NextResponse } from 'next/server';
import { getPlaceById } from '@/lib/data-service';
import { predictWaitingTime, calculateCrowdLevel, calculateBestTimeSlot } from '@/lib/prediction';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const placeId = searchParams.get('placeId');

    if (!placeId) {
      return NextResponse.json({ success: false, error: 'placeId query parameter is required.' }, { status: 400 });
    }

    const place = await getPlaceById(placeId);
    if (!place) {
      return NextResponse.json({ success: false, error: 'Place not found.' }, { status: 404 });
    }

    const predictedMinutes = predictWaitingTime(place.reports || []);
    const crowd = calculateCrowdLevel(predictedMinutes);
    const bestTime = calculateBestTimeSlot(predictedMinutes);

    return NextResponse.json({
      success: true,
      prediction: {
        placeId,
        placeName: place.name,
        predictedWaitTime: predictedMinutes,
        crowdLevel: crowd.level,
        crowdBadge: crowd.emoji + ' ' + crowd.label,
        badgeClass: crowd.badgeClass,
        bestTimeSlot: bestTime.timeSlot,
        expectedWaitAtBest: bestTime.expectedWait,
        historicalReportsCount: (place.reports || []).length,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Prediction computation failed.' }, { status: 500 });
  }
}