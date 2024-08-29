export const OBSERVABILITY_CONFIG = {
    logging: {
      level: process.env.LOG_LEVEL || 'info',
      format: process.env.LOG_FORMAT || 'json',
      elasticsearchNode: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
      elasticsearchIndex: process.env.ELASTICSEARCH_INDEX || 'application-logs',
    },
    metrics: {
      port: parseInt(process.env.METRICS_PORT || '9100', 10),
      path: process.env.METRICS_PATH || '/metrics',
    },
    tracing: {
      serviceName: process.env.SERVICE_NAME || 'task-management-service',
      samplingRate: parseFloat(process.env.TRACING_SAMPLING_RATE || '0.1'),
      jaegerEndpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
    },
  };