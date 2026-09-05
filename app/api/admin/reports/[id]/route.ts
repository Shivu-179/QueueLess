import { NextResponse } from 'next/server';
import { moderateReport } from '@/lib/data-service';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const action = body.action; // 'APPROVE' | 'DELETE'

    if (action !== 'APPROVE' && action !== 'DELETE') {
      return NextResponse.json({ success: false, error: 'Action must be APPROVE or DELETE.' }, { status: 400 });
    }

    const success = await moderateReport(params.id, action);
    return NextResponse.json({
      success: true,
      message: action === 'DELETE' ? 'Suspicious report deleted.' : 'Report verified and approved.',
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Moderation action failed.' }, { status: 500 });
  }
}