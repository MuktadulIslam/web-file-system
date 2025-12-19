import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useFileSystem } from '../FileSystemContext';
import { initializeDatabase } from '@/lib/api/fileSystem';

export const useFileSystemInit = () => {
  const { setInitialized } = useFileSystem();

  const { data, isSuccess } = useQuery({
    queryKey: ['fileSystem', 'init'],
    queryFn: initializeDatabase,
    staleTime: Infinity, // Only run once
    retry: 3,
  });

  useEffect(() => {
    if (isSuccess && data?.success) {
      setInitialized(true);
    }
  }, [isSuccess, data, setInitialized]);
};
