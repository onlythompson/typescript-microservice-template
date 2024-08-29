// // Usage example
// import { asyncHandler } from '../utils/asyncHandler';
// import { paginateResults } from '../utils/pagination';
// import { encrypt, decrypt } from '../utils/security/encryption';
// import { sanitizeInput, validateEmail } from '../utils/security/sanitization';
// import { formatDate, addDays } from '../utils/dateHelpers';
// import { capitalizeFirstLetter, generateRandomString } from '../utils/stringHelpers';

// // In a controller
// export const getUsers = asyncHandler(async (req, res) => {
//   const page = parseInt(req.query.page as string) || 1;
//   const limit = parseInt(req.query.limit as string) || 10;
  
//   const users = await userService.getUsers();
//   const paginatedUsers = paginateResults(users, { page, limit }, users.length);
  
//   res.json(paginatedUsers);
// });

// // In a service
// const encryptedData = encrypt('sensitive data', process.env.ENCRYPTION_KEY!);
// const decryptedData = decrypt(encryptedData, process.env.ENCRYPTION_KEY!);

// const sanitizedInput = sanitizeInput(req.body.comment);
// const isValidEmail = validateEmail(req.body.email);

// const formattedDate = formatDate(new Date(), 'YYYY-MM-DD');
// const futureDate = addDays(new Date(), 7);

// const userName = capitalizeFirstLetter(req.body.name);
// const randomToken = generateRandomString(16);