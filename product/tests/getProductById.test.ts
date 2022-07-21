import { getProductById } from './../handlers/getProductById';
import { HttpStatusCode } from './../utils/http-status-codes';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Product } from './../types/product.type';
import * as productsController from '../controllers/products.controller';
import { AppError } from '../utils/app-error.utils';

jest.mock('../controllers/products.controller');

const MOCK_PRODUCT: Product = {
  count: 4,
  description: 'Principles: Life and Work by Ray Dalio',
  id: '1',
  price: 2.4,
  title: 'Principles: Life and Work'
};

describe('get product handler', () => {
  it('should return 200 status code and specified product', async () => {
    const productId = '1';
    const MOCK_EVENT = {
      pathParameters: {
        productId
      }
    } as unknown as APIGatewayProxyEvent;

    (productsController.getProductById as any).mockImplementation(() =>
      Promise.resolve(MOCK_PRODUCT)
    );

    const response = (await getProductById(
      MOCK_EVENT
    )) as APIGatewayProxyResult;

    expect(productsController.getProductById).toBeCalledWith(productId);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(MOCK_PRODUCT);
  });

  it('should return 404 status code if product was not found', async () => {
    const productId = 'NOT FOUND';
    const MOCK_EVENT = {
      pathParameters: {
        productId
      }
    } as unknown as APIGatewayProxyEvent;
    const MOCK_ERROR = new AppError('Not found', HttpStatusCode.NOT_FOUND);

    (productsController.getProductById as any).mockImplementation(() =>
      Promise.reject(MOCK_ERROR)
    );

    const response = (await getProductById(
      MOCK_EVENT
    )) as APIGatewayProxyResult;

    expect(productsController.getProductById).toBeCalledWith(productId);

    expect(response.statusCode).toBe(MOCK_ERROR.statusCode);
    expect(JSON.parse(response.body)).toEqual({
      statusCode: MOCK_ERROR.statusCode,
      message: MOCK_ERROR.message
    });
  });

  it('should return 500 status code for unknown error', async () => {
    const productId = '1';
    const MOCK_EVENT = {
      pathParameters: {
        productId
      }
    } as unknown as APIGatewayProxyEvent;
    const MOCK_ERROR = new Error('Unknown Error');

    (productsController.getProductById as any).mockImplementation(() =>
      Promise.reject(MOCK_ERROR)
    );

    const response = (await getProductById(
      MOCK_EVENT
    )) as APIGatewayProxyResult;

    expect(productsController.getProductById).toBeCalledWith(productId);

    expect(response.statusCode).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
    expect(JSON.parse(response.body)).toEqual({
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: MOCK_ERROR.message
    });
  });
});
