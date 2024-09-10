// src/infrastructure/services/GCSFileStorageService.ts

import { Storage } from '@google-cloud/storage';
import { injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { IFileStorageService, UploadedFile, UploadResult } from '../contracts/IFileStorageService';
import { logger  } from '../../../cross_cutting/logging';

@injectable()
export class GCSFileStorageService implements IFileStorageService {
  private storage: Storage;
  private bucket: string;

  constructor() {
    this.storage = new Storage({
      projectId: process.env.GCS_PROJECT_ID,
      keyFilename: process.env.GCS_KEY_FILE,
    });
    this.bucket = process.env.GCS_BUCKET!;
  }

  async uploadFile(file: UploadedFile): Promise<UploadResult> {
    const key = `${uuidv4()}${extname(file.filename)}`;

    try {
      const bucket = this.storage.bucket(this.bucket);
      const blob = bucket.file(key);

      await blob.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });

      const url = await this.generateSignedUrl(key);

      logger.info(`File uploaded successfully to GCS: ${key}`);

      return { key, url, filename: file.filename };
    } catch (error) {
      logger.error(`Error uploading file to GCS: ${error}`);
      throw new Error('File upload failed');
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const bucket = this.storage.bucket(this.bucket);
      const file = bucket.file(key);

      await file.delete();
      logger.info(`File deleted successfully from GCS: ${key}`);
    } catch (error) {
      logger.error(`Error deleting file from GCS: ${error}`);
      throw new Error('File deletion failed');
    }
  }

  async generateSignedUrl(key: string): Promise<string> {
    try {
      const bucket = this.storage.bucket(this.bucket);
      const file = bucket.file(key);

      const [url] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 3600 * 1000, // 1 hour
      });

      return url;
    } catch (error) {
      logger.error(`Error generating signed URL for GCS: ${error}`);
      throw new Error('Failed to generate signed URL');
    }
  }

  async getFileMetadata(key: string): Promise<{ contentType: string; size: number }> {
    try {
      const bucket = this.storage.bucket(this.bucket);
      const file = bucket.file(key);

      const [metadata] = await file.getMetadata();

      return {
        contentType: metadata.contentType || 'application/octet-stream',
        size: parseInt(String(metadata.size ?? '0')) //|| 0,
      };
    } catch (error) {
      logger.error(`Error getting file metadata from GCS: ${error}`);
      throw new Error('Failed to get file metadata');
    }
  }
}