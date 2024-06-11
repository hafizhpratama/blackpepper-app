const rateLimitWindowMs = 15 * 60 * 1000; // 15 minutes
const maxRequestsPerWindow = 100;

const requestCounts = new Map<string, { count: number; timestamp: number }>();

export function rateLimiter(ip: string): boolean {
  const currentTime = Date.now();
  const requestData = requestCounts.get(ip) || {
    count: 0,
    timestamp: currentTime,
  };

  if (currentTime - requestData.timestamp > rateLimitWindowMs) {
    // Reset the count if the time window has passed
    requestCounts.set(ip, { count: 1, timestamp: currentTime });
    return true;
  }

  if (requestData.count >= maxRequestsPerWindow) {
    // Too many requests
    return false;
  }

  // Increment the count
  requestCounts.set(ip, {
    count: requestData.count + 1,
    timestamp: requestData.timestamp,
  });
  return true;
}
