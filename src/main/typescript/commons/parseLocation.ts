export function parseLocation(location: string) {
  const [sector, systemNum] = location.split("-");
  return {
    sector,
    system: `${sector}-${systemNum}`,
    waypoint: location,
  }
}
