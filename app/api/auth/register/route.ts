import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    const userRole = role === 'ADMIN' ? 'ADMIN' : 'USER';

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ success: false, error: 'Name must be at least 2 characters.' }, { status: 400 });
    }
    if (!email || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const hashedPassword = await hashPassword(password);

    // Query Neon PostgreSQL
    const existing = await query('SELECT * FROM "users" WHERE "email" = $1 LIMIT 1;', [normalizedEmail]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ success: false, error: 'An account with this email already exists.' }, { status: 409 });
    }

    const userId = 'usr_' + Date.now();
    await query(
      'INSERT INTO "users" ("id", "name", "email", "password", "role") VALUES ($1, $2, $3, $4, $5);',
      [userId, name.trim(), normalizedEmail, hashedPassword, userRole]
    );

    const token = signToken({ userId, email: normalizedEmail, role: userRole });
    return NextResponse.json({
      success: true,
      message: 'Account registered successfully in live PostgreSQL!',
      user: { id: userId, name: name.trim(), email: normalizedEmail, role: userRole },
      token,
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, error: 'Failed to register account in database.' }, { status: 500 });
  }
}