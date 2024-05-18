import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { ConfigService } from "@nestjs/config";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand
} from '@aws-sdk/client-s3';
@Injectable()
export class FilesService {
  private readonly s3Client: S3Client;
  private readonly logger = new Logger(FilesService.name);
  constructor(private configService: ConfigService){
    this.s3Client = new S3Client({
      region: configService.get('REGION'),
      credentials:{
        accessKeyId: configService.get('KEY_ID'),
        secretAccessKey: configService.get('ACCESS_KEY'),
      },
    });
  }

  async uploadFile(file:CreateFileDto, bucket: string) {
    try {
      this.logger.debug(`Uploading file to bucket: ${bucket}, key: ${file.key}`);
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: file.key,
        Body: file.buffer,
      });
      const response = await this.s3Client.send(command);
      this.logger.log(`File uploaded successfully: ${JSON.stringify(response)}`);
      return response;
    } catch (error) {
      this.logger.error(`Failed to upload file: ${error.message}`);
      if (error.$metadata) {
        this.logger.error(`Error metadata: ${JSON.stringify(error.$metadata)}`);
      }
      throw error;
    }
  }  //The function is also used to update a file in the bucket
  async downloadFile(key: string, bucket: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });
      const response = await this.s3Client.send(command);
      this.logger.log(`File downloaded successfully: ${key}`);
      return response.Body;
    } catch (error) {
      this.logger.error(`Failed to download file: ${error.message}`);
      throw error;
    }
  }
  async removeFile(key: string, bucket:string){
    try {
      const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      });
      const response = await this.s3Client.send(command);

      this.logger.log(`File delete successfully: ${key}`);
      return response
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`);
      throw error;
    }
  }
}
