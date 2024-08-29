import crypto from 'crypto';

/**
 * Encrypts a given text using AES-256-CBC encryption algorithm.
 *
 * @param {string} text - The plaintext to be encrypted.
 * @param {string} secretKey - The secret key used for encryption. Must be 32 bytes long.
 * @returns {string} The encrypted text in the format 'iv:encryptedText', where 'iv' is the initialization vector.
 */
export const encrypt = (text: string, secretKey: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

/**
 * Decrypts a given text using AES-256-CBC encryption algorithm.
 *
 * @param {string} text - The encrypted text in the format 'iv:encryptedText', where 'iv' is the initialization vector.
 * @param {string} secretKey - The secret key used for decryption. Must be the same key that was used for encryption.
 * @returns {string} The decrypted plaintext.
 */
export const decrypt = (text: string, secretKey: string): string => {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};