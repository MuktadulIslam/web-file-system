// src/components/FileSystem/ContextMenu.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Folder, ChevronRight } from 'lucide-react';
import { FileTypeConfig, SortBy, ViewMode } from '@/types';

interface ContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number } | null;
  fileTypes: FileTypeConfig[];
  onCreateFolder: () => void;
  onCreateFile: (fileKey: string) => void;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
  viewMode: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  isOpen,
  onClose,
  position,
  fileTypes,
  onCreateFolder,
  onCreateFile,
  sortBy,
  onSortChange,
  viewMode,
  onViewChange,
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [submenuPosition, setSubmenuPosition] = useState<'right' | 'left' | 'bottom'>('right');
  const menuRef = useRef<HTMLDivElement | null>(null);
  const sortByRef = useRef<HTMLButtonElement | null>(null);
  const viewRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setActiveSubmenu(null);
    }
  }, [isOpen]);

  if (!isOpen || !position) return null;

  const sortOptions: { label: string; value: SortBy }[] = [
    { label: 'Create Time ASC', value: 'created_asc' },
    { label: 'Create Time DESC', value: 'created_desc' },
    { label: 'Name ASC', value: 'name_asc' },
    { label: 'Name DESC', value: 'name_desc' },
  ];

  const viewOptions: { label: string; value: ViewMode }[] = [
    { label: 'Extra Large Icon', value: 'extra_large' },
    { label: 'Large Icon', value: 'large' },
    { label: 'Medium Icon', value: 'medium' },
    { label: 'Small Icon', value: 'small' },
    { label: 'List', value: 'list' },
    { label: 'Details', value: 'details' },
  ];

  const handleSubmenuHover = (submenu: string, buttonRef: React.RefObject<HTMLButtonElement | null>) => {
    if (!buttonRef.current || !menuRef.current) return;

    const menuRect = menuRef.current.getBoundingClientRect();
    const submenuWidth = 200; // Approximate submenu width
    const windowWidth = window.innerWidth;
    const isMobile = windowWidth < 450; // Mobile breakpoint

    if (isMobile) {
      // On mobile, show submenu at bottom
      setSubmenuPosition('bottom');
    } else {
      // Calculate if there's space on the right
      const spaceOnRight = windowWidth - menuRect.right;

      if (spaceOnRight >= submenuWidth + 10) {
        // First priority: enough space on right
        setSubmenuPosition('right');
      } else {
        // Second priority: not enough space on right, show on left
        setSubmenuPosition('left');
      }
    }

    setActiveSubmenu(submenu);
  };

  const handleSubmenuLeave = () => {
    // Small delay to allow moving to submenu
    setTimeout(() => {
      if (!document.querySelector('.submenu:hover') && !document.querySelector('[data-submenu-trigger]:hover')) {
        setActiveSubmenu(null);
      }
    }, 100);
  };

  const getSubmenuClasses = () => {
    const baseClasses = 'absolute z-50 w-full';

    if (submenuPosition === 'right') {
      // First priority: show on right when enough space
      return `${baseClasses} translate-x-full top-0 left-0`;
    } else if (submenuPosition === 'left') {
      // Second priority: show on left when not enough space on right
      return `${baseClasses} -translate-x-full top-0 left-0 flex justify-end`;
    } else {
      // Mobile view: show at bottom
      return `${baseClasses} bottom-0 left-0`;
    }
  };

  const getSubmenuContentClasses = () => {
    if (submenuPosition === 'bottom') {
      return 'w-45 submenu translate-y-full';
    }
    return 'w-45 submenu';
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <div
        ref={menuRef}
        className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-xl min-w-60 max-h-[80vh]"
        style={{
          top: `${position.y}px`,
          left: `${position.x}px`,
        }}
      >
        <div className="relative h-auto w-full">
          <div className="p-2">
            {/* Sort By with Submenu */}
            <div className="relative">
              <button
                ref={sortByRef}
                data-submenu-trigger
                className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 transition-colors flex items-center justify-between"
                onMouseEnter={() => handleSubmenuHover('sortBy', sortByRef)}
                onMouseLeave={handleSubmenuLeave}
              >
                <span>Sort By</span>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            </div>

            {/* View with Submenu */}
            <div className="relative">
              <button
                ref={viewRef}
                data-submenu-trigger
                className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 transition-colors flex items-center justify-between"
                onMouseEnter={() => handleSubmenuHover('view', viewRef)}
                onMouseLeave={handleSubmenuLeave}
              >
                <span>View</span>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            </div>

            <div className="border-t border-gray-200 my-2" />

            {/* New Folder */}
            <button
              className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 transition-colors flex items-center gap-2"
              onClick={() => {
                onCreateFolder();
                onClose();
              }}
            >
              <Folder size={16} />
              New Folder
            </button>

            <div className="border-t border-gray-200 my-2" />

            {/* File Types */}
            <div>
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                Create New
              </div>
              {fileTypes.map((fileType) => {
                const IconComponent = fileType.icon;
                const getInitials = () => {
                  const words = fileType.key.split('-');
                  if (words.length === 1) {
                    return fileType.key.substring(0, 2).toUpperCase();
                  }
                  return (words[0][0] + words[1][0]).toUpperCase();
                };

                return (
                  <button
                    key={fileType.key}
                    className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 transition-colors flex items-center gap-2"
                    onClick={() => {
                      onCreateFile(fileType.key);
                      onClose();
                    }}
                  >
                    {IconComponent ? (
                      <IconComponent size={16} style={{ color: fileType.color }} />
                    ) : (
                      <div
                        className="w-4 h-4 flex items-center justify-center text-[10px] font-bold rounded"
                        style={{
                          backgroundColor: fileType.color || '#ffffff',
                          color: fileType.color ? '#ffffff' : '#000000',
                          border: !fileType.color ? '1px solid #ccc' : 'none',
                        }}
                      >
                        {getInitials()}
                      </div>
                    )}
                    {fileType.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Submenu Positioning */}
          <div className={getSubmenuClasses()}>
            <div className={getSubmenuContentClasses()}>
              {activeSubmenu === 'sortBy' && (
                <div
                  className="bg-white border border-gray-200 rounded-lg shadow-xl w-full mt-2"
                  onMouseEnter={() => setActiveSubmenu('sortBy')}
                  onMouseLeave={handleSubmenuLeave}
                >
                  <div className="p-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 transition-colors ${sortBy === option.value ? 'bg-gray-100 font-medium' : ''
                          }`}
                        onClick={() => {
                          onSortChange(option.value);
                          onClose();
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeSubmenu === 'view' && (
                <div
                  className="bg-white border border-gray-200 rounded-lg shadow-xl w-full mt-10"
                  onMouseEnter={() => setActiveSubmenu('view')}
                  onMouseLeave={handleSubmenuLeave}
                >
                  <div className="p-2">
                    {viewOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 transition-colors ${viewMode === option.value ? 'bg-gray-100 font-medium' : ''
                          }`}
                        onClick={() => {
                          onViewChange(option.value);
                          onClose();
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContextMenu;