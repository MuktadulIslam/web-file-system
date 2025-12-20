// src/lib/db.ts

import { Pool, PoolConfig } from 'pg';

const poolConfig: PoolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'folify',
    user: process.env.DB_USER || 'folifyuser',
    password: process.env.DB_PASSWORD || 'folify@2025',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};

let pool: Pool | null = null;

export function getPool(): Pool {
    if (!pool) {
        pool = new Pool(poolConfig);

        pool.on('error', (err) => {
            console.error('Unexpected error on idle client', err);
        });
    }

    return pool;
}

export async function initializeDatabase(): Promise<void> {
    const pool = getPool();

    try {
        // Check if table exists
        const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'file_system_items'
      );
    `);

        if (!tableCheck.rows[0].exists) {
            // Create table
            await pool.query(`
        CREATE TABLE file_system_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          path TEXT NOT NULL UNIQUE,
          is_folder BOOLEAN NOT NULL DEFAULT false,
          file_key TEXT,
          parent_folder_id UUID,
          name TEXT NOT NULL,
          created_by TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_by TEXT NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (parent_folder_id) REFERENCES file_system_items(id) ON DELETE CASCADE
        );
      `);

            // Create indexes
            await pool.query(`
        CREATE INDEX idx_parent_folder ON file_system_items(parent_folder_id);
        CREATE INDEX idx_path ON file_system_items(path);
        CREATE INDEX idx_file_key ON file_system_items(file_key);
      `);

            // Insert home folder
            await pool.query(`
        INSERT INTO file_system_items (path, is_folder, parent_folder_id, name, created_by, updated_by)
        VALUES ('home/', true, NULL, 'home', 'system', 'system');
      `);

            console.log('Database initialized successfully');
        }
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

export async function query(text: string, params?: any[]) {
    const pool = getPool();
    return pool.query(text, params);
}