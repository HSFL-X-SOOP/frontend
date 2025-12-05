/**
 * Repository Pattern Implementation
 *
 * This module provides a clean separation of concerns between API access
 * and business logic. Each repository handles a specific domain:
 *
 * - LocationRepository: Location/harbor data
 * - SensorRepository: Sensor measurements and data
 * - AuthRepository: Authentication and authorization
 * - UserRepository: User profile and preferences
 *
 * Benefits:
 * - Easier to test (mock repositories in tests)
 * - Consistent error handling
 * - Centralized API endpoint definitions
 * - Easy to swap implementations (cache, offline support, etc)
 * - Type-safe API operations
 */

export { BaseRepository } from './base.repository';
export { LocationRepository, useLocationRepository } from './location.repository';
export { SensorRepository, useSensorRepository } from './sensor.repository';
export { AuthRepository, useAuthRepository } from './auth.repository';
export { UserRepository, useUserRepository } from './user.repository';

export type { BaseRepository };
