import { useCallback } from 'react';
import { useFileSystem } from '../FileSystemContext';
import { FileSystemItem } from '@/types';

export const useFileSystemNavigation = () => {
  const {
    pathStack,
    setPathStack,
    setCurrentFolderId,
    setCurrentPath
  } = useFileSystem();

  const openItem = useCallback((item: FileSystemItem) => {
    if (item.is_folder) {
      setCurrentFolderId(item.id);
      setCurrentPath(item.path);
      setPathStack([...pathStack, { id: item.id, name: item.name, path: item.path }]);
    } else {
      // Handle file opening - could trigger a modal with the component
      console.log('Open file:', item);
    }
  }, [pathStack, setCurrentFolderId, setCurrentPath, setPathStack]);

  const navigateToPath = useCallback((index: number) => {
    const targetFolder = pathStack[index];
    setCurrentFolderId(targetFolder.id);
    setCurrentPath(targetFolder.path);
    setPathStack(pathStack.slice(0, index + 1));
  }, [pathStack, setCurrentFolderId, setCurrentPath, setPathStack]);

  return {
    openItem,
    navigateToPath,
  };
};
