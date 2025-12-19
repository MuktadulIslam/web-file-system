# API Configuration Documentation

This directory contains all API-related configuration and service functions for the File System application.

## Structure

```
src/lib/api/
├── config.ts          # API configuration, base URL, headers, and fetch wrapper
├── fileSystem.ts      # File system API endpoints
├── index.ts           # Barrel export for easy imports
└── README.md          # This file
```

## Configuration

### Environment Variables

The API configuration uses environment variables for flexibility. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=/api  # Default: '/api' for same-origin requests
```

### API Config (`config.ts`)

The `getApiConfig()` function provides centralized configuration:

- **Base URL**: Configurable via `NEXT_PUBLIC_API_BASE_URL`
- **Headers**: Default `Content-Type: application/json`
- **Authentication**: Automatically adds `Authorization` header from localStorage

#### Example: Adding Auth Headers

```typescript
// Authentication token is automatically added from localStorage
localStorage.setItem('authToken', 'your-jwt-token');

// All subsequent API calls will include:
// Authorization: Bearer your-jwt-token
```

## API Services

### File System API (`fileSystem.ts`)

All file system operations:

| Function | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| `initializeDatabase()` | GET | `/api/init` | Initialize database |
| `getItems(params)` | GET | `/api/items` | Fetch items in folder |
| `createItem(data)` | POST | `/api/items` | Create file/folder |
| `deleteItem(id)` | DELETE | `/api/items?id={id}` | Delete item |
| `updateItem(data)` | PATCH | `/api/items` | Update/rename item |

### Usage Example

```typescript
import { getItems, createItem } from '@/lib/api/fileSystem';

// Fetch items
const result = await getItems({ folderId: '123', sortBy: 'name_asc' });

// Create folder
const newFolder = await createItem({
  name: 'My Folder',
  isFolder: true,
  fileKey: null,
  parentFolderId: '123',
  createdBy: 'user1',
  path: ':home/My Folder/',
});
```

## React Query Integration

All API calls are wrapped in React Query hooks for:
- ✅ Automatic caching
- ✅ Background refetching
- ✅ Optimistic updates
- ✅ Error handling
- ✅ Loading states

### Query Keys Convention

```typescript
['fileSystem', 'init']                              // Database initialization
['fileSystem', 'items', folderId, sortBy]           // Items list
```

## Future: Separating Backend

When the backend is separated to a different server:

### 1. Update Environment Variable

```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://api.yourbackend.com
```

### 2. Configure CORS on Backend

Ensure your backend allows requests from your frontend domain:

```javascript
// Express.js example
app.use(cors({
  origin: 'https://yourfrontend.com',
  credentials: true
}));
```

### 3. Add Authentication

The config already supports auth tokens:

```typescript
// Login flow
const login = async (credentials) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
  const { token } = await response.json();

  // Store token - automatically used in all subsequent requests
  localStorage.setItem('authToken', token);
};
```

### 4. Update API Service Functions (if needed)

If your backend uses different endpoints or response formats:

```typescript
// fileSystem.ts
export const getItems = async (params: GetItemsParams): Promise<ItemsResponse> => {
  // Update endpoint path if needed
  const url = buildUrl('/v1/filesystem/items', queryParams);
  return apiFetch<ItemsResponse>(url);
};
```

## Error Handling

The `apiFetch` wrapper automatically handles:
- HTTP errors (throws on non-2xx responses)
- JSON parsing
- Header injection

Custom error handling in hooks:

```typescript
const { data, error, isError } = useQuery({
  queryKey: ['fileSystem', 'items'],
  queryFn: () => getItems({ sortBy: 'name_asc' }),
  onError: (error) => {
    console.error('Failed to fetch items:', error);
    // Show toast notification, etc.
  }
});
```

## Best Practices

1. **Always use API service functions** - Never call `fetch` directly in components
2. **Use React Query hooks** - Leverage caching and automatic refetching
3. **Centralize configuration** - All config changes should go through `config.ts`
4. **Type safety** - All API functions have TypeScript interfaces
5. **Error handling** - Handle errors in React Query callbacks

## Adding New API Endpoints

1. Add TypeScript interfaces in `fileSystem.ts`:
```typescript
interface NewFeatureRequest {
  // request payload
}

interface NewFeatureResponse {
  // response data
}
```

2. Add API function:
```typescript
export const newFeature = async (data: NewFeatureRequest): Promise<NewFeatureResponse> => {
  return apiFetch<NewFeatureResponse>('/new-endpoint', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
```

3. Create React Query hook:
```typescript
// hooks/useNewFeature.ts
export const useNewFeature = () => {
  return useMutation({
    mutationFn: newFeature,
    onSuccess: (data) => {
      // Handle success
    }
  });
};
```

4. Use in component:
```typescript
const { mutate, isLoading } = useNewFeature();
```
