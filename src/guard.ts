import { CircularRingBuffer } from './ring-buffer.ts';
import type { LatencyPercentiles } from './types.ts';

export class LatencyGuard {
  private buffer: CircularRingBuffer;

  constructor(windowSize = 1000) {
    this.buffer = new CircularRingBuffer(windowSize);
  }

  recordLatency(ms: number): void {
    this.buffer.push(ms);
  }

  getPercentiles(): LatencyPercentiles {
    const raw = this.buffer.toArray();
    if (raw.length === 0) {
      return { count: 0, min: 0, max: 0, mean: 0, p50: 0, p90: 0, p95: 0, p99: 0 };
    }

    const sorted = [...raw].sort((a, b) => a - b);
    const sum = sorted.reduce((acc, v) => acc + v, 0);

    const percentile = (p: number) => {
      const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
      return sorted[idx];
    };

    return {
      count: sorted.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      mean: Math.round((sum / sorted.length) * 100) / 100,
      p50: percentile(50),
      p90: percentile(90),
      p95: percentile(95),
      p99: percentile(99)
    };
  }

  isAnomaly(latencyMs: number, zThreshold = 3.0): boolean {
    const raw = this.buffer.toArray();
    if (raw.length < 10) return false; // Amostra insuficiente

    const mean = raw.reduce((a, b) => a + b, 0) / raw.length;
    const variance = raw.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / raw.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev === 0) return latencyMs > mean;
    const zScore = (latencyMs - mean) / stdDev;
    return zScore > zThreshold;
  }
}
