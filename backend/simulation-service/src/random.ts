/**
 * Mulberry32: a fast, seedable 32-bit PRNG.
 * Returns a function that produces uniform random numbers in [0, 1).
 */
function mulberry32(seed: number): () => number {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), state | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Create a random number generator.
 * If a seed is provided, returns a deterministic mulberry32 PRNG.
 * Otherwise, returns Math.random.
 */
export function createRng(seed?: number): () => number {
  if (seed !== undefined) {
    return mulberry32(seed);
  }
  return Math.random;
}
