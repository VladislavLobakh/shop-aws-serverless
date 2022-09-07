import { HttpStatusCode } from './../../product/utils/http-status-codes';
import { AppError } from './../utils/app-error.utils';
import { S3EventRecord } from 'aws-lambda';
import { S3, SQS } from 'aws-sdk';
import csvParser from 'csv-parser';

export const parseCSVFiles = async (
  records: S3EventRecord[]
): Promise<void> => {
  const s3 = new S3();
  const sqs = new SQS();
  const fileKeys: string[] = records.map((record) => record.s3.object.key);

  for (const key of fileKeys) {
    await new Promise((resolve, reject) => {
      const params = {
        Bucket: process.env.importProductsBucketName,
        Key: key
      };

      s3.getObject(params)
        .createReadStream()
        .on('error', (error) => {
          console.log('Error stream:');
          console.log(error);
          reject(
            new AppError('File cannot be parsed', HttpStatusCode.BAD_REQUEST)
          );
        })
        .pipe(csvParser())
        .on('data', async (csvRow) => {
          await sqs
            .sendMessage({
              QueueUrl: process.env.catalogItemsQueueUrl,
              MessageBody: JSON.stringify(csvRow)
            })
            .promise();
        })
        .on('end', () => {
          console.log('End stream');
          resolve(null);
        });
    });

    await s3
      .copyObject({
        Bucket: process.env.importProductsBucketName,
        CopySource: `${process.env.importProductsBucketName}/${key}`,
        Key: key.replace('uploaded', 'parsed')
      })
      .promise();
    console.log(`Object ${key} copied into parsed`);

    await s3
      .deleteObject({
        Bucket: process.env.importProductsBucketName,
        Key: key
      })
      .promise();
    console.log(`Object ${key} deleted from uploaded`);
  }
};
