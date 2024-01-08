import { ConflictException, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import appConfiguration from 'src/app.configuration';

@Injectable()
export class S3Service {

    private readonly AwsS3Instance: AWS.S3;

    constructor() {
        this.AwsS3Instance = new AWS.S3({
            region: appConfiguration().AWS.S3.REGION,
            accessKeyId: appConfiguration().AWS.S3.KEY,
            secretAccessKey: appConfiguration().AWS.S3.SECRET,
        });
    }

    public upload(path: string | number, buffer: Buffer, file_name: string = ''): Promise<AWS.S3.ManagedUpload.SendData> {

        const params: AWS.S3.PutObjectRequest = {
            Bucket: appConfiguration().AWS.S3.BUCKET,
            Key: (file_name?.length > 0) ? `${path}/${file_name}-${uuidv4()}.xlsx` : `${path}/${uuidv4()}.xlsx`,
            Body: buffer,
            ContentDisposition: 'inline',
        };

        const upload = this.AwsS3Instance.upload(params);

        return new Promise((resolve, reject) => {
            upload.send((err, data) => {
                if (err) {
                    reject(new ConflictException(err));
                } else {
                    resolve(data);
                }
            });
        });
    }

    public async extract(path: string): Promise<Buffer> {

        const params: AWS.S3.GetObjectRequest = {
            Bucket: appConfiguration().AWS.S3.BUCKET,
            Key: path,
        };

        const { Body } = await this.AwsS3Instance.getObject(params).promise();

        return Body as Buffer;
    }

    // public update(chartId: number, chartDetailId: number, buffer: any): Promise<AWS.S3.ManagedUpload.SendData> {

    //     const params: AWS.S3.PutObjectRequest = {
    //         Bucket: appConfiguration().AWS.S3.BUCKET,
    //         Key: `ssp/charts/${chartId}/member/${chartDetailId}/${uuidv4()}.xlsx`,
    //         Body: buffer,
    //     };

    //     const upload = this.AwsS3Instance.upload(params);

    //     return new Promise((resolve, reject) => {
    //         upload.send((err, data) => {
    //             if (err) {
    //                 reject(new ConflictException(err));
    //             } else {
    //                 resolve(data);
    //             }
    //         });
    //     });
    // }



    // public insertCR(chartId: number, buffer: Buffer): Promise<AWS.S3.ManagedUpload.SendData> {

    //     const params: AWS.S3.PutObjectRequest = {
    //         Bucket: appConfiguration().AWS.S3.BUCKET,
    //         Key: `ssp/consolidated-report/${chartId}/${uuidv4()}.xlsx`,
    //         Body: buffer,
    //         ContentDisposition: 'inline',
    //     };

    //     const upload = this.AwsS3Instance.upload(params);

    //     return new Promise((resolve, reject) => {
    //         upload.send((err, data) => {
    //             if (err) {
    //                 reject(new ConflictException(err));
    //             } else {
    //                 resolve(data);
    //             }
    //         });
    //     });
    // }
}