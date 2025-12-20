'use client';

import { ContextMenuPosition, FileSystemConfig, FileSystemItem, OpenedFile, PathStackItem, SortBy, ViewMode } from '../types';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useFileSystemNavigation } from './folderNavigation';

interface FileSystemContextType {
    config: FileSystemConfig;
    // State
    items: FileSystemItem[];
    setItems: React.Dispatch<React.SetStateAction<FileSystemItem[]>>;
    viewMode: ViewMode;
    setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
    pathStack: PathStackItem[];
    setPathStack: React.Dispatch<React.SetStateAction<PathStackItem[]>>;
    currentFolderId: string | null;
    setCurrentFolderId: React.Dispatch<React.SetStateAction<string | null>>;
    isContextMenuOpen: boolean;
    contextMenuPosition: ContextMenuPosition | null;
    sortBy: SortBy;
    setSortBy: React.Dispatch<React.SetStateAction<SortBy>>;
    openedFile: OpenedFile | null;
    setOpenedFile: React.Dispatch<React.SetStateAction<OpenedFile | null>>;

    // Actions
    openContextMenu: (e: React.MouseEvent) => void;
    closeContextMenu: () => void;
    navigateToFolder: (folder: FileSystemItem) => void;
    navigateToPath: (index: number) => void;
    openMenuItem: (item: FileSystemItem) => void;
    closeFile: () => void;
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined);

export function FileSystemContextProvider({ children, config }: { children: ReactNode, config: FileSystemConfig }) {
    const [items, setItems] = useState<FileSystemItem[]>([]);
    const [viewMode, setViewMode] = useState<ViewMode>('medium');
    const [contextMenuOpen, setContextMenuOpen] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState<ContextMenuPosition | null>(null);
    const [sortBy, setSortBy] = useState<SortBy>('name_asc');
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [pathStack, setPathStack] = useState<PathStackItem[]>([
        { id: null, name: 'home', path: 'home/' },
    ]);
    const [openedFile, setOpenedFile] = useState<OpenedFile | null>(null);

    const openContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setContextMenuPosition({ x: e.clientX, y: e.clientY });
        setContextMenuOpen(true);
    };

    const closeContextMenu = () => {
        setContextMenuOpen(false);
        setContextMenuPosition(null);
    };

    const closeFile = () => {
        setOpenedFile(null);
    };

    const { navigateToFolder, navigateToPath } = useFileSystemNavigation({
        pathStack,
        setPathStack,
        setCurrentFolderId
    });

    const openMenuItem = (item: FileSystemItem) => {
        if (item.is_folder) {
            navigateToFolder(item);
            return;
        }

        const fileTypeConfig = config.fileTypes.find(ft => ft.key === item.file_key);
        if (fileTypeConfig) {
            setOpenedFile({ item, fileTypeConfig });
        }
    };

    return (
        <FileSystemContext.Provider
            value={{
                config,
                // States
                items,
                setItems,
                viewMode,
                setViewMode,
                pathStack,
                setPathStack,
                currentFolderId,
                setCurrentFolderId,
                isContextMenuOpen: contextMenuOpen,
                contextMenuPosition,
                sortBy,
                setSortBy,
                openedFile,
                setOpenedFile,

                // Actions
                openContextMenu,
                closeContextMenu,
                navigateToFolder,
                navigateToPath,
                openMenuItem,
                closeFile
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
