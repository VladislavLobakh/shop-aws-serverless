import { CreateProduct } from './../types/create-product.type';
import { pgConnect, pgDisconnect, pgQuery } from './../utils/pg-database.util';
import { Product } from './../types/product.type';
import { AppError } from '../utils/app-error.utils';
import { HttpStatusCode } from '../utils/http-status-codes';

export const getProductsList = async (): Promise<Product[]> => {
  const client = await pgConnect();

  try {
    const products = await pgQuery(
      client,
      'select p.id, p.title, p.description, p.price, s.count from products as p inner join stocks as s on p.id = s.product_id'
    );
    return products;
  } finally {
    pgDisconnect(client);
  }
};

export const getProductById = async (productId: string): Promise<Product> => {
  const products = await getProductsList();
  const product = products.find((product) => product.id === productId);

  if (!product) {
    throw new AppError('Product not found', HttpStatusCode.NOT_FOUND);
  }

  return product;
};

export const createProduct = async (
  product: CreateProduct
): Promise<Product> => {
  const client = await pgConnect();

  try {
    await client.query('BEGIN');
    const createProductResponse: { id: string } = await pgQuery(
      client,
      `INSERT INTO products (title, description, price) VALUES ($1, $2, $3) RETURNING id`,
      [product.title, product.description, product.price]
    );
    await pgQuery(
      client,
      `INSERT INTO stocks (product_id, count) VALUES ($1, $2)`,
      [createProductResponse.id, product.count]
    );
    await client.query('COMMIT');
    return {
      id: createProductResponse.id,
      ...product
    };
  } catch (error) {
    await client.query('ROLLBACK');
    console.log(error);
    throw new AppError(
      'Product cannot be created',
      HttpStatusCode.INTERNAL_SERVER_ERROR
    );
  } finally {
    pgDisconnect(client);
  }
};
