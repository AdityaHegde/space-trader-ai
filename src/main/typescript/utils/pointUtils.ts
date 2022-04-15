export interface Point {
  x: number;
  y: number;
}
export type PointLike = Point & Record<string, any>;

export function getDistance(p0: PointLike, p1: PointLike) {
  return Math.round(Math.sqrt(Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y, 2)));
}
