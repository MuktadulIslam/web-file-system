// src/components/FileSystem/FileItem.tsx

import React, { useState, useRef, useEffect } from 'react';
import { FileSystemItem, ViewMode, FileTypeConfig } from '@/types';
import toast from 'react-hot-toast';

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
        setIsRenaming(true);
        setNewName(item.name);
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

    const getInitials = () => {
        if (!item.file_key) return '';
        const words = item.file_key.split('-');
        if (words.length === 1) {
            return item.file_key.substring(0, 2).toUpperCase();
        }
        return (words[0][0] + words[1][0]).toUpperCase();
    };

    const renderIcon = () => {
        if (item.is_folder) {
            // Render folder as SVG with 3D look
            return (
                <div style={{ width: `${iconSize}px`, height: `${iconSize}px` }}>
                    <svg
                        width={iconSize}
                        height={iconSize}
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Folder back */}
                        <path
                            d="M10 25 L10 85 C10 88 12 90 15 90 L85 90 C88 90 90 88 90 85 L90 30 C90 27 88 25 85 25 Z"
                            fill={folderColor}
                            opacity="0.9"
                        />
                        {/* Folder tab */}
                        <path
                            d="M10 25 L10 20 C10 17 12 15 15 15 L35 15 L42 22 L85 22 C88 22 90 24 90 27 L90 30 L10 30 Z"
                            fill={folderColor}
                        />
                        {/* Folder front highlight */}
                        <path
                            d="M15 25 L15 85 C15 87 16 88 18 88 L85 88 C87 88 88 87 88 85 L88 30 Z"
                            fill="white"
                            opacity="0.1"
                        />
                    </svg>
                </div>
            );
        }

        // Render file with paper-like appearance
        const IconComponent = fileTypeConfig?.icon;
        const contentIconSize = iconSize * 0.5;

        return (
            <div style={{ width: `${iconSize}px`, height: `${iconSize}px`, position: 'relative' }}>
                <svg
                    width={iconSize}
                    height={iconSize}
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Paper/file shape - made wider */}
                    <path
                        d="M15 5 L70 5 L85 20 L85 95 L15 95 Z"
                        fill="white"
                        stroke="#d1d5db"
                        strokeWidth="2"
                    />
                    {/* Folded corner */}
                    <path
                        d="M70 5 L70 20 L85 20 Z"
                        fill="#e5e7eb"
                        stroke="#d1d5db"
                        strokeWidth="2"
                    />
                    {/* Color accent at top */}
                    <rect
                        x="15"
                        y="5"
                        width="55"
                        height="8"
                        fill={fileTypeConfig?.color || '#9ca3af'}
                        opacity="0.7"
                    />
                </svg>

                {/* Icon or initials inside the file */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {IconComponent ? (
                        <IconComponent size={contentIconSize} style={{ color: fileTypeConfig.color }} />
                    ) : (
                        <div
                            className="flex items-center justify-center font-bold rounded"
                            style={{
                                width: `${contentIconSize}px`,
                                height: `${contentIconSize}px`,
                                fontSize: `${contentIconSize / 2.5}px`,
                                backgroundColor: fileTypeConfig?.color || '#ffffff',
                                color: fileTypeConfig?.color ? '#ffffff' : '#000000',
                                border: !fileTypeConfig?.color ? '1px solid #ccc' : 'none',
                            }}
                        >
                            {getInitials()}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const getIconSize = () => {
        switch (viewMode) {
            case 'extra_large': return 200;
            case 'large': return 64;
            case 'medium': return 48;
            case 'small': return 32;
            default: return 16;
        }
    };

    const iconSize = getIconSize();

    const getItemWidth = () => {
        switch (viewMode) {
            case 'extra_large': return 250;
            case 'large': return 200;
            case 'medium': return 150;
            case 'small': return 120;
            default: return 'auto';
        }
    };

    const getItemGap = () => {
        switch (viewMode) {
            case 'extra_large': return 60;
            case 'large': return 50;
            case 'medium': return 40;
            case 'small': return 30;
            default: return 0;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    if (viewMode === 'list') {
        return (
            <div className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded cursor-pointer group">
                <div onClick={() => !isRenaming && onOpen(item)} className="flex items-center gap-2 flex-1">
                    {renderIcon()}
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
                    {renderIcon()}
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
    const width = getItemWidth();
    const gap = getItemGap();

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
            {renderIcon()}

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