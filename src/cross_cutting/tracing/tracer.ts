import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { trace, context, propagation, TraceFlags, SamplingResult, SamplingDecision } from '@opentelemetry/api';
import { W3CTraceContextPropagator } from '@opentelemetry/core';
import { OBSERVABILITY_CONFIG } from '../config/observability';


export const setupTracer = () => {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: OBSERVABILITY_CONFIG.tracing.serviceName,
    }),
    sampler: {
        shouldSample: (context, traceId, spanName, spanKind, attributes, links) => {
          const shouldSample = Math.random() < OBSERVABILITY_CONFIG.tracing.samplingRate;
          return {
            decision: shouldSample ? SamplingDecision.RECORD_AND_SAMPLED : SamplingDecision.NOT_RECORD,
          } as SamplingResult;
        }
      },
  });

  const exporter = new JaegerExporter({
    endpoint: OBSERVABILITY_CONFIG.tracing.jaegerEndpoint,
  });

  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

  // Initialize the provider
  provider.register({
    propagator: new W3CTraceContextPropagator(),
  });

  // Set up context and propagation
  propagation.setGlobalPropagator(new W3CTraceContextPropagator());

  return trace.getTracer(OBSERVABILITY_CONFIG.tracing.serviceName);
};

export const tracer = setupTracer();