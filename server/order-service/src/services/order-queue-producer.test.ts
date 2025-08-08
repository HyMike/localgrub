// import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
// import sendOrder from './order-queue-producer';
// import RabbitMQConnection from './rabbitmq-connection';

// // Mock RabbitMQConnection
// vi.mock('./rabbitmq-connection');

// // Mock dotenv
// vi.mock('dotenv', () => ({
//     default: {
//         config: vi.fn(),
//     },

// }));

// describe('order-queue-producer', () => {
//   let mockChannel: any;
//   let mockRabbitMQ: any;

//   beforeEach(() => {
//     vi.clearAllMocks();
    
//     const module = require('./order-queue-producer');
//     if (module.cacheChannel !== undefined) {
//       module.cacheChannel = null;
//     }
    
//     // Setup mock channel
//     mockChannel = {
//       assertExchange: vi.fn(),
//       publish: vi.fn(),
//     };

//     // Setup mock RabbitMQ connection
//     mockRabbitMQ = {
//       getChannel: vi.fn().mockResolvedValue(mockChannel),
//     };

//     (RabbitMQConnection.getInstance as any).mockReturnValue(mockRabbitMQ);
//   });

//   afterEach(() => {
//     vi.restoreAllMocks();
//   });

//   describe('sendOrder', () => {
//     it('should send order to queue successfully', async () => {
//       const orderData = {
//         uid: 'user123',
//         firstName: 'John',
//         lastName: 'Doe',
//         email: 'john@example.com',
//         itemId: 'pizza123',
//         itemName: 'Pepperoni Pizza',
//         quantity: 2,
//         price: 15.99,
//         creditCardInfo: '1234-5678-9012-3456',
//         createdAt: '2024-01-01T12:00:00.000Z',
//       };

//       await sendOrder(orderData);

//       expect(RabbitMQConnection.getInstance).toHaveBeenCalled();
//       expect(mockRabbitMQ.getChannel).toHaveBeenCalled();
//       expect(mockChannel.assertExchange).toHaveBeenCalledWith(
//         'topic_exc',
//         'topic',
//         { durable: true }
//       );
//       expect(mockChannel.publish).toHaveBeenCalledWith(
//         'topic_exc',
//         'order.placed',
//         Buffer.from(JSON.stringify(orderData)),
//         { persistent: true }
//       );
//     });

//     it('should handle empty order object', async () => {
//       const emptyOrder = {};

//       await sendOrder(emptyOrder);

//       expect(mockChannel.publish).toHaveBeenCalledWith(
//         'topic_exc',
//         'order.placed',
//         Buffer.from(JSON.stringify(emptyOrder)),
//         { persistent: true }
//       );
//     });

//     it('should handle complex order data', async () => {
//       const complexOrder = {
//         uid: 'user456',
//         firstName: 'Jane',
//         lastName: 'Smith',
//         email: 'jane.smith@example.com',
//         itemId: 'burger789',
//         itemName: 'Deluxe Burger',
//         quantity: 1,
//         price: 12.50,
//         creditCardInfo: '9876-5432-1098-7654',
//         createdAt: '2024-01-01T15:30:00.000Z',
//         specialInstructions: 'Extra cheese, no onions',
//         deliveryAddress: {
//           street: '123 Main St',
//           city: 'Anytown',
//           zip: '12345',
//         },
//       };

//       await sendOrder(complexOrder);

//       expect(mockChannel.publish).toHaveBeenCalledWith(
//         'topic_exc',
//         'order.placed',
//         Buffer.from(JSON.stringify(complexOrder)),
//         { persistent: true }
//       );
//     });

//     it('should handle RabbitMQ connection errors', async () => {
//       const orderData = { uid: 'user123', itemName: 'Pizza' };
//       const connectionError = new Error('Failed to connect to RabbitMQ');
//       mockRabbitMQ.getChannel.mockRejectedValue(connectionError);

//       await expect(sendOrder(orderData)).rejects.toThrow(/Failed to send order to queue.*Failed to connect to RabbitMQ/);
//     });

//     it('should handle channel creation errors', async () => {
//       const orderData = { uid: 'user123', itemName: 'Pizza' };
//       const channelError = new Error('Failed to create channel');
//       mockRabbitMQ.getChannel.mockRejectedValue(channelError);

//       await expect(sendOrder(orderData)).rejects.toThrow(/Failed to send order to queue.*Failed to create channel/);
//     });

