import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import { getAuthUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { sanitizeObject } from '@/lib/sanitize';

export async function GET(request) {
    const rateLimited = checkRateLimit(request, { maxRequests: 30, windowMs: 60000 });
    if (rateLimited) return rateLimited;

    try {
        await connectDB();
        let settings = await SiteSettings.findOne().lean();
        return NextResponse.json({ settings });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function PUT(request) {
    const rateLimited = checkRateLimit(request, { maxRequests: 10, windowMs: 60000 });
    if (rateLimited) return rateLimited;

    try {
        const user = await getAuthUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        await connectDB();
        const body = sanitizeObject(await request.json());
        const settings = await SiteSettings.findOneAndUpdate({}, body, { new: true, upsert: true });
        return NextResponse.json({ settings });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
