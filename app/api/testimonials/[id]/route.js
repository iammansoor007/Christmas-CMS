import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
import { getAuthUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { sanitizeObject } from '@/lib/sanitize';

export async function PUT(request, context) {
    const rateLimited = checkRateLimit(request, { maxRequests: 10, windowMs: 60000 });
    if (rateLimited) return rateLimited;

    try {
        const user = await getAuthUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        await connectDB();
        const { id } = await context.params;
        const body = sanitizeObject(await request.json());
        const testimonial = await Testimonial.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!testimonial) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ testimonial });
    } catch (error) {
        return NextResponse.json({ error: error.message || 'Failed to update' }, { status: 500 });
    }
}

export async function DELETE(request, context) {
    const rateLimited = checkRateLimit(request, { maxRequests: 10, windowMs: 60000 });
    if (rateLimited) return rateLimited;

    try {
        const user = await getAuthUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        await connectDB();
        const { id } = await context.params;
        const testimonial = await Testimonial.findByIdAndDelete(id);
        if (!testimonial) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