//     it('should handle exchange assertion errors', async () => {
//       const orderData = { uid: 'user123', itemName: 'Pizza' };
//       const exchangeError = new Error('Exchange assertion failed');
//       mockChannel.assertExchange.mockRejectedValue(exchangeError);

//       await expect(sendOrder(orderData)).rejects.toThrow(/Failed to send order to queue.*Exchange assertion failed/);
//     });

//     it('should handle publish errors', async () => {
//       const orderData = { uid: 'user123', itemName: 'Pizza' };
//       const publishError = new Error('Message publish failed');
//       mockChannel.publish.mockImplementation(() => {
//         throw publishError;
//       });

//       await expect(sendOrder(orderData)).rejects.toThrow(/Failed to send order to queue.*Message publish failed/);
//     });

//     it('should use correct exchange name and routing key', async () => {
//       const orderData = { uid: 'user123', itemName: 'Pizza' };

//       await sendOrder(orderData);

//       expect(mockChannel.assertExchange).toHaveBeenCalledWith('topic_exc', 'topic', { durable: true });
//       expect(mockChannel.publish).toHaveBeenCalledWith(
//         'topic_exc',
//         'order.placed',
//         expect.any(Buffer),
//         { persistent: true }
//       );
//     });

//     it('should serialize order data correctly', async () => {
//       const orderData = {
//         uid: 'user123',
//         itemName: 'Pizza',
//         quantity: 2,
//         price: 15.99,
//       };

//       await sendOrder(orderData);

//       const publishedData = mockChannel.publish.mock.calls[0][2];
//       const deserializedData = JSON.parse(publishedData.toString());

//       expect(deserializedData).toEqual(orderData);
//     });

//     it('should use persistent message delivery', async () => {
//       const orderData = { uid: 'user123', itemName: 'Pizza' };

//       await sendOrder(orderData);

//       expect(mockChannel.publish).toHaveBeenCalledWith(
//         'topic_exc',
//         'order.placed',
//         expect.any(Buffer),
//         { persistent: true }
//       );
//     });

//     it('should handle multiple consecutive sends', async () => {
//       const order1 = { uid: 'user1', itemName: 'Pizza' };
//       const order2 = { uid: 'user2', itemName: 'Burger' };

//       await sendOrder(order1);
//       await sendOrder(order2);

//       expect(mockChannel.publish).toHaveBeenCalledTimes(2);
//       expect(mockChannel.publish).toHaveBeenNthCalledWith(
//         1,
//         'topic_exc',
//         'order.placed',
//         Buffer.from(JSON.stringify(order1)),
//         { persistent: true }
//       );
//       expect(mockChannel.publish).toHaveBeenNthCalledWith(
//         2,
//         'topic_exc',
//         'order.placed',
//         Buffer.from(JSON.stringify(order2)),
//         { persistent: true }
//       );
//     });

//     it('should reuse the same channel for multiple sends', async () => {
//       const order1 = { uid: 'user1', itemName: 'Pizza' };
//       const order2 = { uid: 'user2', itemName: 'Burger' };

//       await sendOrder(order1);
//       await sendOrder(order2);

//       // With caching, should only get channel and assert exchange once
//       expect(mockRabbitMQ.getChannel).toHaveBeenCalledTimes(1);
//       expect(mockChannel.assertExchange).toHaveBeenCalledTimes(1);
//       expect(mockChannel.publish).toHaveBeenCalledTimes(2);
//     });
//   });

//   describe('error handling edge cases', () => {
//     it('should handle undefined order data', async () => {
//       await expect(sendOrder(undefined as any)).rejects.toThrow('Failed to send order to queue');
//     });

//     it('should handle null order data', async () => {
//       await expect(sendOrder(null as any)).rejects.toThrow('Failed to send order to queue');
//     });

//     it('should handle order data with circular references', async () => {
//       const circularOrder: any = { uid: 'user123', itemName: 'Pizza' };
//       circularOrder.self = circularOrder;

//       await expect(sendOrder(circularOrder)).rejects.toThrow('Failed to send order to queue');
//     });

//     it('should handle very large order data', async () => {
//       const largeOrder = {
//         uid: 'user123',
//         itemName: 'Pizza',
//         largeData: 'x'.repeat(1000000),
//       };

//       await sendOrder(largeOrder);

//       expect(mockChannel.publish).toHaveBeenCalledWith(
//         'topic_exc',
//         'order.placed',
//         Buffer.from(JSON.stringify(largeOrder)),
//         { persistent: true }
//       );
//     });
//   });
// });
