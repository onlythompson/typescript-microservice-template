/**
 * Represents a file that has been uploaded.
 * 
 * @interface UploadedFile
 * @property {string} filename - The name of the uploaded file.
 * @property {string} mimetype - The MIME type of the uploaded file.
 * @property {string} encoding - The encoding of the uploaded file.
 * @property {Buffer} buffer - The buffer containing the file data.
 */
export interface UploadedFile {
    filename: string;
    mimetype: string;
    encoding: string;
    buffer: Buffer;
}

/**
 * Represents the result of a file upload operation.
 * 
 * @interface UploadResult
 * @property {string} key - The unique key identifying the uploaded file.
 * @property {string} url - The URL where the uploaded file can be accessed.
 * @property {string} filename - The name of the uploaded file.
 */
export interface UploadResult {
    key: string;
    url: string;
    filename: string;
}

/**
 * Interface for a file storage service.
 * 
 * @interface IFileStorageService
 */
export interface IFileStorageService {
    /**
     * Uploads a file to the storage service.
     * 
     * @param {UploadedFile} file - The file to be uploaded.
     * @returns {Promise<UploadResult>} A promise that resolves to the result of the upload operation.
     */
    uploadFile(file: UploadedFile): Promise<UploadResult>;

    /**
     * Deletes a file from the storage service.
     * 
     * @param {string} key - The unique key identifying the file to be deleted.
     * @returns {Promise<void>} A promise that resolves when the file has been deleted.
     */
    deleteFile(key: string): Promise<void>;

    /**
     * Generates a signed URL for accessing a file.
     * 
     * @param {string} key - The unique key identifying the file.
     * @returns {Promise<string>} A promise that resolves to the signed URL.
     */
    generateSignedUrl(key: string): Promise<string>;

    /**
     * Retrieves metadata for a file.
     * 
     * @param {string} key - The unique key identifying the file.
     * @returns {Promise<{ contentType: string; size: number }>} A promise that resolves to an object containing the file's metadata.
     */
    getFileMetadata(key: string): Promise<{ contentType: string; size: number }>;
}