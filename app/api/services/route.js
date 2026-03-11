import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';
import { getAuthUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { sanitizeObject } from '@/lib/sanitize';

// GET /api/services — list with pagination, search, filter
export async function GET(request) {
    const rateLimited = checkRateLimit(request, { maxRequests: 30, windowMs: 60000 });
    if (rateLimited) return rateLimited;

    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || '';

        const query = {};
        if (search) query.title = { $regex: search, $options: 'i' };
        if (status) query.status = status;

        const total = await Service.countDocuments(query);
        const services = await Service.find(query)
            .sort({ order: 1, createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        return NextResponse.json({
            services,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}

// POST /api/services — create new service
export async function POST(request) {
    const rateLimited = checkRateLimit(request, { maxRequests: 10, windowMs: 60000 });
    if (rateLimited) return rateLimited;

    try {
        const user = await getAuthUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectDB();
        const body = sanitizeObject(await request.json());

        // Auto-generate slug if not provided
        if (!body.slug && body.title) {
            body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }

        const service = new Service(body);
        await service.save();
        return NextResponse.json({ service }, { status: 201 });
    } catch (error) {
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: error.message || 'Failed to create service' }, { status: 500 });
    }
}
