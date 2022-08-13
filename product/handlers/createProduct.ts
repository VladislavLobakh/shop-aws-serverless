import { CreateProduct } from './../types/create-product.type';
import { lambdaHandler } from './../utils/lamda-handler.utils';
import { APIGatewayProxyEvent } from 'aws-lambda';
import * as productsController from '../controllers/products.controller';

export const createProduct = lambdaHandler((event: APIGatewayProxyEvent) => {
  const newProduct: CreateProduct = JSON.parse(event.body);
  return productsController.createProduct(newProduct);
});
