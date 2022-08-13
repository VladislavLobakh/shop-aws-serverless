import { Products } from './../types/products.type';
import { HttpStatusCode } from './../utils/http-status-codes';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Product } from './../types/product.type';
import { getProductsList } from '../handlers/getProductsList';
import * as productsController from '../controllers/products.controller';

jest.mock('../controllers/products.controller');

const MOCK_PRODUCTS: Products = [
  {
    count: 4,
    description: 'Principles: Life and Work by Ray Dalio',
    id: '1',
    price: 2.4,
    title: 'Principles: Life and Work'
  },
  {
    count: 6,
    description: 'Stillness Is the Key by Ryan Holiday',
    id: '2',
    price: 10,
    title: 'Stillness Is the Key'
  }
];

describe('get products handler', () => {
  it('should return 200 status code and product list', async () => {
    const MOCK_EVENT = {} as unknown as APIGatewayProxyEvent;

    (productsController.getProductsList as any).mockImplementation(() =>
      Promise.resolve(MOCK_PRODUCTS)
    );

    const response = (await getProductsList(
      MOCK_EVENT
    )) as APIGatewayProxyResult;

    expect(productsController.getProductsList).toBeCalled();

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(MOCK_PRODUCTS);
  });

  it('should return 500 status code for unknown error', async () => {
    const MOCK_EVENT = {} as unknown as APIGatewayProxyEvent;
    const MOCK_ERROR = new Error('Unknown Error');

    (productsController.getProductsList as any).mockImplementation(() =>
      Promise.reject(MOCK_ERROR)
    );

    const response = (await getProductsList(
      MOCK_EVENT
    )) as APIGatewayProxyResult;

    expect(productsController.getProductsList).toBeCalled();

    expect(response.statusCode).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
    expect(JSON.parse(response.body)).toEqual({
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: MOCK_ERROR.message
    });
  });
});
