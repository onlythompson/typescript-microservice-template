import crypto from 'crypto';

/**
 * Capitalizes the first letter of a given string.
 *
 * @param {string} str - The input string to be transformed.
 * @returns {string} The transformed string with the first letter capitalized.
 *
 * @example
 * ```typescript
 * const result = capitalizeFirstLetter('hello');
 * console.log(result); // 'Hello'
 * ```
 */
export const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Generates a random string of a specified length using hexadecimal characters.
 *
 * @param {number} length - The desired length of the generated string.
 * @returns {string} A random string of the specified length.
 *
 * @example
 * ```typescript
 * const randomStr = generateRandomString(10);
 * console.log(randomStr); // e.g., 'a1b2c3d4e5'
 * ```
 */
export const generateRandomString = (length: number): string => {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};