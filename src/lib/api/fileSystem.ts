// File System API Service
// All API calls related to file system operations

import { FileSystemItem, SortBy } from '@/types';
import { apiFetch, buildUrl } from './config';

// Response types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

interface InitResponse {
  success: boolean;
  message?: string;
}

interface ItemsResponse {
  success: boolean;
  items: FileSystemItem[];
}

interface ItemResponse {
  success: boolean;
  item: FileSystemItem;
}

// Request types
interface CreateItemRequest {
  name: string;
  isFolder: boolean;
  fileKey: string | null;
  parentFolderId: string | null;
  createdBy: string;
  path: string;
}

interface UpdateItemRequest {
  id: string;
  name: string;
  updatedBy: string;
  newPath: string;
}

interface GetItemsParams {
  folderId?: string | null;
  sortBy: SortBy;
}

// API Functions

/**
 * Initialize the database
 */
export const initializeDatabase = async (): Promise<InitResponse> => {
  return apiFetch<InitResponse>('/init');
};

/**
 * Get items in a folder
 */
export const getItems = async (params: GetItemsParams): Promise<ItemsResponse> => {
  const queryParams: Record<string, string> = {
    sortBy: params.sortBy,
  };

  if (params.folderId) {
    queryParams.folderId = params.folderId;
  }

  const url = buildUrl('/items', queryParams);
  return apiFetch<ItemsResponse>(url);
};

/**
 * Create a new item (file or folder)
 */
export const createItem = async (data: CreateItemRequest): Promise<ItemResponse> => {
  return apiFetch<ItemResponse>('/items', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Delete an item
 */
export const deleteItem = async (id: string): Promise<ApiResponse<void>> => {
  return apiFetch<ApiResponse<void>>(`/items?id=${id}`, {
    method: 'DELETE',
  });
};

/**
 * Update/rename an item
 */
export const updateItem = async (data: UpdateItemRequest): Promise<ItemResponse> => {
  return apiFetch<ItemResponse>('/items', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};
