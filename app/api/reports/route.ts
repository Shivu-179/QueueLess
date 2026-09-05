import { NextResponse } from 'next/server';
import { addQueueReport, getReports } from '@/lib/data-service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const placeId = searchParams.get('placeId') || undefined;
    const reports = await getReports(placeId);
    return NextResponse.json({ success: true, count: reports.length, reports });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch reports.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { placeId, waitingTime, crowdLevel, peopleWaiting, userName } = body;

    if (!placeId) {
      return NextResponse.json({ success: false, error: 'Please select a place.' }, { status: 400 });
    }

    const waitMins = parseInt(waitingTime);
    if (isNaN(waitMins) || waitMins <= 0) {
      return NextResponse.json({ success: false, error: 'Please enter a valid waiting time in minutes.' }, { status: 400 });
    }

    const report = await addQueueReport({
      placeId,
      waitingTime: waitMins,
      crowdLevel,
      peopleWaiting: parseInt(peopleWaiting) || 0,
      userName: userName || 'Citizen Contributor',
    });

    return NextResponse.json({
      success: true,
      message: report.isSuspicious
        ? 'Report submitted, but flagged for admin review due to suspicious outlier values.'
        : 'Report submitted successfully! Thank you for helping fellow citizens.',
      report,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to submit report.' }, { status: 500 });
  }
}