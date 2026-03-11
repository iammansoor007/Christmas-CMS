import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/UserModel';
import { signToken, setAuthCookie } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(request) {
    // Strict rate limit on login: 5 attempts per minute per IP
    const rateLimited = checkRateLimit(request, { maxRequests: 5, windowMs: 60000 });
    if (rateLimited) return rateLimited;

    try {
        await connectDB();
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isValid = await user.comparePassword(password);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const token = await signToken({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            name: user.name,
        });

        const cookieConfig = setAuthCookie(token);
        const response = NextResponse.json({
            success: true,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });

        response.cookies.set(cookieConfig);
        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
