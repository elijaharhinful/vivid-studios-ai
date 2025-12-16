import {
  LoginDto,
  CreateUserDto,
  RequestPasswordResetDto,
  ResetPasswordDto,
  GoogleAuthDto,
  IAuthTokens,
  IAuthUser,
} from '@vivid-studios-ai/shared-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

class AuthApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'AuthApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new AuthApiError(
      errorData.message || 'An error occurred',
      response.status,
      errorData.errors
    );
  }
  
  const json = await response.json();
  
  // Backend wraps responses in { success, status_code, data, message }
  // Extract the data field if it exists, otherwise return the raw response
  if (json && typeof json === 'object' && 'data' in json) {
    return json.data as T;
  }
  
  return json as T;
}

export const authApi = {
  /**
   * Sign up a new user
   */
  async signup(data: CreateUserDto): Promise<IAuthTokens> {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<IAuthTokens>(response);
  },

  /**
   * Login with email and password
   */
  async login(data: LoginDto): Promise<IAuthTokens> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<IAuthTokens>(response);
  },

  /**
   * Authenticate with Google
   */
  async googleAuth(data: GoogleAuthDto): Promise<IAuthTokens> {
    const response = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<IAuthTokens>(response);
  },

  /**
   * Request password reset email
   */
  async requestPasswordReset(
    data: RequestPasswordResetDto
  ): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/auth/request-password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<{ message: string }>(response);
  },

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordDto): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<{ message: string }>(response);
  },

  /**
   * Get current user profile
   */
  async getProfile(accessToken: string): Promise<IAuthUser> {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return handleResponse<IAuthUser>(response);
  },

  /**
   * Refresh access token
   */
  async refreshToken(accessToken: string): Promise<IAuthTokens> {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return handleResponse<IAuthTokens>(response);
  },
};

export { AuthApiError };
export type { ApiResponse };
