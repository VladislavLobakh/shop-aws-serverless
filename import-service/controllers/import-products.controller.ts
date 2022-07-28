import { S3 } from 'aws-sdk';

export const getImportProductsSignedUrl = async (name): Promise<string> => {
  const s3 = new S3();

  const params = {
    Bucket: process.env.importProductsBucketName,
    Key: `uploaded/${name}`,
    ContentType: 'text/csv',
    Expires: 60
  };

  return s3.getSignedUrlPromise('putObject', params);
};
