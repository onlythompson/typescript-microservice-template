import { Request, Response, NextFunction } from 'express';
import { context, trace, SpanStatusCode } from '@opentelemetry/api';
import { tracer } from './tracer';

export const tracingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const span = tracer.startSpan(`${req.method} ${req.path}`);
  
  // Set span attributes
  span.setAttributes({
    'http.method': req.method,
    'http.url': req.url,
    'http.host': req.headers.host,
    'http.user_agent': req.headers['user-agent'],
  });

  // Inject the current context into the request
  const ctx = trace.setSpan(context.active(), span);
  return context.with(ctx, () => {
    res.on('finish', () => {
      span.setStatus({ code: res.statusCode < 400 ? SpanStatusCode.OK : SpanStatusCode.ERROR });
      span.setAttribute('http.status_code', res.statusCode);
      span.end();
    });

    next();
  });
};