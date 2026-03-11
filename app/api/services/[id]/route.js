import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';
import { getAuthUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { sanitizeObject } from '@/lib/sanitize';

// GET /api/services/[id]
export async function GET(request, context) {
    const rateLimited = checkRateLimit(request, { maxRequests: 30, windowMs: 60000 });
    if (rateLimited) return rateLimited;

    try {
        await connectDB();
        const { id } = await context.params;
        const service = await Service.findById(id).lean() || await Service.findOne({ slug: id }).lean();
        if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        return NextResponse.json({ service });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
    }
}

// PUT /api/services/[id]
export async function PUT(request, context) {
    const rateLimited = checkRateLimit(request, { maxRequests: 10, windowMs: 60000 });
    if (rateLimited) return rateLimited;

    try {
        const user = await getAuthUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectDB();
        const { id } = await context.params;
        const body = sanitizeObject(await request.json());

        // Re-generate slug if title changed and slug not manually set
        if (body.title && !body.slug) {
            body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }

        const service = await Service.findByIdAndUpdate(id, body, { new: true, runValidators: true })
            || await Service.findOneAndUpdate({ slug: id }, body, { new: true, runValidators: true });
        if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        return NextResponse.json({ service });
    } catch (error) {
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: error.message || 'Failed to update service' }, { status: 500 });
    }
}

// DELETE /api/services/[id]
export async function DELETE(request, context) {
    const rateLimited = checkRateLimit(request, { maxRequests: 10, windowMs: 60000 });
    if (rateLimited) return rateLimited;

    try {
        const user = await getAuthUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectDB();
        const { id } = await context.params;
        const service = await Service.findByIdAndDelete(id)
            || await Service.findOneAndDelete({ slug: id });
        if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        return NextResponse.json({ message: 'Service deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
}
