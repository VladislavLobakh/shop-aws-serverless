import { getImportProductsSignedUrl } from './../controllers/import-products.controller';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { lambdaHandler } from '../utils/lamda-handler.utils';

export const importProductsFile = lambdaHandler(
  (event: APIGatewayProxyEvent) => {
    const { name } = event.queryStringParameters;
    return getImportProductsSignedUrl(name);
  }
);
