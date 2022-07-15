import { HttpStatusCode } from './../libs/errors/http-status-codes';
import { AppError } from './../libs/errors/app-error';
import { success, failure } from './../libs/response-lib';
import { ProductModel } from './../models/product.model';
import products from './../mocks/products.json';
import { APIGatewayProxyHandler, APIGatewayEvent } from 'aws-lambda';

export const getProductById: APIGatewayProxyHandler = async (
  event: APIGatewayEvent
) => {
  const { productId } = event.pathParameters;

  try {
    const product = await fetchProductById(productId);
    return success(product);
  } catch (error) {
    return failure(error, event);
  }
};

const fetchProducts = async (): Promise<ProductModel[]> => {
  return Promise.resolve(products as ProductModel[]);
};

export const fetchProductById = async (
  productId: string
): Promise<ProductModel> => {
  const products = await fetchProducts();
  const product = products.find((product) => product.id === productId);

  if (!product) {
    throw new AppError('Product not found', HttpStatusCode.NOT_FOUND);
  }

  return product;
};
