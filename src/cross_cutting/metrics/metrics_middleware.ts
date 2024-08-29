import { Request, Response, NextFunction } from 'express';
import { metricsCollector } from './metrics_collector';

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const duration = process.hrtime(start);
    const durationInSeconds = duration[0] + duration[1] / 1e9;

    metricsCollector.httpRequestsTotal.inc({
      method: req.method,
      path: req.route ? req.route.path : req.path,
      status: res.statusCode
    });

    metricsCollector.httpRequestDurationSeconds.observe(
      {
        method: req.method,
        path: req.route ? req.route.path : req.path,
        status: res.statusCode
      },
      durationInSeconds
    );
  });

  next();
};

export const metricsEndpoint = async (req: Request, res: Response) => {
  res.set('Content-Type', 'text/plain');
  res.send(await metricsCollector.getMetrics());
};