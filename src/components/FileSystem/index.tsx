// src/components/FileSystem/index.tsx

'use client';

import React from 'react';
import { Plus, ChevronRight, Eye, FilePlus2 } from 'lucide-react';
import { FileSystemConfig } from '@/types';
import ContextMenu from './ContextMenu';
import FileItem from './FileItem';
import { FileSystemProvider, useFileSystem } from './FileSystemContext';
import { useFileSystemInit } from './hooks/useFileSystemInit';
import { useFileSystemItems } from './hooks/useFileSystemItems';
import { useFileSystemMutations } from './hooks/useFileSystemMutations';
import { useFileSystemNavigation } from './hooks/useFileSystemNavigation';
import AddItems from './AddItems';
import { ReactQueryProvider } from '../FileSystem2/QueryClientProvider';

interface FileSystemProps {
  config: FileSystemConfig;
}

export default function FileSystem({ config }: FileSystemProps) {
  return (
    <ReactQueryProvider>
      <FileSystemProvider config={config}>
        <FileSystemInner />
      </FileSystemProvider>
    </ReactQueryProvider>
  );
}

function FileSystemInner() {
  const {
    items,
    viewMode,
    setViewMode,
    loading,
    contextMenuOpen,
    setContextMenuOpen,
    contextMenuPosition,
    setContextMenuPosition,
    pathStack,
    initialized,
    sortBy,
    setSortBy,
    config
  } = useFileSystem();

  const username = config.username || 'guest-user';

  // Initialize database
  useFileSystemInit();

  // Fetch items
  useFileSystemItems();

  // Navigation hooks
  const { openItem, navigateToPath } = useFileSystemNavigation();

  // Mutations hooks
  const { createFolder, deleteItem, renameItem } = useFileSystemMutations(username);

  const { createFile } = useFileSystemMutations(config.username);

  const openContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuOpen(true);
  };

  const closeContextMenu = () => {
    setContextMenuOpen(false);
    setContextMenuPosition(null);
  };

  const handleCreateFile = (fileKey: string) => {
    const fileTypeConfig = config.fileTypes.find((ft) => ft.key === fileKey);
    if (!fileTypeConfig) return;
    createFile(fileKey, fileTypeConfig.name);
  };

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Initializing database...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col">
      {/* Path Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-1 text-sm">
          {pathStack.map((folder, index) => (
            <React.Fragment key={folder.path}>
              <button
                onClick={() => navigateToPath(index)}
                className="hover:text-blue-600 transition-colors font-medium"
              >
                {folder.name}
              </button>
              {index < pathStack.length - 1 && <ChevronRight size={16} className="text-gray-400" />}
            </React.Fragment>
          ))}
        </div>

        {/* Create New Button on the right */}
        <button
          onClick={openContextMenu}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <FilePlus2 size={18} />
          Create New
        </button>
      </div>

      {/* Action Buttons - Only View now */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <button
          onClick={openContextMenu}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Eye size={18} />
          View
        </button>
      </div>

      {/* Details Header (only shown in details view) */}
      {viewMode === 'details' && (
        <div className="bg-gray-100 border-b border-gray-200 px-6 py-3">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 text-sm font-semibold text-gray-700">
            <div>Name</div>
            <div>Date Modified</div>
            <div>Type</div>
            <div>Created By</div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <p>This folder is empty</p>
            <p className="text-sm">Click "Create New" to create files or folders</p>
          </div>
        ) : (
          <div className={viewMode === 'details' || viewMode === 'list' ? '' : 'flex flex-wrap'}>
            {items.map((item) => (
              <FileItem
                key={item.id}
                item={item}
                viewMode={viewMode}
                fileTypes={config.fileTypes}
                folderColor={config.folderColor}
                onOpen={openItem}
                onDelete={deleteItem}
                onRename={renameItem}
              />
            ))}

            {/* Plus button at the end of items (only for icon views) */}
            {viewMode !== 'list' && viewMode !== 'details' && (
              <AddItems />
            )}
          </div>
        )}
      </div>

      {/* Context Menu */}
      <ContextMenu
        isOpen={contextMenuOpen}
        onClose={closeContextMenu}
        position={contextMenuPosition}
        fileTypes={config.fileTypes}
        onCreateFolder={createFolder}
        onCreateFile={handleCreateFile}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewChange={setViewMode}
      />
    </div>
  );
};