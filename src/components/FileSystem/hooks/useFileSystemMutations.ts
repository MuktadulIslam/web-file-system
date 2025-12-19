import { useCallback } from 'react';
import { useFileSystem } from '../FileSystemContext';
import { FileSystemItem } from '@/types';

export const useFileSystemMutations = (defaultUserId: string) => {
  const { items, setItems, currentPath, currentFolderId } = useFileSystem();

  const createFolder = useCallback(async () => {
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
  }, [currentPath, currentFolderId, defaultUserId, items, setItems]);

  const createFile = useCallback(async (fileKey: string, fileTypeName: string) => {
    const name = prompt(`Enter ${fileTypeName} name:`);
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
  }, [currentPath, currentFolderId, defaultUserId, items, setItems]);

  const deleteItem = useCallback(async (id: string) => {
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
  }, [items, setItems]);

  const renameItem = useCallback(async (item: FileSystemItem) => {
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
  }, [defaultUserId, items, setItems]);

  return {
    createFolder,
    createFile,
    deleteItem,
    renameItem,
  };
};
