import { MockRestClient, RestClientOptions } from '@apigames/rest-client';
import { CustomerOrders, IOrderAttributes, Order } from './customer.order.resource';

describe('The customer orders resource ', () => {
  describe('container\'s Add() method ', () => {
    it('should successfully create and initialize an order resource object.', () => {
      const customerOrders = new CustomerOrders('abc');
      const order = customerOrders.Add();
      expect(order).toBeDefined();
      expect(order).toBeInstanceOf(Order);
      expect(order.id).toBeUndefined();
    });
  });

  describe('container\'s Get() method ', () => {
    it('should clear the internal structures, get the resource and repopulate the internal data structures.', async () => {
      const mockClient = new MockRestClient();
      jest.spyOn(mockClient, 'Get');
      mockClient.MockResolve({
        statusCode: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': 'application/vnd.api+json',
        },
        data: {
          jsonapi: {
            version: '1.0',
          },
          data: {
            type: 'Order',
            id: '69a56960-17d4-4f2f-bb2f-a671a6aa0fd9',
            attributes: {
              product: {
                code: 'WIN95',
                name: 'Windows 95',
                description: [
                  'Windows 95 was designed to be maximally compatible with existing MS-DOS and 16-bit Windows ',
                  'programs and device drivers while offering a more stable and better performing system. ',
                  'The Windows 95 architecture is an evolution of Windows for Workgroups\' 386 enhanced mode.',
                ],
              },
              qty: 1,
              price: 1.99,
            },
            links: {
              self: 'https://api.example.com/customers/9a383573-801f-4466-80b2-96f4fb93c384/orders/69a56960-17d4-4f2f-bb2f-a671a6aa0fd9',
            },
          },
          links: {
            self: 'https://api.example.com/customers/9a383573-801f-4466-80b2-96f4fb93c384/orders/69a56960-17d4-4f2f-bb2f-a671a6aa0fd9',
          },
        },
      });

      const customerOrders = new CustomerOrders('9a383573-801f-4466-80b2-96f4fb93c384', mockClient);
      const queryResult = await customerOrders.Get('69a56960-17d4-4f2f-bb2f-a671a6aa0fd9');

      const queryUri: string = 'https://api.example.com/customers/9a383573-801f-4466-80b2-96f4fb93c384/orders/'
        + '69a56960-17d4-4f2f-bb2f-a671a6aa0fd9';

      const queryHeaders = {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      };

      const queryOptions: RestClientOptions = {};

      const orderAttributes: IOrderAttributes = {
        product: {
          code: 'WIN95',
          name: 'Windows 95',
          description: [
            'Windows 95 was designed to be maximally compatible with existing MS-DOS and 16-bit Windows ',
            'programs and device drivers while offering a more stable and better performing system. ',
            'The Windows 95 architecture is an evolution of Windows for Workgroups\' 386 enhanced mode.',
          ],
        },
        qty: 1,
        price: 1.99,
      };

      expect(queryResult).toBe(true);
      expect(mockClient.Get).toHaveBeenCalledTimes(1);
      expect(mockClient.Get).toHaveBeenCalledWith(queryUri, queryHeaders, queryOptions);
      expect(customerOrders.data).toBeDefined();
      expect(customerOrders.data).toBeInstanceOf(Order);
      if (customerOrders.isResourceObject(customerOrders.data)) {
        expect(customerOrders.data.type).toBe('Order');
        expect(customerOrders.data.id).toBe('69a56960-17d4-4f2f-bb2f-a671a6aa0fd9');
        expect(customerOrders.data.attributes).toEqual(orderAttributes);
        expect(customerOrders.data.uri).toEqual('https://api.example.com/customers/9a383573-801f-4466-80b2-96f4fb93c384/orders/69a56960-17d4-4f2f-bb2f-a671a6aa0fd9');
      }
    });
  });

  it('should correctly format the uri when queried.', () => {
    const customerOrders = new CustomerOrders('9a383573-801f-4466-80b2-96f4fb93c384');
    expect(customerOrders.uri).toBe('https://api.example.com/customers/9a383573-801f-4466-80b2-96f4fb93c384/orders');
  });
});
