import { Request, Response, NextFunction } from 'express';

type AsyncFunction = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;

export const asyncHandler = (fn: AsyncFunction) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// Usage example in a controller
// import { asyncHandler } from '../../cross_cutting/error-handling/AsyncHandler';
// import { AppError } from '../../cross_cutting/error-handling/AppError';

// export const createUser = asyncHandler(async (req: Request, res: Response) => {
//     const { email } = req.body;
//     const existingUser = await userService.findByEmail(email);
//     if (existingUser) {
//         throw new AppError('User already exists', 400);
//     }
//     // Create user logic
//     res.status(201).json({ message: 'User created successfully' });
// });
