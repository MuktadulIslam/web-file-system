import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useFileSystem } from '../FileSystemContext';
import { getItems } from '@/lib/api/fileSystem';

export const useFileSystemItems = () => {
  const { currentFolderId, sortBy, initialized, setItems, setLoading } = useFileSystem();

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['fileSystem', 'items', currentFolderId, sortBy],
    queryFn: () => getItems({ folderId: currentFolderId, sortBy }),
    enabled: initialized, // Only fetch when database is initialized
    refetchOnMount: true,
  });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (isSuccess && data?.success && data.items) {
      setItems(data.items);
    }
  }, [isSuccess, data, setItems]);
};
