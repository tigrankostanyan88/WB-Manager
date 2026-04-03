/**
 * Application Configuration
 * Centralized configuration for magic numbers and constants
 */

module.exports = {
    // JWT Configuration
    JWT: {
        EXPIRES_IN_DAYS_REMEMBER: 60,
        EXPIRES_IN_DAYS_DEFAULT: 1,
        MIN_SECRET_LENGTH: 32,
    },

    // Password Security
    PASSWORD: {
        MIN_LENGTH: 6,
        BCRYPT_ROUNDS: 10,
    },

    // Rate Limiting
    RATE_LIMIT: {
        GENERAL_MAX: 5000,
        GENERAL_WINDOW_MS: 60 * 60 * 1000, // 1 hour
        AUTH_MAX: 5,
        AUTH_WINDOW_MS: 60 * 60 * 1000, // 1 hour
        READ_MAX: 5000,
        READ_WINDOW_MS: 60 * 1000, // 1 minute
    },

    // File Upload Limits
    UPLOAD: {
        MAX_FILE_SIZE: 1000 * 1024 * 1024, // 1GB
        MAX_BODY_SIZE: '10kb',
    },

    // File Type Configurations
    FILE_TYPES: {
        IMAGE: {
            types: ['jpeg', 'png', 'gif', 'webp', 'svg'],
            maxSize: 50 * 1024 * 1024, // 50MB
        },
        VIDEO: {
            types: ['mp4', 'mkv', 'avi', 'mov', 'webm'],
            maxSize: 1000 * 1024 * 1024, // 1GB
        },
        AUDIO: {
            types: ['mp3', 'wav', 'ogg'],
            maxSize: 50 * 1024 * 1024, // 50MB
        },
        DOCUMENT: {
            types: ['pdf', 'zip'],
            maxSize: 50 * 1024 * 1024, // 50MB
        },
    },

    // Image Dimensions for Different Use Cases
    IMAGE_DIMENSIONS: {
        COURSES: {
            large: [1280, 720],
            small: [640, 360],
        },
        INSTRUCTORS: {
            large: [800, 800],
        },
        SETTINGS: {
            large: [300, 300],
        },
        USERS: {
            large: [200, 200],
        },
    },

    // Cache Durations
    CACHE: {
        STATIC_MAX_AGE: '1y',
        COOKIE_LOGOUT_EXPIRES: 2 * 1000, // 2 seconds
    },

    // Password Reset
    PASSWORD_RESET: {
        TOKEN_EXPIRES_MS: 10 * 60 * 1000, // 10 minutes
    },

    // Compression
    COMPRESSION: {
        LEVEL: 6, // 0-9, higher = more compression but slower
    },

    // Pagination
    PAGINATION: {
        DEFAULT_LIMIT: 10,
        MAX_LIMIT: 100,
    },
};
