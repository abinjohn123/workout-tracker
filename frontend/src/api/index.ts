import useSWR from 'swr';
import { CustomError } from '@/types';

import { supabaseClient } from '@/auth';
import { BASE_URL } from './config';

export const customFetch = async <T>(...args: Parameters<typeof fetch>) => {
  const [route, rest] = args;
  const {
    data: { session },
    error: sessionError,
  } = await supabaseClient.auth.getSession();

  if (sessionError) {
    const error: CustomError = new Error('Authentication error');
    error.info = { message: 'Failed to get session' };
    error.status = 401;
    throw error;
  }

  if (!session) {
    const error: CustomError = new Error('No active session');
    error.info = { message: 'Please log in to continue' };
    error.status = 401;
    throw error;
  }

  const config = {
    ...(rest ?? {}),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
      ...(rest?.headers || {}),
    },
  };

  const response = await fetch(`${BASE_URL}${route}`, config);

  if (response.status === 401) {
    // Token might be expired, try to refresh
    const { error: refreshError } = await supabaseClient.auth.refreshSession();

    if (refreshError) {
      // Refresh failed, user needs to log in again
      const error: CustomError = new Error('Session expired');
      error.info = { message: 'Please log in again' };
      error.status = 401;
      throw error;
    }

    // Retry the request with new token
    const {
      data: { session: newSession },
    } = await supabaseClient.auth.getSession();

    if (newSession) {
      config.headers.Authorization = `Bearer ${newSession.access_token}`;
      const retryResponse = await fetch(`${BASE_URL}${route}`, config);

      if (!retryResponse.ok) {
        const error: CustomError = new Error(
          'An error occurred while fetching data',
        );
        error.info = await retryResponse.json();
        error.status = retryResponse.status;
        throw error;
      }

      return (await retryResponse.json()) as T;
    }
  }

  if (!response.ok) {
    const error: CustomError = new Error(
      'An error occured while fetching data',
    );
    error.info = await response.json();
    error.status = response.status;
    throw error;
  }

  return (await response.json()) as T;
};

const useCustomSWR = <T>(route: string) => useSWR<T>(route, customFetch);

export default useCustomSWR;
