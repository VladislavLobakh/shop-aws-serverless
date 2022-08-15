import { Products } from './../types/products.type';
import { CreateProduct } from './../types/create-product.type';
import { pgConnect, pgDisconnect, pgQuery } from './../utils/pg-database.util';
import { Product } from './../types/product.type';
import { AppError } from '../utils/app-error.utils';
import { HttpStatusCode } from '../utils/http-status-codes';
import { Client } from 'pg';
import { SNS } from 'aws-sdk';

export const getProductsList = async (): Promise<Products> => {
  const client = await pgConnect();

  try {
    const products = await pgQuery(
      client,
      'select p.id, p.title, p.description, p.price, s.count from products as p inner join stocks as s on p.id = s.product_id'
    );
    return products;
  } finally {
    await pgDisconnect(client);
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
    const createProductResponse: { id: string } = await createProductInTable(
      client,
      product
    );
    await createProductStockInTable(client, createProductResponse.id, product);
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
    await pgDisconnect(client);
  }
};

export const createBatchProducts = async (
  products: CreateProduct[]
): Promise<void> => {
  const client = await pgConnect();

  try {
    await client.query('BEGIN');
    console.log('Creating products');
    const createProductResponses = await Promise.all(
      products.map((product) => createProductInTable(client, product))
    );
    await Promise.all(
      createProductResponses.map((createProductResponse, i) =>
        createProductStockInTable(client, createProductResponse.id, products[i])
      )
    );
    await client.query('COMMIT');

    const sns = new SNS();
    await sns
      .publish({
        Message: `Following products were created: ${createProductResponses
          .map((product) => product.id)
          .join(', ')}`,
        Subject: 'New products created',
        TopicArn: process.env.newProductsCreatedTopic,
        MessageAttributes: {
          productsCount: {
            DataType: 'Number',
            StringValue: `${products.length}`
          }
        }
      })
      .promise();
  } catch (error) {
    await client.query('ROLLBACK');
    console.log(error);
    throw new AppError(
      'Products cannot be created',
      HttpStatusCode.INTERNAL_SERVER_ERROR
    );
  } finally {
    await pgDisconnect(client);
  }
};

const createProductInTable = async (
  client: Client,
  product: CreateProduct
): Promise<{ id: string }> => {
  return pgQuery(
    client,
    `INSERT INTO products (title, description, price) VALUES ($1, $2, $3) RETURNING id`,
    [product.title, product.description, product.price]
  );
};

const createProductStockInTable = async (
  client: Client,
  productId: string,
  product: CreateProduct
): Promise<void> => {
  return pgQuery(
    client,
    `INSERT INTO stocks (product_id, count) VALUES ($1, $2)`,
    [productId, product.count]
  );
};
