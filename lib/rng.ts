// lib/rng.ts - Seeded random number generators

export type RNGType = "mulberry32" | "xorshift128";

export interface IRNG {
  next(): number;
  nextNormal(mean?: number, stdev?: number): number;
}

// Mulberry32 - fast, high-quality 32-bit PRNG
export class Mulberry32 implements IRNG {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  nextNormal(mean: number = 0, stdev: number = 1): number {
    // Box-Muller transform
    const u1 = this.next();
    const u2 = this.next();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0 * stdev + mean;
  }
}

// XorShift128+ - extremely fast, 128-bit state
export class XorShift128 implements IRNG {
  private s0: number;
  private s1: number;

  constructor(seed: number) {
    this.s0 = seed >>> 0;
    this.s1 = (seed * 1103515245 + 12345) >>> 0;
  }

  next(): number {
    let s1 = this.s0;
    const s0 = this.s1;
    this.s0 = s0;
    s1 ^= s1 << 23;
    s1 ^= s1 >>> 17;
    s1 ^= s0;
    s1 ^= s0 >>> 26;
    this.s1 = s1;
    return (((this.s0 + this.s1) >>> 0) / 4294967296 + 1) / 2;
  }

  nextNormal(mean: number = 0, stdev: number = 1): number {
    const u1 = this.next();
    const u2 = this.next();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0 * stdev + mean;
  }
}

export function createRNG(type: RNGType, seed: number): IRNG {
  switch (type) {
    case "mulberry32":
      return new Mulberry32(seed);
    case "xorshift128":
      return new XorShift128(seed);
    default:
      return new Mulberry32(seed);
  }
}
