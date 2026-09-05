import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword, signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, expectedRole } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required.' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Query Neon PostgreSQL
    const res = await query('SELECT * FROM "users" WHERE "email" = $1 LIMIT 1;', [normalizedEmail]);
    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid email or password.' }, { status: 401 });
    }

    const user = res.rows[0];
    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, error: 'Invalid email or password.' }, { status: 401 });
    }

    if (expectedRole === 'ADMIN' && user.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        error: 'Access Denied: This account is registered as a Citizen User. Please sign in via the Citizen Portal.',
      }, { status: 403 });
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    return NextResponse.json({
      success: true,
      message: 'Login successful from live PostgreSQL!',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Database authentication failed.' }, { status: 500 });
  }
}