import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploaderService {
  constructor() {}

  private readonly configService = new ConfigService();

  private readonly s3Client = new S3Client({
    region: this.configService.get('AWS_REGION'),
    credentials: {
      accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY')
    }
  })

  async upload(fileName: string, file: Buffer): Promise<string> {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.get('AWS_BUCKET'),
        Key: fileName,
        Body: file,
      }),
    );

    const fileUrl = `https://${this.configService.get('AWS_BUCKET')}.s3.eu-central-1.amazonaws.com/${fileName}`;
    return fileUrl;
  }
}
