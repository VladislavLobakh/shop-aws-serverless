import { Product } from './../types/product.type';
import products from './../mocks/products.json';
import { AppError } from '../utils/app-error.utils';
import { HttpStatusCode } from '../utils/http-status-codes';

export const getProductsList = async (): Promise<Product[]> => {
  return Promise.resolve(products as Product[]);
};

export const getProductById = async (productId: string): Promise<Product> => {
  const products = await getProductsList();
  const product = products.find((product) => product.id === productId);

  if (!product) {
    throw new AppError('Product not found', HttpStatusCode.NOT_FOUND);
  }

  return product;
};
