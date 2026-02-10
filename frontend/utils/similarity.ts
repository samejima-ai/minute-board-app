export function calculateJaccardIndex(
  a: string[] = [],
  b: string[] = [],
): number {
  if (!a.length || !b.length) return 0;

  const setA = new Set(a);
  const setB = new Set(b);

  let intersection = 0;
  setA.forEach((item) => {
    if (setB.has(item)) intersection++;
  });

  const union = setA.size + setB.size - intersection;

  if (union === 0) return 0;
  return intersection / union;
}
