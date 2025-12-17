// src/app/api/init/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        await initializeDatabase();
        return NextResponse.json({ success: true, message: 'Database initialized' });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}