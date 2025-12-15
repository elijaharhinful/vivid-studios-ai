/**
 * System Messages
 * Centralized message constants for success, error, and info messages
 * Used across backend and can be imported in frontend
 */

export const SYSTEM_MESSAGES = {
  // ==================== AUTH MESSAGES ====================
  AUTH: {
    SUCCESS: {
      SIGNUP: 'User registered successfully',
      LOGIN: 'Login successful',
      LOGOUT: 'Logout successful',
      TOKEN_REFRESHED: 'Token refreshed successfully',
      PASSWORD_RESET_REQUESTED: 'If the email exists, a password reset link has been sent',
      PASSWORD_RESET_SUCCESS: 'Password successfully reset',
      EMAIL_VERIFIED: 'Email verified successfully',
      GOOGLE_AUTH_SUCCESS: 'Google authentication successful',
    },
    ERROR: {
      INVALID_CREDENTIALS: 'Invalid email or password',
      USER_EXISTS: 'User with this email or username already exists',
      USER_NOT_FOUND: 'User not found',
      INVALID_TOKEN: 'Invalid or expired token',
      INVALID_RESET_TOKEN: 'Invalid or expired reset token',
      UNAUTHORIZED: 'Unauthorized access',
      FORBIDDEN: 'You do not have permission to perform this action',
      SESSION_EXPIRED: 'Your session has expired. Please login again',
      EMAIL_NOT_VERIFIED: 'Please verify your email before logging in',
      GOOGLE_AUTH_FAILED: 'Google authentication failed',
      INVALID_GOOGLE_TOKEN: 'Invalid Google ID token',
    },
  },

  // ==================== USER MESSAGES ====================
  USER: {
    SUCCESS: {
      CREATED: 'User created successfully',
      UPDATED: 'User updated successfully',
      DELETED: 'User deleted successfully',
      PROFILE_UPDATED: 'Profile updated successfully',
      AVATAR_UPLOADED: 'Avatar uploaded successfully',
    },
    ERROR: {
      NOT_FOUND: 'User not found',
      USERNAME_TAKEN: 'Username already taken',
      EMAIL_TAKEN: 'Email already in use',
      INVALID_USER_ID: 'Invalid user ID',
      CANNOT_DELETE_SELF: 'You cannot delete your own account',
      INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
    },
  },

  // ==================== CHARACTER MESSAGES ====================
  CHARACTER: {
    SUCCESS: {
      CREATED: 'Character created successfully',
      UPDATED: 'Character updated successfully',
      DELETED: 'Character deleted successfully',
      TRAINING_STARTED: 'Character training started',
      TRAINING_COMPLETED: 'Character training completed successfully',
    },
    ERROR: {
      NOT_FOUND: 'Character not found',
      TRAINING_FAILED: 'Character training failed',
      TRAINING_IN_PROGRESS: 'Character is already being trained',
      INSUFFICIENT_IMAGES: 'Insufficient training images. Please upload at least 5 images',
      INVALID_CHARACTER_ID: 'Invalid character ID',
      NOT_OWNER: 'You do not own this character',
    },
  },

  // ==================== IMAGE MESSAGES ====================
  IMAGE: {
    SUCCESS: {
      UPLOADED: 'Image uploaded successfully',
      DELETED: 'Image deleted successfully',
      FAVORITED: 'Image added to favorites',
      UNFAVORITED: 'Image removed from favorites',
      TAGGED: 'Tags added successfully',
      UNTAGGED: 'Tags removed successfully',
    },
    ERROR: {
      NOT_FOUND: 'Image not found',
      UPLOAD_FAILED: 'Image upload failed',
      INVALID_FORMAT: 'Invalid image format. Supported formats: JPG, PNG, WEBP',
      FILE_TOO_LARGE: 'File size exceeds maximum limit of 10MB',
      INVALID_DIMENSIONS: 'Image dimensions must be between 512x512 and 2048x2048',
    },
  },

  // ==================== GENERATION MESSAGES ====================
  GENERATION: {
    SUCCESS: {
      STARTED: 'Image generation started',
      COMPLETED: 'Image generation completed successfully',
      CANCELLED: 'Generation cancelled successfully',
    },
    ERROR: {
      FAILED: 'Image generation failed',
      INSUFFICIENT_CREDITS: 'Insufficient credits. Please purchase more credits or upgrade your plan',
      INVALID_PROMPT: 'Invalid prompt. Please provide a valid description',
      SESSION_NOT_FOUND: 'Generation session not found',
      ALREADY_COMPLETED: 'Generation session already completed',
      CANNOT_CANCEL: 'Cannot cancel completed or failed generation',
      QUEUE_FULL: 'Generation queue is full. Please try again later',
    },
  },

  // ==================== REFINEMENT MESSAGES ====================
  REFINEMENT: {
    SUCCESS: {
      STARTED: 'Image refinement started',
      COMPLETED: 'Image refinement completed successfully',
      CANCELLED: 'Refinement cancelled successfully',
    },
    ERROR: {
      FAILED: 'Image refinement failed',
      NOT_FOUND: 'Refinement job not found',
      INSUFFICIENT_CREDITS: 'Insufficient credits for refinement',
      INVALID_TYPE: 'Invalid refinement type',
    },
  },

  // ==================== COLLECTION MESSAGES ====================
  COLLECTION: {
    SUCCESS: {
      CREATED: 'Collection created successfully',
      UPDATED: 'Collection updated successfully',
      DELETED: 'Collection deleted successfully',
      IMAGE_ADDED: 'Image added to collection',
      IMAGE_REMOVED: 'Image removed from collection',
    },
    ERROR: {
      NOT_FOUND: 'Collection not found',
      IMAGE_ALREADY_EXISTS: 'Image already exists in this collection',
      IMAGE_NOT_IN_COLLECTION: 'Image not found in collection',
      NOT_OWNER: 'You do not own this collection',
    },
  },

  // ==================== SUBSCRIPTION MESSAGES ====================
  SUBSCRIPTION: {
    SUCCESS: {
      CREATED: 'Subscription created successfully',
      UPDATED: 'Subscription updated successfully',
      CANCELLED: 'Subscription cancelled successfully',
      RENEWED: 'Subscription renewed successfully',
    },
    ERROR: {
      NOT_FOUND: 'Subscription not found',
      ALREADY_SUBSCRIBED: 'You already have an active subscription',
      PAYMENT_FAILED: 'Payment failed. Please check your payment method',
      INVALID_TIER: 'Invalid subscription tier',
      CANNOT_DOWNGRADE: 'Cannot downgrade while current period is active',
    },
  },

  // ==================== CREDIT MESSAGES ====================
  CREDIT: {
    SUCCESS: {
      PURCHASED: 'Credits purchased successfully',
      ADDED: 'Credits added to your account',
      DEDUCTED: 'Credits deducted successfully',
    },
    ERROR: {
      INSUFFICIENT: 'Insufficient credits',
      INVALID_AMOUNT: 'Invalid credit amount',
      TRANSACTION_FAILED: 'Credit transaction failed',
    },
  },

  // ==================== PAYMENT MESSAGES ====================
  PAYMENT: {
    SUCCESS: {
      COMPLETED: 'Payment completed successfully',
      REFUNDED: 'Payment refunded successfully',
    },
    ERROR: {
      FAILED: 'Payment failed',
      INVALID_METHOD: 'Invalid payment method',
      TRANSACTION_NOT_FOUND: 'Payment transaction not found',
      ALREADY_PROCESSED: 'Payment already processed',
      REFUND_FAILED: 'Refund failed',
    },
  },

  // ==================== VALIDATION MESSAGES ====================
  VALIDATION: {
    ERROR: {
      REQUIRED_FIELD: 'This field is required',
      INVALID_EMAIL: 'Invalid email format',
      INVALID_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, and number',
      INVALID_USERNAME: 'Username must be 3-20 characters and contain only letters, numbers, and underscores',
      INVALID_UUID: 'Invalid ID format',
      INVALID_URL: 'Invalid URL format',
      INVALID_DATE: 'Invalid date format',
      MIN_LENGTH: 'Minimum length is {min} characters',
      MAX_LENGTH: 'Maximum length is {max} characters',
      MIN_VALUE: 'Minimum value is {min}',
      MAX_VALUE: 'Maximum value is {max}',
    },
  },

  // ==================== GENERAL MESSAGES ====================
  GENERAL: {
    SUCCESS: {
      OPERATION_SUCCESSFUL: 'Operation completed successfully',
      CREATED: 'Resource created successfully',
      UPDATED: 'Resource updated successfully',
      DELETED: 'Resource deleted successfully',
    },
    ERROR: {
      INTERNAL_SERVER: 'Internal server error. Please try again later',
      NOT_FOUND: 'Resource not found',
      BAD_REQUEST: 'Invalid request',
      CONFLICT: 'Resource already exists',
      SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
      RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later',
      MAINTENANCE: 'System is under maintenance. Please try again later',
    },
    INFO: {
      PROCESSING: 'Processing your request...',
      PLEASE_WAIT: 'Please wait...',
      LOADING: 'Loading...',
    },
  },

  // ==================== FILE MESSAGES ====================
  FILE: {
    SUCCESS: {
      UPLOADED: 'File uploaded successfully',
      DELETED: 'File deleted successfully',
    },
    ERROR: {
      UPLOAD_FAILED: 'File upload failed',
      INVALID_TYPE: 'Invalid file type',
      TOO_LARGE: 'File size exceeds maximum limit',
      NOT_FOUND: 'File not found',
    },
  },

  // ==================== NOTIFICATION MESSAGES ====================
  NOTIFICATION: {
    SUCCESS: {
      SENT: 'Notification sent successfully',
      MARKED_READ: 'Notification marked as read',
      DELETED: 'Notification deleted successfully',
    },
    ERROR: {
      SEND_FAILED: 'Failed to send notification',
      NOT_FOUND: 'Notification not found',
    },
  },
} as const;

// Helper function to format messages with dynamic values
export function formatMessage(message: string, params: Record<string, string | number>): string {
  let formatted = message;
  Object.entries(params).forEach(([key, value]) => {
    formatted = formatted.replace(`{${key}}`, String(value));
  });
  return formatted;
}

// Export type for TypeScript autocomplete
export type SystemMessages = typeof SYSTEM_MESSAGES;
