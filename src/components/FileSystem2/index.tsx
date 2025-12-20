'use client'
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import { useFolderItems } from "./hooks/useFolderItems";
import { ChevronRight, Eye, FilePlus2 } from "lucide-react";
import { FileSystemContextProvider } from "./context/FileSystemContextProvider";
import { FileSystemConfig } from "./types";
import { useFileSystem } from "./context/FileSystemContextProvider";
import FileItem from "./components/FileItem";
import ContextMenu from "./components/FileContextMenu";
import { ReactQueryProvider } from "./QueryClientProvider";
import { useSyncURLParams } from "./hooks/useSyncURLParams";
import AddItems from "./components/AddItems";
import { useRenameItem } from "./hooks/useRenameItem";

export default function FileSystem({ config }: { config: FileSystemConfig }) {
    return (
        <ReactQueryProvider>
            <Toaster position="top-right" />
            <FileSystemContextProvider config={config}>
                <FileSystemInner />
            </FileSystemContextProvider>
        </ReactQueryProvider>
    );
}

function FileSystemInner() {
    const { currentFolderId, pathStack, items, setItems, config, viewMode, openContextMenu, navigateToPath, openFile, openedFile, closeFile } = useFileSystem()
    const { data, isLoading, isError, error } = useFolderItems(currentFolderId);
    const renameMutation = useRenameItem();

    useSyncURLParams();

    const handleRename = (itemId: string, newName: string) => {
        console.log("Renaming item:", itemId, newName);
        renameMutation.mutate({
            itemId,
            newName,
            createdByName: config.username,
            parentFolderId: currentFolderId
        });
    };


    useEffect(() => {
        if (data) setItems(data.items)
    }, [data]);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error.message}</div>;

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
                {isLoading ? (
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

                        {/* Render existing items */}
                        {items.map((item) => (
                            <FileItem
                                key={item.id}
                                item={item}
                                viewMode={viewMode}
                                fileTypes={config.fileTypes}
                                folderColor={config.folderColor}
                                allItems={items}
                                onOpen={() => { }}
                                onDelete={() => { }}
                                onRename={handleRename}
                            />
                        ))}

                        <AddItems />
                    </div>
                )}
            </div>

            {/* Context Menu */}
            <ContextMenu
                onCreateFolder={() => { }}
                onCreateFile={() => { }}
            />
        </div>
    );
}