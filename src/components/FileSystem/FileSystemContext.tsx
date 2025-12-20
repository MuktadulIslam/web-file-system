'use client';

import { FileSystemConfig, FileSystemItem, SortBy, ViewMode } from '@/types';
import { config } from 'process';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useFileSystemMutations } from './hooks';

interface PathStackItem {
    id: string | null;
    name: string;
    path: string;
}

interface FileSystemContextType {
    // State
    items: FileSystemItem[];
    setItems: React.Dispatch<React.SetStateAction<FileSystemItem[]>>;
    currentPath: string;
    setCurrentPath: React.Dispatch<React.SetStateAction<string>>;
    currentFolderId: string | null;
    setCurrentFolderId: React.Dispatch<React.SetStateAction<string | null>>;
    sortBy: SortBy;
    setSortBy: React.Dispatch<React.SetStateAction<SortBy>>;
    viewMode: ViewMode;
    setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    contextMenuOpen: boolean;
    setContextMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    contextMenuPosition: { x: number; y: number } | null;
    setContextMenuPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
    pathStack: PathStackItem[];
    setPathStack: React.Dispatch<React.SetStateAction<PathStackItem[]>>;
    initialized: boolean;
    setInitialized: React.Dispatch<React.SetStateAction<boolean>>;
    config: FileSystemConfig;
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined);

export const FileSystemProvider: React.FC<{ children: ReactNode, config: FileSystemConfig }> = ({ children, config }) => {
    const [items, setItems] = useState<FileSystemItem[]>([]);
    const [currentPath, setCurrentPath] = useState(':home/');
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<SortBy>('name_asc');
    const [viewMode, setViewMode] = useState<ViewMode>('medium');
    const [loading, setLoading] = useState(true);
    const [contextMenuOpen, setContextMenuOpen] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);
    const [pathStack, setPathStack] = useState<PathStackItem[]>([
        { id: null, name: ':home', path: ':home/' },
    ]);
    const [initialized, setInitialized] = useState(false);

    return (
        <FileSystemContext.Provider
            value={{
                items,
                setItems,
                currentPath,
                setCurrentPath,
                currentFolderId,
                setCurrentFolderId,
                sortBy,
                setSortBy,
                viewMode,
                setViewMode,
                loading,
                setLoading,
                contextMenuOpen,
                setContextMenuOpen,
                contextMenuPosition,
                setContextMenuPosition,
                pathStack,
                setPathStack,
                initialized,
                setInitialized,
                config
            }}
        >
            {children}
        </FileSystemContext.Provider>
    );
};

export const useFileSystem = () => {
    const context = useContext(FileSystemContext);
    if (context === undefined) {
        throw new Error('useFileSystem must be used within a FileSystemProvider');
    }
    return context;
};
