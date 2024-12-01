import { AxiosError } from 'axios';

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const isAxiosError = (error: unknown): error is AxiosError => {
  return typeof error === 'object' && error !== null && 'isAxiosError' in error;
};

export const handleAxiosError = (error: unknown): APIError => {
  if (error instanceof APIError) {
    return error;
  }
  
  if (isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 404) {
      return new APIError('Resource not found', status);
    }
    if (status === 400) {
      return new APIError('Invalid request', status);
    }
    if (status === 429) {
      return new APIError('Too many requests, please try again later', status);
    }
    if (status >= 500) {
      return new APIError('Server error, please try again later', status);
    }
    return new APIError('Network error occurred', status);
  }
  
  return new APIError('An unexpected error occurred');
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof APIError) {
    return error.message;
  }
  return 'An unexpected error occurred';
};