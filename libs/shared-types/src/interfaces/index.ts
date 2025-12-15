// API Response interfaces
export interface IApiResponse<T = unknown> {
  success: boolean;
  status_code: number;
  data?: T;
  message?: string;
  error?: string;
}

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface IPaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}

// Auth interfaces
export interface IJwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface IAuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface IAuthUser {
  id: string;
  email: string;
  username: string;
  role: string;
  subscription_tier: string;
  credits: number;
}

// File upload interfaces
export interface IFileUploadResult {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

export interface IImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
}

// Generation interfaces
export interface IGenerationProgress {
  session_id: string;
  status: string;
  progress: number;
  current_step: number;
  total_steps: number;
  estimated_time_remaining?: number;
}

export interface IGenerationResult {
  session_id: string;
  images: Array<{
    id: string;
    url: string;
    thumbnail_url: string;
    seed: number;
  }>;
  credits_used: number;
}

// Statistics interfaces
export interface IUserStatistics {
  total_generations: number;
  total_images: number;
  total_characters: number;
  total_collections: number;
  credits_remaining: number;
  credits_used_this_month: number;
}

export interface ISystemStatistics {
  total_users: number;
  total_generations: number;
  total_images: number;
  active_sessions: number;
}
