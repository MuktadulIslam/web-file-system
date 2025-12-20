import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export interface FileTypeConfig {
    component: ReactNode;
    name: string;
    key: string;
    icon?: LucideIcon;
    color?: string;
}

export interface FileSystemItem {
    id: string;
    path: string;
    is_folder: boolean;
    file_key: string | null;
    parent_folder_id: string | null;
    name: string;
    created_by: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
}

export type SortBy = 'created_asc' | 'created_desc' | 'name_asc' | 'name_desc';

export type ViewMode = 'extra_large' | 'large' | 'medium' | 'small' | 'list' | 'details';

export interface FileSystemConfig {
    fileTypes: FileTypeConfig[];
    username: string;
    folderColor?: string;
}

export interface ContextMenuPosition {
    x: number;
    y: number;
}

export interface FileSystemState {
    currentPath: string;
    currentFolderId: string | null;
    items: FileSystemItem[];
    sortBy: SortBy;
    viewMode: ViewMode;
    loading: boolean;
    contextMenuOpen: boolean;
    contextMenuPosition: ContextMenuPosition | null;
}

export interface PathStackItem {
    id: string | null;
    name: string;
    path: string;
}

export interface OpenedFile {
    item: FileSystemItem;
    fileTypeConfig: FileTypeConfig;
}