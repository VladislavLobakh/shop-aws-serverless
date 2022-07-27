import { S3 } from 'aws-sdk';

export const getImportProductsSignedUrl = async (name): Promise<string> => {
  const s3 = new S3();

  const params = {
    Bucket: process.env.importProductsBucketName,
    Key: `uploaded/${name}`,
    ContentType: 'text/csv',
    Expires: 60
  };

  try {
    return s3.getSignedUrl('putObject', params);
  } catch (error) {}
};
