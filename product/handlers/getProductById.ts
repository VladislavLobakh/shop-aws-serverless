import { lambdaHandler } from './../utils/lamda-handler.utils';
import { APIGatewayProxyEvent } from 'aws-lambda';
import * as productsController from '../controllers/products.controller';

export const getProductById = lambdaHandler((event: APIGatewayProxyEvent) => {
  const { productId } = event.pathParameters;
  return productsController.getProductById(productId);
});
