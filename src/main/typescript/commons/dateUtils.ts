export function getTimeRemaining(timestamp: string): number {
  return new Date(timestamp).getTime() - Date.now();
}
export function getTimeElapsed(timestamp: string): number {
  return Date.now() - new Date(timestamp).getTime();
}

export function hasExpired(timestamp: string): boolean {
  return getTimeRemaining(timestamp) <= 0;
}
export function hasTimeElapsed(timestamp: string, durationInSec: number): boolean {
  return durationInSec === 0 || getTimeElapsed(timestamp) >= durationInSec * 1000;
}

export function getCurrentTime(): string {
  return new Date().toISOString();
}
