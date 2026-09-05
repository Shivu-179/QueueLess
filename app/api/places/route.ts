import { NextResponse } from 'next/server';
import { getPlaces, createPlace } from '@/lib/data-service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const places = await getPlaces(query, category);
    return NextResponse.json({ success: true, count: places.length, places });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch places.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || !body.type) {
      return NextResponse.json({ success: false, error: 'Place name and type are required.' }, { status: 400 });
    }
    const created = await createPlace(body);
    return NextResponse.json({ success: true, message: 'Place added successfully!', place: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create place.' }, { status: 500 });
  }
}