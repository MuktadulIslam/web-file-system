import { Plus } from 'lucide-react';
import { useFileSystem } from './FileSystemContext';

function openContextMenu() {
    // Logic to open context menu for adding new items
    console.log('Open context menu to add new items');
}

export default function AddItems() {
    const { viewMode, contextMenuOpen } = useFileSystem();
    return <button
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
    </button>;
}