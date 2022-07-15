import { success } from './../libs/response-lib';
import { ProductModel } from './../models/product.model';
import { getProductsList } from '../handlers/getProductsList';

describe('getProductsList', () => {
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

  test('should recieve products', async () => {
    const recievedProductsResponse = await getProductsList(null, null, null);
    expect(recievedProductsResponse).toEqual(success(products));
  });
});
