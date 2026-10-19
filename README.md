# Application Performance Monitoring (APM) Latency Guard

Real-time latency histogram analyzer, anomaly detection engine, and SLA breach monitor featuring circular ring buffer reservoir sampling and exact p50/p90/p95/p99 percentile tracking.

[![CI](https://github.com/FelipeMadson/app-apm-latency-guard/actions/workflows/ci.yml/badge.svg)](https://github.com/FelipeMadson/app-apm-latency-guard/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

*Read this in [Português](README.pt-BR.md).*

---

## Features

- **Lock-Free Ring Buffer**: Constant-time $O(1)$ telemetry ingestion preventing memory allocation stalls under high-throughput request loads.
- **Statistical Percentiles**: Precise p50, p90, p95, and p99 percentile calculation over configurable sliding windows.
- **Z-Score Anomaly Detector**: Identifies latency spikes and performance degradation using rolling standard deviations.
- **Zero External Dependencies**: Pure TypeScript implementation ready for edge workers or backend microservices.

---

## Usage Example

```typescript
import { LatencyGuard } from './src/index.ts';

const guard = new LatencyGuard(1000); // 1000 samples sliding window

guard.recordLatency(12.5);
guard.recordLatency(18.2);
guard.recordLatency(250.0); // Anomaly spike!

const stats = guard.getPercentiles();
console.log(`p95: ${stats.p95}ms, p99: ${stats.p99}ms`);

const isAnomaly = guard.isAnomaly(250.0);
```

## License

MIT © [Felipe Madison](https://github.com/FelipeMadson)
