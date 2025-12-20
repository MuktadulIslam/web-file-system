// src/components/FileSystem/FileItem.tsx

import React, { useState, useRef, useEffect } from 'react';
import { FileSystemItem, ViewMode, FileTypeConfig } from '../../types';
import toast from 'react-hot-toast';
import { getItemGap, getItemWidth } from './getSizeForViewMode';
import ItemIcon from './ItemIcon';

interface FileItemProps {
    item: FileSystemItem;
    viewMode: ViewMode;
    fileTypes: FileTypeConfig[];
    folderColor?: string;
    allItems: FileSystemItem[];
    onOpen: (item: FileSystemItem) => void;
    onDelete: (id: string) => void;
    onRename: (itemId: string, newName: string) => void;
}

const FileItem: React.FC<FileItemProps> = ({
    item,
    viewMode,
    fileTypes,
    folderColor = '#FFA500',
    allItems,
    onOpen,
    onDelete,
    onRename,
}) => {
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(item.name);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isRenaming && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isRenaming]);

    

    const getFileTypeConfig = () => {
        if (item.is_folder) return null;
        return fileTypes.find((ft) => ft.key === item.file_key);
    };

    const fileTypeConfig = getFileTypeConfig();

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setIsRenaming(true);
        setNewName(item.name);
    };

    const handleNameClick = (e: React.MouseEvent) => {
        // Prevent the parent's onClick from firing when clicking on the name
        e.stopPropagation();
    };

    const handleRenameSubmit = () => {
        const trimmedName = newName.trim();

        if (!trimmedName) {
            toast.error('Name cannot be empty');
            setNewName(item.name);
            setIsRenaming(false);
            return;
        }

        if (trimmedName === item.name) {
            setIsRenaming(false);
            return;
        }

        // Check for duplicate names in the same folder with the same type (folder or file)
        const duplicate = allItems.find(
            (i) =>
                i.id !== item.id &&
                i.name === trimmedName &&
                i.is_folder === item.is_folder
        );

        if (duplicate) {
            toast.error(`A ${item.is_folder ? 'folder' : 'file'} with the name "${trimmedName}" already exists`);
            setNewName(item.name);
            setIsRenaming(false);
            return;
        }

        onRename(item.id, trimmedName);
        setIsRenaming(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleRenameSubmit();
        } else if (e.key === 'Escape') {
            setNewName(item.name);
            setIsRenaming(false);
        }
    };

    const handleBlur = () => {
        setNewName(item.name);
        setIsRenaming(false);
    };



    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    if (viewMode === 'list') {
        return (
            <div className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded cursor-pointer group">
                <div onClick={() => !isRenaming && onOpen(item)} className="flex items-center gap-2 flex-1">
                    <ItemIcon
                        isFolder={item.is_folder}
                        fileTypeConfig={fileTypeConfig}
                        viewMode={viewMode}
                        folderColor={folderColor}
                    />

                    {isRenaming ? (
                        <input
                            ref={inputRef}
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={handleBlur}
                            className="text-sm px-1 py-0.5 border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-inset focus:ring-blue-500"
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <span
                            className="text-sm select-none"
                            onClick={handleNameClick}
                            onDoubleClick={handleDoubleClick}
                        >
                            {item.name}
                        </span>
                    )}
                </div>
            </div>
        );
    }

    if (viewMode === 'details') {
        return (
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 py-2 px-3 hover:bg-gray-50 rounded cursor-pointer group items-center">
                <div onClick={() => !isRenaming && onOpen(item)} className="flex items-center gap-2">
                    <ItemIcon
                        isFolder={item.is_folder}
                        fileTypeConfig={fileTypeConfig}
                        viewMode={viewMode}
                        folderColor={folderColor}
                    />

                    {isRenaming ? (
                        <input
                            ref={inputRef}
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={handleBlur}
                            className="text-sm px-1 py-0.5 border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-inset focus:ring-blue-500 w-full"
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <span
                            className="text-sm truncate select-none"
                            onClick={handleNameClick}
                            onDoubleClick={handleDoubleClick}
                        >
                            {item.name}
                        </span>
                    )}
                </div>
                <span className="text-sm text-gray-600">{formatDate(item.updated_at)}</span>
                <span className="text-sm text-gray-600">
                    {item.is_folder ? 'Folder' : fileTypeConfig?.name || 'File'}
                </span>
                <span className="text-sm text-gray-600">{item.created_by}</span>
            </div>
        );
    }

    // Icon views (extra_large, large, medium, small)
    const width = getItemWidth(viewMode);
    const gap = getItemGap(viewMode);

    return (
        <div
            className="inline-flex flex-col items-center group cursor-pointer p-2 hover:bg-gray-100 rounded"
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                marginRight: `${gap}px`,
                marginBottom: '20px',
            }}
            onClick={() => !isRenaming && onOpen(item)}
        >
            <ItemIcon
                isFolder={item.is_folder}
                fileTypeConfig={fileTypeConfig}
                viewMode={viewMode}
                folderColor={folderColor}
            />

            <div className="w-full h-6 flex items-center justify-center">
                {isRenaming ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                        className="text-sm mt-2 px-1 py-0.5 rounded focus:outline-none focus:ring-1 focus:ring-inset focus:ring-blue-500 text-center w-full"
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span
                        className="text-sm mt-1 px-1 py-0.5  rounded text-center w-full select-none"
                        onClick={handleNameClick}
                        onDoubleClick={handleDoubleClick}
                    >
                        {item.name}
                    </span>
                )}
            </div>
        </div>
    );
};

export default FileItem;