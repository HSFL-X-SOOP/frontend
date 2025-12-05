# Repository Pattern Implementation

This directory implements the **Repository Pattern** for clean separation of API access logic from business logic and UI components.

## Overview

The Repository Pattern provides an abstraction layer for data access operations. Each repository:

- **Encapsulates** API endpoint details
- **Handles** errors consistently
- **Provides** type-safe methods
- **Enables** easy testing and mocking

## Available Repositories

### LocationRepository
Handles all location/harbor-related operations:
```typescript
const repo = useLocationRepository();
const locations = await repo.getAllLocations();
const location = await repo.getLocationById(id);
const imageUrl = repo.getLocationImageUrl(id);
```

### SensorRepository
Handles all sensor data and measurement operations:
```typescript
const repo = useSensorRepository();
const sensors = await repo.getSensorDataNew();
const data = await repo.getSensorDataTimeRange(locationId, '24h');
const chart = await repo.getChartData(locationId, type, '7d');
```

### AuthRepository
Handles authentication operations:
```typescript
const repo = useAuthRepository();
const response = await repo.login({ email, password });
const newResponse = await repo.refreshToken(refreshToken);
await repo.logout();
```

### UserRepository
Handles user profile and preferences:
```typescript
const repo = useUserRepository();
const profile = await repo.getCurrentProfile();
await repo.updateProfile(data);
const prefs = await repo.getPreferences();
```

## Usage in Components

### Old Pattern (Direct HTTP calls)
```typescript
// Before: Mixed concerns
function MyComponent() {
  const httpClient = useHttpClient();

  const fetchData = async () => {
    const response = await httpClient.get('/locations');
    // Error handling, parsing, etc
  };
}
```

### New Pattern (Repository)
```typescript
// After: Clean separation
function MyComponent() {
  const locationRepo = useLocationRepository();

  const fetchData = async () => {
    const locations = await locationRepo.getAllLocations();
    // Already typed, errors handled, ready to use
  };
}
```

## Error Handling

All repositories use consistent error handling:

```typescript
try {
  const location = await repo.getLocationById(id);
  // location is either data or null
} catch (error) {
  // Only thrown for real errors, 404s return null
  // Error is already typed as AppError
}
```

## Memoization

Repository hooks are memoized for performance:

```typescript
// Hook memoizes the repository instance
const repo = useLocationRepository(); // Same instance if httpClient is same
```

## Testing

Repositories are easy to mock in tests:

```typescript
// Mock repository
const mockRepo = {
  getAllLocations: jest.fn().mockResolvedValue([...]),
  getLocationById: jest.fn().mockResolvedValue({...}),
};

// Use in test
render(<MyComponent locationRepo={mockRepo} />);
```

## Migration Guide

### Step 1: Replace store hooks with repositories
```typescript
// Before
const store = useLocationStore();
const locations = await store.getLocations();

// After
const repo = useLocationRepository();
const locations = await repo.getAllLocations();
```

### Step 2: Update error handling
Repositories handle 404s by returning null instead of throwing:
```typescript
// Before
try {
  const location = await store.getLocationById(id);
} catch (error) {
  // Handle 404 specifically
}

// After
const location = await repo.getLocationById(id);
if (!location) {
  // Handle not found case
}
```

## Future Enhancements

- [ ] Add caching layer to repositories
- [ ] Implement offline support
- [ ] Add request interceptors for logging
- [ ] Add retry logic with exponential backoff
- [ ] Add rate limiting

## Architecture

```
Component
    ↓
Repository Hook (useLocationRepository)
    ↓
Repository Class (LocationRepository)
    ↓
BaseRepository (Error handling, common methods)
    ↓
HTTP Client (Axios instance)
    ↓
API Server
```

## Benefits

✅ **Testability**: Easy to mock repositories
✅ **Maintainability**: Changes to API structure only in one place
✅ **Type Safety**: Full TypeScript support
✅ **Consistency**: All repositories follow same pattern
✅ **Error Handling**: Centralized error management
✅ **Scalability**: Easy to add new repositories
