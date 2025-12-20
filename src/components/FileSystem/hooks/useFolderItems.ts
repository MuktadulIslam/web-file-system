import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../config/axiosConfig';

export const useFolderItems = (folderId: string | null) => {
    return useQuery({
        queryKey: ['folderItems', folderId],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/items', {
                params: { folderId },
            });
            return data;
        }
    });
};