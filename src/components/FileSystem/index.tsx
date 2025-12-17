// src/components/FileSystem/index.tsx

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, ChevronRight, Eye, FilePlus2 } from 'lucide-react';
import { FileSystemConfig, FileSystemItem, SortBy, ViewMode } from '@/types';
import ContextMenu from './ContextMenu';
import FileItem from './FileItem';

interface FileSystemProps {
  config: FileSystemConfig;
}

const FileSystem: React.FC<FileSystemProps> = ({ config }) => {
  const [items, setItems] = useState<FileSystemItem[]>([]);
  const [currentPath, setCurrentPath] = useState(':home/');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>('name_asc');
  const [viewMode, setViewMode] = useState<ViewMode>('large');
  const [loading, setLoading] = useState(true);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [pathStack, setPathStack] = useState<{ id: string | null; name: string; path: string }[]>([
    { id: null, name: ':home', path: ':home/' },
  ]);
  const [initialized, setInitialized] = useState(false);

  const defaultUserId = config.defaultUserId || 'user';

  // Initialize database on mount
  useEffect(() => {
    const initDB = async () => {
      try {
        const response = await fetch('/api/init');
        const data = await response.json();
        if (data.success) {
          setInitialized(true);
        }
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };
    
    initDB();
  }, []);

  // Fetch items whenever currentFolderId or sortBy changes
  useEffect(() => {
    if (!initialized) return;
    
    const fetchItems = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          sortBy,
          ...(currentFolderId && { folderId: currentFolderId }),
        });

        const response = await fetch(`/api/items?${params}`);
        const data = await response.json();

        if (data.success) {
          setItems(data.items);
        }
      } catch (error) {
        console.error('Failed to fetch items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [currentFolderId, sortBy, initialized]);

  const openContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuOpen(true);
  };

  const closeContextMenu = () => {
    setContextMenuOpen(false);
    setContextMenuPosition(null);
  };

  const createFolder = async () => {
    const name = prompt('Enter folder name:');
    if (!name) return;

    const path = currentPath + name + '/';

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          isFolder: true,
          fileKey: null,
          parentFolderId: currentFolderId,
          createdBy: defaultUserId,
          path,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setItems([...items, data.item]);
      }
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  const createFile = async (fileKey: string) => {
    const fileTypeConfig = config.fileTypes.find((ft) => ft.key === fileKey);
    if (!fileTypeConfig) return;

    const name = prompt(`Enter ${fileTypeConfig.name} name:`);
    if (!name) return;

    const path = currentPath + name;

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          isFolder: false,
          fileKey,
          parentFolderId: currentFolderId,
          createdBy: defaultUserId,
          path,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setItems([...items, data.item]);
      }
    } catch (error) {
      console.error('Failed to create file:', error);
    }
  };

  const openItem = (item: FileSystemItem) => {
    if (item.is_folder) {
      setCurrentFolderId(item.id);
      setCurrentPath(item.path);
      setPathStack([...pathStack, { id: item.id, name: item.name, path: item.path }]);
    } else {
      // Handle file opening - could trigger a modal with the component
      console.log('Open file:', item);
    }
  };

  const navigateToPath = (index: number) => {
    const targetFolder = pathStack[index];
    setCurrentFolderId(targetFolder.id);
    setCurrentPath(targetFolder.path);
    setPathStack(pathStack.slice(0, index + 1));
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/items?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setItems(items.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const renameItem = async (item: FileSystemItem) => {
    const newName = prompt('Enter new name:', item.name);
    if (!newName || newName === item.name) return;

    const pathParts = item.path.split('/');
    pathParts[pathParts.length - (item.is_folder ? 2 : 1)] = newName;
    const newPath = pathParts.join('/');

    try {
      const response = await fetch('/api/items', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          name: newName,
          updatedBy: defaultUserId,
          newPath,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setItems(items.map((i) => (i.id === item.id ? data.item : i)));
      }
    } catch (error) {
      console.error('Failed to rename item:', error);
    }
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
              <button
                onClick={openContextMenu}
                className="inline-flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded group cursor-pointer"
                style={{
                  width: viewMode === 'extra_large' ? '250px' : 
                         viewMode === 'large' ? '200px' : 
                         viewMode === 'medium' ? '150px' : '120px',
                  marginRight: viewMode === 'extra_large' ? '60px' : 
                              viewMode === 'large' ? '50px' : 
                              viewMode === 'medium' ? '40px' : '30px',
                  marginBottom: '20px',
                }}
              >
                <div 
                  className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg group-hover:border-blue-500 group-hover:bg-blue-50 transition-colors"
                  style={{
                    width: viewMode === 'extra_large' ? '80px' : 
                           viewMode === 'large' ? '64px' : 
                           viewMode === 'medium' ? '48px' : '32px',
                    height: viewMode === 'extra_large' ? '80px' : 
                            viewMode === 'large' ? '64px' : 
                            viewMode === 'medium' ? '48px' : '32px',
                  }}
                >
                  <Plus 
                    size={viewMode === 'extra_large' ? 32 : 
                          viewMode === 'large' ? 24 : 
                          viewMode === 'medium' ? 20 : 16} 
                    className="text-gray-400 group-hover:text-blue-500" 
                  />
                </div>
                <span className="text-sm mt-2 text-gray-500 group-hover:text-blue-600">Add New</span>
              </button>
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
        onCreateFile={createFile}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewChange={setViewMode}
      />
    </div>
  );
};

export default FileSystem;