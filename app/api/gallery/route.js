import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GalleryItem from '@/models/GalleryItem';
import { getAuthUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { sanitizeObject } from '@/lib/sanitize';

export async function GET(request) {
    const rateLimited = checkRateLimit(request, { maxRequests: 30, windowMs: 60000 });
    if (rateLimited) return rateLimited;

    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const category = searchParams.get('category') || '';
        const status = searchParams.get('status') || '';

        const query = {};
        if (category) query.category = { $regex: category, $options: 'i' };
        if (status) query.status = status;

        const total = await GalleryItem.countDocuments(query);
        const items = await GalleryItem.find(query)
            .sort({ order: 1, createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        return NextResponse.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
    }
}

export async function POST(request) {
    const rateLimited = checkRateLimit(request, { maxRequests: 10, windowMs: 60000 });
    if (rateLimited) return rateLimited;

    try {
        const user = await getAuthUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        await connectDB();
        const body = sanitizeObject(await request.json());
        const item = new GalleryItem(body);
        await item.save();
        return NextResponse.json({ item }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message || 'Failed to create item' }, { status: 500 });
    }
}
