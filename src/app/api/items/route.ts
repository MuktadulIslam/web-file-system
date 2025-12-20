// src/app/api/items/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET items in a folder
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const folderId = searchParams.get('folderId');

        const result = await query(
            `SELECT * FROM file_system_items 
       WHERE parent_folder_id ${folderId ? '= $1' : 'IS NULL'}`,
            folderId ? [folderId] : []
        );

        return NextResponse.json({ success: true, items: result.rows });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST create folder or file
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, isFolder, fileKey, parentFolderId, createdBy, path } = body;

        if (!name || !createdBy) {
            return NextResponse.json(
                { success: false, error: 'Name and createdBy are required' },
                { status: 400 }
            );
        }

        const result = await query(
            `INSERT INTO file_system_items
       (path, is_folder, file_key, parent_folder_id, name, created_by, updated_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
            [path, isFolder, fileKey, parentFolderId, name, createdBy, createdBy]
        );

        return NextResponse.json({ success: true, item: result.rows[0] });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}