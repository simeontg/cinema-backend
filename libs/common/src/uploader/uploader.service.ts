import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
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
    });

    async upload(fileName: string, file: Buffer): Promise<string> {
        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.configService.get('AWS_BUCKET'),
                Key: fileName,
                Body: file
            })
        );

        const bucketName = this.configService.get('AWS_BUCKET');
        const region = this.configService.get('AWS_REGION');

        const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
        return fileUrl;
    }

    async delete(fileUrl: string): Promise<void> {
        const bucketName = this.configService.get('AWS_BUCKET');
        const region = this.configService.get('AWS_REGION');

        const key = fileUrl.replace(`https://${bucketName}.s3.${region}.amazonaws.com/`, '');

        await this.s3Client.send(
            new DeleteObjectCommand({
                Bucket: bucketName,
                Key: key
            })
        );
    }
}
