import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { axiosInstance } from '../config/axiosConfig';

interface UseRenameItemProps {
    itemId: string;
    newName: string;
    createdByName: string;
    parentFolderId?: string | null;
}

export const useRenameItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ itemId, newName, createdByName, parentFolderId }: UseRenameItemProps) => {
            const { data } = await axiosInstance.patch(`/items/${itemId}`, {
                newname: newName,
                updatedBy: createdByName,
            });
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['folderItems', variables.parentFolderId]
            });
            toast.success('Item renamed successfully');
        },
        onError: (error: any) => {
            console.error('Failed to rename item:', error);
            const errorMessage = error?.response?.data?.error || error?.message || 'Failed to rename item';
            toast.error(errorMessage);
        },
    });
};
