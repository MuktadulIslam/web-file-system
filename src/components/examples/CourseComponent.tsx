// src/components/examples/CourseComponent.tsx

'use client';

import React from 'react';

interface CourseComponentProps {
    itemId: string;
    onClose: () => void;
}

const CourseComponent: React.FC<CourseComponentProps> = ({ itemId, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Course Editor</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Course Title</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="Enter course title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            rows={4}
                            placeholder="Enter course description"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Duration (hours)</label>
                        <input
                            type="number"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="Enter duration"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Instructor</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="Enter instructor name"
                        />
                    </div>

                    <div className="flex gap-2 justify-end pt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Save Course
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseComponent;