import React, { useEffect, useRef, useState } from 'react';
import { Folder } from 'lucide-react';
import { FileTypeConfig, ViewMode } from '../types';

interface NewItemInputProps {
    type: 'folder' | 'file';
    fileKey?: string;
    viewMode: ViewMode;
    fileTypes: FileTypeConfig[];
    folderColor?: string;
    onConfirm: (name: string) => void;
    onCancel: () => void;
}

export default function NewItemInput({
    type,
    fileKey,
    viewMode,
    fileTypes,
    folderColor = '#FFA500',
    onConfirm,
    onCancel
}: NewItemInputProps) {
    const [name, setName] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Auto-focus the input when component mounts
        inputRef.current?.focus();
        inputRef.current?.select();
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (name.trim()) {
                onConfirm(name.trim());
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            onCancel();
        }
    };

    const handleBlur = () => {
        if (name.trim()) {
            onConfirm(name.trim());
        } else {
            onCancel();
        }
    };

    // Get file type config for file items
    const fileTypeConfig = type === 'file' && fileKey ? fileTypes.find(ft => ft.key === fileKey) : null;
    const IconComponent = fileTypeConfig?.icon;

    // Calculate sizes based on view mode
    const iconSize = viewMode === 'extra_large' ? 64 : viewMode === 'large' ? 48 : viewMode === 'medium' ? 40 : 32;
    const containerWidth = viewMode === 'extra_large' ? '250px' : viewMode === 'large' ? '200px' : viewMode === 'medium' ? '150px' : '120px';

    // Render for list/details view
    if (viewMode === 'list' || viewMode === 'details') {
        return (
            <div className={`${viewMode === 'details' ? 'grid grid-cols-[2fr_1fr_1fr_1fr] gap-4' : 'flex items-center gap-3'} px-3 py-2 hover:bg-gray-50 border-l-2 border-blue-500 bg-blue-50`}>
                <div className="flex items-center gap-3">
                    {type === 'folder' ? (
                        <Folder size={20} style={{ color: folderColor }} />
                    ) : IconComponent ? (
                        <IconComponent size={20} style={{ color: fileTypeConfig?.color }} />
                    ) : (
                        <div
                            className="w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded"
                            style={{
                                backgroundColor: fileTypeConfig?.color || '#6B7280',
                                color: '#ffffff',
                            }}
                        >
                            {fileKey?.substring(0, 2).toUpperCase() || 'F'}
                        </div>
                    )}
                    <input
                        ref={inputRef}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                        placeholder={type === 'folder' ? 'New Folder' : fileTypeConfig?.name || 'New File'}
                        className="flex-1 px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                {viewMode === 'details' && (
                    <>
                        <div className="text-sm text-gray-500">-</div>
                        <div className="text-sm text-gray-500">{type === 'folder' ? 'Folder' : fileTypeConfig?.name || 'File'}</div>
                        <div className="text-sm text-gray-500">-</div>
                    </>
                )}
            </div>
        );
    }

    // Render for icon views
    return (
        <div
            className="inline-flex flex-col items-center justify-center p-2 rounded group"
            style={{
                width: containerWidth,
                marginRight: viewMode === 'extra_large' ? '60px' : viewMode === 'large' ? '50px' : viewMode === 'medium' ? '40px' : '30px',
                marginBottom: '20px',
            }}
        >
            {type === 'folder' ? (
                <Folder size={iconSize} style={{ color: folderColor }} />
            ) : IconComponent ? (
                <IconComponent size={iconSize} style={{ color: fileTypeConfig?.color }} />
            ) : (
                <div
                    className="flex items-center justify-center font-bold rounded"
                    style={{
                        width: `${iconSize}px`,
                        height: `${iconSize}px`,
                        backgroundColor: fileTypeConfig?.color || '#6B7280',
                        color: '#ffffff',
                        fontSize: `${iconSize / 3}px`,
                    }}
                >
                    {fileKey?.substring(0, 2).toUpperCase() || 'F'}
                </div>
            )}
            <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                placeholder={type === 'folder' ? 'New Folder' : fileTypeConfig?.name || 'New File'}
                className="w-full mt-2 px-2 py-1 text-sm text-center border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
}
