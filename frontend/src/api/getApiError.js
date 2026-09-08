export const getApiError = (error, fallback) => {
  const responseData = error?.response?.data;
  const message = responseData?.error?.message
    || responseData?.error
    || responseData?.message
    || error?.message;

  if (typeof message === 'string' && message.trim()) {
    return message;
  }

  if (message && typeof message === 'object') {
    try {
      return JSON.stringify(message);
    } catch {
      return fallback;
    }
  }

  return fallback;
};