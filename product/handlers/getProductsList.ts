import { lambdaHandler } from './../utils/lamda-handler.utils';
import { APIGatewayProxyEvent } from 'aws-lambda';
import * as productsController from '../controllers/products.controller';

export const getProductsList = lambdaHandler((event: APIGatewayProxyEvent) => {
  return productsController.getProductsList();
});
