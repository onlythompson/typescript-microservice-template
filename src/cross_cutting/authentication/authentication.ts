import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { injectable, inject } from 'tsyringe';
// import { IUserRepository } from '../../domain/user/repositories/IUserRepository';
import { AppError } from '../error_handling/app_error';

// @injectable()
// export class AuthService {
//   constructor(
//     @inject('UserService') private userRepository: UserService,
//     @inject('JWT_SECRET') private jwtSecret: string
//   ) {}

//   async login(email: string, password: string): Promise<string> {
//     const user = await this.userRepository.findByEmail(email);
//     if (!user) {
//       throw new AppError('Invalid credentials', 401);
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       throw new AppError('Invalid credentials', 401);
//     }

//     const token = jwt.sign({ userId: user.id }, this.jwtSecret, { expiresIn: '1h' });
//     return token;
//   }

//   verifyToken(token: string): { userId: string } {
//     try {
//       const decoded = jwt.verify(token, this.jwtSecret) as { userId: string };
//       return decoded;
//     } catch (error) {
//       throw new AppError('Invalid or expired token', 401);
//     }
//   }

//   async hashPassword(password: string): Promise<string> {
//     const salt = await bcrypt.genSalt(10);
//     return bcrypt.hash(password, salt);
//   }
// }