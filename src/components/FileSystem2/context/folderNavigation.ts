import { FileSystemItem, PathStackItem } from "../types";

interface UseFileSystemNavigationProps {
    pathStack: PathStackItem[];
    setPathStack: React.Dispatch<React.SetStateAction<PathStackItem[]>>;
    setCurrentFolderId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useFileSystemNavigation = ({
    pathStack,
    setPathStack,
    setCurrentFolderId
}: UseFileSystemNavigationProps) => {

    const navigateToFolder = (folder: FileSystemItem) => {
        if (!folder.is_folder) return;

        const newPathStack = [...pathStack, { id: folder.id, name: folder.name, path: folder.path }];
        setPathStack(newPathStack);
        setCurrentFolderId(folder.id);

        // Create URL-friendly path: home/folder-1/folder-2
        const urlPath = newPathStack.map(p => p.name).join('/');

        // Create IDs string: null,id1,id2 (store all IDs in order)
        const urlIds = newPathStack.map(p => p.id ?? 'null').join(',');

        const params = new URLSearchParams(window.location.search);
        params.set('folderId', folder.id ?? '');
        params.set('path', urlPath);
        params.set('ids', urlIds);
        window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    };

    const navigateToPath = (index: number) => {
        const targetFolder = pathStack[index];

        const newPathStack = pathStack.slice(0, index + 1);
        setPathStack(newPathStack);
        setCurrentFolderId(targetFolder.id);

        // Create URL-friendly path: home/folder-1/folder-2
        const urlPath = newPathStack.map(p => p.name).join('/');

        // Create IDs string: null,id1,id2 (store all IDs in order)
        const urlIds = newPathStack.map(p => p.id ?? 'null').join(',');

        const params = new URLSearchParams(window.location.search);
        if (targetFolder.id === null) {
            params.delete('folderId');
            params.delete('path');
            params.delete('ids');
        } else {
            params.set('folderId', targetFolder.id);
            params.set('path', urlPath);
            params.set('ids', urlIds);
        }
        const newUrl = targetFolder.id === null
            ? window.location.pathname
            : `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({}, '', newUrl);
    };

    return {
        navigateToFolder,
        navigateToPath,
    };
}