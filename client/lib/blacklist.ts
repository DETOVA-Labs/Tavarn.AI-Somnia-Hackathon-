
import { BlacklistedUser } from './types';

export const getBlacklist = async (): Promise<BlacklistedUser[]> => {
  const response = await fetch('/api/blacklist');
  if (!response.ok) {
    throw new Error('Failed to fetch blacklist');
  }
  return response.json();
};

export const getBlacklistStats = async () => {
  const response = await fetch('/api/blacklist/stats');
  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }
  return response.json();
};

export const submitBlacklistReport = async (formData: { address: string; reason: string; evidence: string }) => {
  const response = await fetch('/api/blacklist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error('Failed to submit report');
  }

  return response.json();
};
