// src/infrastructure/services/S3FileStorageService.ts

import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { IFileStorageService, UploadedFile, UploadResult } from '../contracts/IFileStorageService';
import { logger  } from '../../../cross_cutting/logging';

@injectable()
export class S3FileStorageService implements IFileStorageService {
  private s3Client: S3Client;
  private bucket: string;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    this.bucket = process.env.AWS_S3_BUCKET!;
  }

  async uploadFile(file: UploadedFile): Promise<UploadResult> {
    const key = `${uuidv4()}${extname(file.filename)}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);

      const url = await this.generateSignedUrl(key);

      logger.info(`File uploaded successfully to S3: ${key}`);

      return { key, url, filename: file.filename };
    } catch (error) {
      logger.error(`Error uploading file to S3: ${error}`);
      throw new Error('File upload failed');
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3Client.send(command);
      logger.info(`File deleted successfully from S3: ${key}`);
    } catch (error) {
      logger.error(`Error deleting file from S3: ${error}`);
      throw new Error('File deletion failed');
    }
  }

  async generateSignedUrl(key: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    try {
      const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
      return url;
    } catch (error) {
      logger.error(`Error generating signed URL for S3: ${error}`);
      throw new Error('Failed to generate signed URL');
    }
  }

  async getFileMetadata(key: string): Promise<{ contentType: string; size: number }> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const response = await this.s3Client.send(command);

      return {
        contentType: response.ContentType || 'application/octet-stream',
        size: response.ContentLength || 0,
      };
    } catch (error) {
      logger.error(`Error getting file metadata from S3: ${error}`);
      throw new Error('Failed to get file metadata');
    }
  }
}