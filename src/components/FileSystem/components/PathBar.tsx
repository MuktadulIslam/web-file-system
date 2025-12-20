import React from "react";
import { FaRegFolderClosed } from "react-icons/fa6";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useFileSystem } from "../context/FileSystemContextProvider";

export default function PathBar() {
    const { pathStack, navigateToPath } = useFileSystem()
    return (
        <div className="bg-white border-b border-gray-200 px-3 py-1.5 flex justify-between items-center">
            <div className="flex items-center gap-1 text-sm text-black">
                <FaRegFolderClosed size={16} />
                <span className="text-base font-semibold">:</span>
                {pathStack.map((folder, index) => (
                    <React.Fragment key={folder.path}>
                        <button
                            onClick={() => navigateToPath(index)}
                            className="hover:text-blue-600 transition-colors font-medium"
                        >
                            {folder.name}
                        </button>
                        {index < pathStack.length - 1 && <MdKeyboardArrowRight size={18} className="mt-1" />}
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}