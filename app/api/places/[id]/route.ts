import { NextResponse } from 'next/server';
import { getPlaceById, togglePlaceStatus } from '@/lib/data-service';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const place = await getPlaceById(params.id);
    if (!place) {
      return NextResponse.json({ success: false, error: 'Place not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, place });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch place details.' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const updated = await togglePlaceStatus(params.id);
    return NextResponse.json({ success: true, message: 'Place status updated.', place: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update place.' }, { status: 500 });
  }
}