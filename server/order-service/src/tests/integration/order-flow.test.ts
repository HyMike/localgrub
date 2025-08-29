import { describe, it, beforeAll, afterAll, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import RabbitMQConnection from '../../services/rabbitmq-connection';

// Mock Firebase Admin for testing using Vitest
const mockFirebase = {
  auth: () => ({
    verifyIdToken: vi.fn().mockResolvedValue({
      uid: 'test-user-123',
      email: 'test@example.com'
    })
  }),
  initializeApp: vi.fn(),
  credential: { cert: vi.fn() },
  firestore: () => ({
    collection: () => ({
      doc: () => ({
        get: () => Promise.resolve({
          exists: true,
          data: () => ({
            name: 'Test User',
            phone: '123-456-7890',
            address: '123 Test St'
          })
        })
      })
    })
  })
};

// Mock Firebase using Vitest's mocking system
vi.mock('firebase-admin', () => mockFirebase);

describe('Order Flow Integration Test', () => {
  let app: express.Application;
  let rabbitmq: RabbitMQConnection;
  let testChannel: any;
  let testOrderId: string;

  beforeAll(async () => {
    // Create test Express app
    app = express();
    app.use(express.json());
    
    // Import routes after mocking Firebase
    const orderRoutes = require('../../routes/orderRoutes').default;
    app.use('/', orderRoutes);

    // Connect to RabbitMQ (from GitHub Actions services)
    try {
      rabbitmq = RabbitMQConnection.getInstance();
      await rabbitmq.getConnection();
      testChannel = await rabbitmq.getChannel();
      
      // Setup test exchange and queues
      await testChannel.assertExchange('topic_exc', 'topic', { durable: true });
      await testChannel.assertQueue('order-queue', { durable: true });
      await testChannel.bindQueue('order-queue', 'topic_exc', 'order.placed');
      
      console.log('✅ RabbitMQ connected successfully');
    } catch (error) {
      console.error('❌ RabbitMQ connection failed:', error);
      throw error;
    }
  }, 30000); // 30 second timeout for setup

  afterAll(async () => {
    if (rabbitmq && testChannel) {
      try {
        // Cleanup test queues
        await testChannel.deleteQueue('order-queue');
        await testChannel.deleteExchange('topic_exc');
      } catch (error: any) {
        console.log('Cleanup warning:', error.message);
      }
      await rabbitmq.close();
    }
  }, 10000);

  beforeEach(async () => {
    if (testChannel) {
      try {
        // Clear any existing messages
        await testChannel.purgeQueue('order-queue');
      } catch (error) {
        // Queue might not exist yet
      }
    }
  });

  it('should create order successfully', async () => {
    const orderData = {
      items: [
        { menuItemId: 'test-item-1', quantity: 2, price: 12.99 },
        { menuItemId: 'test-item-2', quantity: 1, price: 8.99 }
      ],
      totalAmount: 34.97,
      deliveryAddress: '123 Test St, Test City',
      paymentMethod: 'card'
    };

    const orderResponse = await request(app)
      .post('/success')
      .send(orderData)
      .expect(200);

    testOrderId = orderResponse.body.orderId;
    expect(testOrderId).toBeDefined();
    expect(orderResponse.body.message).toBe('Order created successfully');
    
    console.log('✅ Order creation test passed');
  }, 10000);

  it('should queue order in RabbitMQ when available', async () => {
    if (!testChannel) {
      console.log('⏭️  Skipping RabbitMQ test - channel not available');
      return;
    }

    const orderData = {
      items: [{ menuItemId: 'single-item', quantity: 1, price: 15.99 }],
      totalAmount: 15.99,
      deliveryAddress: '456 Another St, Another City',
      paymentMethod: 'cash'
    };

    const orderResponse = await request(app)
      .post('/success')
      .send(orderData)
      .expect(200);

    expect(orderResponse.body.orderId).toBeDefined();
    
    // Verify message is queued - wait longer and handle message format properly
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const message = await testChannel.get('order-queue');
    expect(message).toBeDefined();
    
    // Debug: Log the message structure
    console.log('📨 RabbitMQ message received:', {
      content: message.content,
      fields: message.fields,
      properties: message.properties
    });
    
    // Handle different message formats safely
    let parsedOrder;
    if (message.content) {
      try {
        parsedOrder = JSON.parse(message.content.toString());
      } catch (error) {
        console.log('⚠️  Failed to parse message content:', error);
        // Try alternative parsing if content is Buffer
        if (Buffer.isBuffer(message.content)) {
          parsedOrder = JSON.parse(message.content.toString('utf8'));
        } else {
          throw new Error(`Unexpected message format: ${typeof message.content}`);
        }
      }
    } else {
      // If no content, check if message has data in a different property
      console.log('⚠️  Message has no content property, checking alternatives...');
      if (message.data) {
        parsedOrder = JSON.parse(message.data.toString());
      } else {
        throw new Error('Message has no content or data property');
      }
    }
    
    expect(parsedOrder).toBeDefined();
    expect(parsedOrder.items).toHaveLength(1);
    expect(parsedOrder.totalAmount).toBe(15.99);
    
    // Acknowledge the message
    testChannel.ack(message);
    console.log('✅ RabbitMQ integration test passed');
  }, 20000);

  it('should have working Express app setup', async () => {
    // Test that the app responds to requests
    const response = await request(app)
      .get('/nonexistent')
      .expect(404); // Expected since we don't have this endpoint
    
    console.log('✅ Express app setup test passed');
  });
});
