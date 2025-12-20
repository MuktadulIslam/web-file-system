'use client"'
import { useEffect } from "react";
import { useFileSystem } from "../context/FileSystemContextProvider";
import { PathStackItem } from "../types";

export const useSyncURLParams = () => {
    const { setCurrentFolderId, setPathStack } = useFileSystem()
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const folderIdFromUrl = params.get('folderId');
        const pathFromUrl = params.get('path');
        const idsFromUrl = params.get('ids');

        if (folderIdFromUrl && pathFromUrl && idsFromUrl) {
            setCurrentFolderId(folderIdFromUrl);

            // Reconstruct path stack from the path string and IDs
            // Example path: "home/Documents/Projects"
            // Example ids: "null,id1,id2"
            const pathParts = pathFromUrl.split('/').filter(p => p);
            const idParts = idsFromUrl.split(',');

            // Build the path stack by parsing the path and IDs
            const reconstructedPathStack: PathStackItem[] = [];

            let currentPath = '';
            for (let i = 0; i < pathParts.length; i++) {
                currentPath += pathParts[i] + '/';

                reconstructedPathStack.push({
                    id: idParts[i] === 'null' ? null : idParts[i],
                    name: pathParts[i],
                    path: currentPath
                });
            }

            setPathStack(reconstructedPathStack);
        } else if (folderIdFromUrl) {
            setCurrentFolderId(folderIdFromUrl);
        }
    }, []);
}