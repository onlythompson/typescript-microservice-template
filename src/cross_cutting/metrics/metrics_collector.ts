import { Registry, collectDefaultMetrics, Counter, Histogram } from 'prom-client';
import { OBSERVABILITY_CONFIG } from '../config/observability';

class MetricsCollector {
  private static instance: MetricsCollector;
  private registry: Registry;

  private constructor() {
    this.registry = new Registry();
    collectDefaultMetrics({ register: this.registry });

    // Custom metrics
    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'path', 'status'],
      registers: [this.registry]
    });

    this.httpRequestDurationSeconds = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'path', 'status'],
      buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
      registers: [this.registry]
    });
  }

  public static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  public getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  public httpRequestsTotal: Counter<string>;
  public httpRequestDurationSeconds: Histogram<string>;
}

export const metricsCollector = MetricsCollector.getInstance();