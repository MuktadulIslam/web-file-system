import { FileTypeConfig, ViewMode } from "../../types";
import { getIconSize } from "./getSizeForViewMode";

interface ItemIconProps {
    isFolder: boolean;
    fileTypeConfig: FileTypeConfig | null | undefined;
    viewMode: ViewMode;
    folderColor?: string;
}

export default function ItemIcon({ isFolder, fileTypeConfig, viewMode, folderColor = '#FFA500' }: ItemIconProps) {
    const iconSize = getIconSize(viewMode);

    if (isFolder) {
        // Render folder as SVG with 3D look
        return (
            <div style={{ width: `${iconSize}px`, height: `${iconSize}px` }}>
                <svg
                    width={iconSize}
                    height={iconSize}
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Folder back */}
                    <path
                        d="M10 25 L10 85 C10 88 12 90 15 90 L85 90 C88 90 90 88 90 85 L90 30 C90 27 88 25 85 25 Z"
                        fill={folderColor}
                        opacity="0.9"
                    />
                    {/* Folder tab */}
                    <path
                        d="M10 25 L10 20 C10 17 12 15 15 15 L35 15 L42 22 L85 22 C88 22 90 24 90 27 L90 30 L10 30 Z"
                        fill={folderColor}
                    />
                    {/* Folder front highlight */}
                    <path
                        d="M15 25 L15 85 C15 87 16 88 18 88 L85 88 C87 88 88 87 88 85 L88 30 Z"
                        fill="white"
                        opacity="0.1"
                    />
                </svg>
            </div>
        );
    }

    // Render file with paper-like appearance
    const IconComponent = fileTypeConfig?.icon;
    const contentIconSize = iconSize * 0.5;
     const getInitials = () => {
        if (!fileTypeConfig || !fileTypeConfig.key) return '';
        const words = fileTypeConfig.key.split('-');
        if (words.length === 1) {
            return fileTypeConfig.key.substring(0, 2).toUpperCase();
        }
        return (words[0][0] + words[1][0]).toUpperCase();
    };

    return (
        <div style={{ width: `${iconSize}px`, height: `${iconSize}px`, position: 'relative' }}>
            <svg
                width={iconSize}
                height={iconSize}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Paper/file shape - made wider */}
                <path
                    d="M15 5 L70 5 L85 20 L85 95 L15 95 Z"
                    fill="white"
                    stroke="#d1d5db"
                    strokeWidth="2"
                />
                {/* Folded corner */}
                <path
                    d="M70 5 L70 20 L85 20 Z"
                    fill="#e5e7eb"
                    stroke="#d1d5db"
                    strokeWidth="2"
                />
                {/* Color accent at top */}
                <rect
                    x="15"
                    y="5"
                    width="55"
                    height="8"
                    fill={fileTypeConfig?.color || '#9ca3af'}
                    opacity="0.7"
                />
            </svg>

            {/* Icon or initials inside the file */}
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {IconComponent ? (
                    <IconComponent size={contentIconSize} style={{ color: fileTypeConfig.color }} />
                ) : (
                    <div
                        className="flex items-center justify-center font-bold rounded"
                        style={{
                            width: `${contentIconSize}px`,
                            height: `${contentIconSize}px`,
                            fontSize: `${contentIconSize / 2.5}px`,
                            backgroundColor: fileTypeConfig?.color || '#ffffff',
                            color: fileTypeConfig?.color ? '#ffffff' : '#000000',
                            border: !fileTypeConfig?.color ? '1px solid #ccc' : 'none',
                        }}
                    >
                        {getInitials()}
                    </div>
                )}
            </div>
        </div>
    );
}