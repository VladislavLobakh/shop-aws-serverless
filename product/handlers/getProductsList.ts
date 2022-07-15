import { success, failure } from './../libs/response-lib';
import { ProductModel } from './../models/product.model';
import { APIGatewayProxyHandler, APIGatewayEvent } from 'aws-lambda';
import products from './../mocks/products.json';

export const getProductsList: APIGatewayProxyHandler = async (
  event: APIGatewayEvent
) => {
  try {
    const products = await fetchProducts();
    return success(products);
  } catch (error) {
    return failure(error, event);
  }
};

const fetchProducts = async (): Promise<ProductModel[]> => {
  return Promise.resolve(products as ProductModel[]);
};
