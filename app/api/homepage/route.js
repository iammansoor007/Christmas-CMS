import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import HomepageContent from '@/models/HomepageContent';
import { getAuthUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { sanitizeObject } from '@/lib/sanitize';

// GET /api/homepage
export async function GET(request) {
    const rateLimited = checkRateLimit(request, { maxRequests: 30, windowMs: 60000 });
    if (rateLimited) return rateLimited;

    try {
        await connectDB();
        let content = await HomepageContent.findOne().lean();
        if (!content) {
            return NextResponse.json({ content: null });
        }
        return NextResponse.json({ content });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch homepage content' }, { status: 500 });
    }
}

// PUT /api/homepage
export async function PUT(request) {
    const rateLimited = checkRateLimit(request, { maxRequests: 10, windowMs: 60000 });
    if (rateLimited) return rateLimited;

    try {
        const user = await getAuthUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectDB();
        const body = sanitizeObject(await request.json());

        const content = await HomepageContent.findOneAndUpdate(
            {},
            body,
            { new: true, upsert: true, runValidators: true }
        );
        return NextResponse.json({ content });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update homepage content' }, { status: 500 });
    }
}
