import { BsScissors } from "react-icons/bs";
import { useFileSystem } from "../context/FileSystemContextProvider";
import { MdOutlineFileCopy, MdOutlineEditCalendar } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import { RiArrowUpDownFill } from "react-icons/ri";
import { HiOutlineEye } from "react-icons/hi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { RiFileAddLine } from "react-icons/ri";

export default function Toolbar() {
    const { viewMode, setViewMode, sortBy, setSortBy, openContextMenu } = useFileSystem();
    
    return (
        <div className="bg-white border-b border-gray-200 pr-3 py-1 flex items-center justify-between">
            {/* Left side actions */}
            <div className="flex items-center gap-1 text-gray-700">
                <button
                    className="py-1.5 px-4 hover:bg-gray-100 rounded transition-colors"
                    title="Cut"
                >
                    <BsScissors size={18}/>
                </button>
                <button
                    className="py-1.5 px-4 hover:bg-gray-100 rounded transition-colors"
                    title="Copy"
                >
                    <MdOutlineFileCopy size={18}/>
                </button>
                <button
                    className="py-1.5 px-4 hover:bg-gray-100 rounded transition-colors"
                    title="Rename"
                >
                    <MdOutlineEditCalendar size={18}/>
                </button>
                <button
                    className="py-1.5 px-4 hover:bg-gray-100 rounded transition-colors"
                    title="Delete"
                >
                    <FaRegTrashAlt size={18}/>
                </button>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3 text-sm font-semibold">
                <button
                    onClick={openContextMenu}
                    className="flex items-center gap-2 px-3 py-1 leading-2 bg-white border border-gray-300 text-gray-600 rounded hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm"
                >
                    <RiFileAddLine size={18} />
                    Add New
                </button>

                {/* View Dropdown */}
                <div className="relative group">
                    <button
                        className="flex items-center gap-2 px-3 py-1 leading-2 bg-white border border-gray-300 text-gray-600 rounded hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm"
                    >
                        <HiOutlineEye size={18} />
                        <span>View</span>
                        <MdKeyboardArrowDown size={18} className="transition-transform group-hover:rotate-180" />
                    </button>

                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="p-2 font-medium">
                            {[
                                { label: 'Extra Large Icon', value: 'extra_large' as const },
                                { label: 'Large Icon', value: 'large' as const },
                                { label: 'Medium Icon', value: 'medium' as const },
                                { label: 'Small Icon', value: 'small' as const },
                                { label: 'List', value: 'list' as const },
                                { label: 'Details', value: 'details' as const },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    className={`w-full text-left px-3 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors ${
                                        viewMode === option.value ? 'bg-gray-100 font-medium text-gray-900' : 'text-gray-700'
                                    }`}
                                    onClick={() => setViewMode(option.value)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sort Dropdown */}
                <div className="relative group">
                    <button
                        className="flex items-center gap-2 px-3 py-1 leading-2 bg-white border border-gray-300 text-gray-600 rounded hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm"
                    >
                        <RiArrowUpDownFill size={16} />
                        Sort
                        <MdKeyboardArrowDown size={18} className="transition-transform group-hover:rotate-180" />
                    </button>

                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="p-2 font-medium">
                            {[
                                { label: 'Create Time ASC', value: 'created_asc' as const },
                                { label: 'Create Time DESC', value: 'created_desc' as const },
                                { label: 'Name ASC', value: 'name_asc' as const },
                                { label: 'Name DESC', value: 'name_desc' as const },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    className={`w-full text-left px-3 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors ${
                                        sortBy === option.value ? 'bg-gray-100 font-medium text-gray-900' : 'text-gray-700'
                                    }`}
                                    onClick={() => setSortBy(option.value)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}