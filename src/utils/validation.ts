// import validator from 'validator';

// export const sanitizeInput = (input: string): string => {
//   return validator.escape(input.trim());
// };

// export const validateEmail = (email: string): boolean => {
//   return validator.isEmail(email);
// };

// export const validatePassword = (password: string): boolean => {
//   // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
//   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//   return passwordRegex.test(password);
// };