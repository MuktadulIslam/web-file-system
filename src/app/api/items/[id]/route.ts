// src/app/api/items/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// PATCH update item (rename and/or move to different parent)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { newname, updatedBy, newParentFolderId, newPath } = body;

        if (updatedBy === undefined) {
            return NextResponse.json(
                { success: false, error: 'updatedBy is required' },
                { status: 400 }
            );
        }

        // Check if the item exists and if the user is the creator
        const itemCheck = await query(
            'SELECT created_by FROM file_system_items WHERE id = $1',
            [id]
        );

        if (itemCheck.rows.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Item not found' },
                { status: 404 }
            );
        }

        if (itemCheck.rows[0].created_by !== updatedBy) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized: Only the creator can update this item' },
                { status: 403 }
            );
        }

        // Build dynamic update query based on what fields are provided
        const updates: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (newname !== undefined) {
            updates.push(`name = $${paramIndex++}`);
            values.push(newname);
        }

        if (newParentFolderId !== undefined && newPath !== undefined) {
            updates.push(`parent_folder_id = $${paramIndex++}`);
            values.push(newParentFolderId);
            updates.push(`path = $${paramIndex++}`);
            values.push(newPath);
        }

        if (updates.length === 0) {
            return NextResponse.json(
                { success: false, error: 'No fields to update' },
                { status: 400 }
            );
        }

        updates.push(`updated_by = $${paramIndex++}`);
        values.push(updatedBy);

        updates.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const result = await query(
            `UPDATE file_system_items
             SET ${updates.join(', ')}
             WHERE id = $${paramIndex}
             RETURNING *`,
            values
        );

        return NextResponse.json({ success: true, item: result.rows[0] });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// DELETE item
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json();
        const { deletedBy } = body;
        const { id } = await params;

        if (!deletedBy) {
            return NextResponse.json(
                { success: false, error: 'deletedBy is required' },
                { status: 400 }
            );
        }

        // Check if the item exists and if the user is the creator
        const itemCheck = await query(
            'SELECT created_by FROM file_system_items WHERE id = $1',
            [id]
        );

        if (itemCheck.rows.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Item not found' },
                { status: 404 }
            );
        }

        if (itemCheck.rows[0].created_by !== deletedBy) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized: Only the creator can delete this item' },
                { status: 403 }
            );
        }

        // Delete the item
        await query('DELETE FROM file_system_items WHERE id = $1', [id]);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
