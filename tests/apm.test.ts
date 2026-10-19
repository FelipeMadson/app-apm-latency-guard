import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CircularRingBuffer } from '../src/ring-buffer.ts';
import { LatencyGuard } from '../src/guard.ts';

describe('CircularRingBuffer', () => {
  it('armazena elementos e sobrescreve o mais antigo ao atingir a capacidade', () => {
    const buf = new CircularRingBuffer(3);
    buf.push(10);
    buf.push(20);
    buf.push(30);
    assert.deepEqual(buf.toArray(), [10, 20, 30]);

    buf.push(40); // 10 é sobrescrito
    assert.deepEqual(buf.toArray(), [20, 30, 40]);
  });
});

describe('LatencyGuard', () => {
  it('calcula percentis corretamente a partir de um conjunto conhecido', () => {
    const guard = new LatencyGuard(100);
    for (let i = 1; i <= 100; i++) {
      guard.recordLatency(i);
    }

    const p = guard.getPercentiles();
    assert.equal(p.count, 100);
    assert.equal(p.min, 1);
    assert.equal(p.max, 100);
    assert.equal(p.p50, 51);
    assert.equal(p.p95, 96);
    assert.equal(p.p99, 100);
  });

  it('detecta anomalias de latência com base em desvio padrão (Z-score)', () => {
    const guard = new LatencyGuard(50);
    // Latências normais entre 10 e 15ms
    for (let i = 0; i < 30; i++) {
      guard.recordLatency(10 + Math.random() * 5);
    }

    assert.equal(guard.isAnomaly(14), false);
    assert.equal(guard.isAnomaly(150), true); // Spike extremo
  });
});
