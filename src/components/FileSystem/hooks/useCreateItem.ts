import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { axiosInstance } from '../config/axiosConfig';

interface UseCreateItemProps {
    name: string;
    isFolder: boolean;
    fileKey: string | null;
    parentFolderId: string | null;
    createdBy: string;
    path: string;
}

export const useCreateItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ name, isFolder, fileKey, parentFolderId, createdBy, path }: UseCreateItemProps) => {
            const { data } = await axiosInstance.post('/items', {
                name,
                isFolder,
                fileKey,
                parentFolderId,
                createdBy,
                path
            });
            return data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['folderItems', variables.parentFolderId]
            });
            toast.success(`${variables.isFolder ? 'Folder' : 'File'} created successfully`);
        },
        onError: (error: any) => {
            console.error('Failed to create item:', error);
            const errorMessage = error?.response?.data?.error || error?.message || 'Failed to create item';
            toast.error(errorMessage);
        },
    });
};
