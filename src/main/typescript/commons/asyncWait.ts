export function asyncWait(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}