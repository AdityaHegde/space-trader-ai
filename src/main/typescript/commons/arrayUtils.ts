export function getInArray<T>(
  array: T[], getter: (e: T) => number,
  compare: (a: number, b: number) => number,
): [T, number] {
  if (array.length === 0) return undefined;

  let selected = getter(array[0]);
  let selectedIdx = 0;

  for (let i = 1; i < array.length; i++) {
    const eVal = getter(array[i]);
    console.log(eVal, selected);
    if (compare(eVal, selected) < 0) {
      console.log("updated")
      selected = eVal;
      selectedIdx = i;
    }
  }

  return [array[selectedIdx], selectedIdx];
}
export function getMaxInArray<T>(
  array: T[], getter: (e: T) => number,
): [T, number] {
  return getInArray(array, getter, (a, b) => b - a);
}
