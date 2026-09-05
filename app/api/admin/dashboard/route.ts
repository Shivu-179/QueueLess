import { NextResponse } from 'next/server';
import { getAdminDashboardStats } from '@/lib/data-service';

export async function GET() {
  try {
    const stats = await getAdminDashboardStats();
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch admin stats.' }, { status: 500 });
  }
}