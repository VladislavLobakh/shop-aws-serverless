import AWSMock from 'aws-sdk-mock';
import { importProductsFile } from '../handlers/importProductsFile';

describe('import products file handler', () => {
  it('should return signed url', async () => {
    const fileName = 'file.csv';
    const bucketName = 'import-products-bucket';
    const signedUrl = `https://s3.amazonaws.com/${bucketName}/uploaded/${fileName}`;

    AWSMock.mock('S3', 'getSignedUrl', signedUrl);
    process.env.importProductsBucketName = 'bucketName';

    const event = JSON.parse(
      JSON.stringify({
        queryStringParameters: {
          name: fileName
        }
      })
    );
    const response = await importProductsFile(event);
    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(signedUrl);
  });
});
