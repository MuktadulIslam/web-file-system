// src/app/api/items/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { FileSystemItem } from '@/types';

// GET items in a folder
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const folderId = searchParams.get('folderId');
        const sortBy = searchParams.get('sortBy') || 'name_asc';

        let orderBy = 'name ASC';
        switch (sortBy) {
            case 'created_asc':
                orderBy = 'created_at ASC';
                break;
            case 'created_desc':
                orderBy = 'created_at DESC';
                break;
            case 'name_desc':
                orderBy = 'name DESC';
                break;
        }

        const result = await query(
            `SELECT * FROM file_system_items 
       WHERE parent_folder_id ${folderId ? '= $1' : 'IS NULL'}
       ORDER BY is_folder DESC, ${orderBy}`,
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

// PATCH rename item
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, name, updatedBy, newPath } = body;

        if (!id || !name || !updatedBy) {
            return NextResponse.json(
                { success: false, error: 'ID, name, and updatedBy are required' },
                { status: 400 }
            );
        }

        const result = await query(
            `UPDATE file_system_items 
       SET name = $1, path = $2, updated_by = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
            [name, newPath, updatedBy, id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Item not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, item: result.rows[0] });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// DELETE item
export async function DELETE(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'ID is required' },
                { status: 400 }
            );
        }

        await query('DELETE FROM file_system_items WHERE id = $1', [id]);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}