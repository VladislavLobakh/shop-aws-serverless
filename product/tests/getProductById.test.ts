import { AppError } from './../libs/errors/app-error';
import { HttpStatusCode } from './../libs/errors/http-status-codes';
import { APIGatewayEvent } from 'aws-lambda';
import { success, failure } from './../libs/response-lib';
import { ProductModel } from './../models/product.model';
import { getProductById } from '../handlers/getProductById';

describe('getProductById', () => {
  const products: ProductModel[] = [
    {
      count: 4,
      description: 'Short Product Description1',
      id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
      price: 2.4,
      title: 'ProductOne'
    }
  ];
  beforeEach(() => {
    jest.mock('../mocks/products.json', () => products);
  });

  test('should recieve product by id', async () => {
    const event: APIGatewayEvent = JSON.parse(
      JSON.stringify({
        pathParameters: {
          productId: '7567ec4b-b10c-48c5-9345-fc73c48a80aa'
        }
      })
    );
    const recievedProductsResponse = await getProductById(event, null, null);
    expect(recievedProductsResponse).toEqual(success(products));
  });

  test("should throw error if there's no product", async () => {
    const event: APIGatewayEvent = JSON.parse(
      JSON.stringify({
        pathParameters: {
          productId: 'notexistedid'
        }
      })
    );
    const recievedProductsResponse = await getProductById(event, null, null);
    expect(recievedProductsResponse).toEqual(
      failure(new AppError('Product not found', HttpStatusCode.NOT_FOUND))
    );
  });
});
