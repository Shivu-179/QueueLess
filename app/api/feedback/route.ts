import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// In-memory feedback store for standalone demo mode
let mockFeedbacks: any[] = [
  { id: 'fb_1', placeId: 'place_1', rating: 5, comment: 'Counter 3 was extremely fast today. Wait was under 15 mins!', userName: 'Aarav Mehta', createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
  { id: 'fb_2', placeId: 'place_1', rating: 4, comment: 'Recommended 2 PM slot was accurate. Very light crowd.', userName: 'Sneha Roy', createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const placeId = searchParams.get('placeId');

    try {
      const dbFeedbacks = await prisma.feedback.findMany({
        where: placeId ? { placeId } : undefined,
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      });
      if (dbFeedbacks && dbFeedbacks.length > 0) {
        return NextResponse.json({
          success: true,
          feedbacks: dbFeedbacks.map((f) => ({
            id: f.id,
            placeId: f.placeId,
            rating: f.rating,
            comment: f.comment,
            userName: f.user?.name || 'Citizen',
            createdAt: f.createdAt.toISOString(),
          })),
        });
      }
    } catch {}

    const filtered = placeId ? mockFeedbacks.filter((f) => f.placeId === placeId) : mockFeedbacks;
    return NextResponse.json({ success: true, feedbacks: filtered });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch feedback.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { placeId, rating, comment, userName } = body;

    if (!placeId || !rating) {
      return NextResponse.json({ success: false, error: 'Place and rating are required.' }, { status: 400 });
    }

    const numRating = parseInt(rating);
    if (numRating < 1 || numRating > 5) {
      return NextResponse.json({ success: false, error: 'Rating must be between 1 and 5 stars.' }, { status: 400 });
    }

    const newFeedback = {
      id: 'fb_' + Date.now(),
      placeId,
      rating: numRating,
      comment: comment?.trim() || '',
      userName: userName?.trim() || 'Verified Citizen',
      createdAt: new Date().toISOString(),
    };

    try {
      await prisma.feedback.create({
        data: {
          placeId,
          rating: numRating,
          comment: comment?.trim() || '',
        },
      });
    } catch {}

    mockFeedbacks.unshift(newFeedback);

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully! Thank you for rating this facility.',
      feedback: newFeedback,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to submit feedback.' }, { status: 500 });
  }
}