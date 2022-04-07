export function randomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomArray(
  min: number,
  max: number,
  length: number
): number[] {
  return [...Array(length)].map(() => randomInt(min, max));
}
