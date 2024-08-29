// import { Request, Response, NextFunction } from 'express';
// import { injectable, inject } from 'tsyringe';
// import { AuthService } from './authentication';
// import { AppError } from '../error_handling/app_error';

// @injectable()
// export class AuthMiddleware {
//   constructor(@inject(AuthService) private authService: AuthService) {}

//   authenticate = (req: Request, res: Response, next: NextFunction) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//       throw new AppError('No token provided', 401);
//     }

//     const [, token] = authHeader.split(' ');

//     try {
//       const decoded = this.authService.verifyToken(token);
//       (req as any).userId = decoded.userId;
//       next();
//     } catch (error) {
//       next(error);
//     }
//   };
// }

// Usage example in a route file:
//
// import { container } from 'tsyringe';
// import { AuthMiddleware } from '../cross_cutting/authentication/AuthMiddleware';
//
// const authMiddleware = container.resolve(AuthMiddleware);
//
// router.get('/protected-route', authMiddleware.authenticate, (req, res) => {
//   res.json({ message: 'This is a protected route', userId: (req as any).userId });
// });