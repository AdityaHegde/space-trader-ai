export function getTimeRemaining(timestamp: string): number {
  return new Date(timestamp).getTime() - Date.now();
}
