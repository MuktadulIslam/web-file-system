import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { axiosInstance } from '../config/axiosConfig'; // Your axios instance

interface useCreateFolderProps {
    folderName: string;
    parentFolderId: string;
    createdByName: string;
    currentFilePath: string;
}

export const useCreateFolder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ createdByName, currentFilePath, folderName, parentFolderId }: useCreateFolderProps) => {
            const { data } = await axiosInstance.post('/folders', {
                name: folderName,
                isFolder: true,
                fileKey: null,
                parentFolderId,
                createdBy: createdByName,
                path: currentFilePath
            });
            return data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['folderItems', variables.parentFolderId]
            });
        },
        onError: (error: any) => {
            console.error('Failed to create folder:', error);
            const errorMessage = error?.response?.data?.error || error?.message || 'Failed to create folder';
            toast.error(errorMessage);
        },
    });
};