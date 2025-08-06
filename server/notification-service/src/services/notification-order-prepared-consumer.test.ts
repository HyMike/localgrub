import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendEmail } from "../utils/send-email";
import RabbitMQConnection from './rabbitmq-connection';
import notificationsOrderPrepared from './notification-order-prepared-consumer';


vi.mock('../utils/send-email');
vi.mock('./rabbitmq-connection');

describe('notificationsOrderPrepared', () => {
    let mockChannel: any;
    let mockConnection: any;

    beforeEach(() => {
        vi.clearAllMocks();

  
        vi.mocked(sendEmail).mockResolvedValue(undefined);

        mockChannel = {
            assertExchange: vi.fn().mockResolvedValue(undefined),
            assertQueue: vi.fn().mockResolvedValue({ queue: 'test-queue' }),
            bindQueue: vi.fn().mockResolvedValue(undefined),
            consume: vi.fn(),
            ack: vi.fn(),
            nack: vi.fn(),
        };

        mockConnection = {
            getChannel: vi.fn().mockResolvedValue(mockChannel),
        };

        vi.mocked(RabbitMQConnection.getInstance).mockResolvedValue(mockConnection);
    });


    afterEach(() => {
        vi.restoreAllMocks();
    });


    it('should set up RabbitMQ connection and queue correctly', async () => {
        await notificationsOrderPrepared();

        expect(mockConnection.getChannel).toHaveBeenCalled();
        expect(mockChannel.assertExchange).toHaveBeenCalledWith(
            'order_prep_exch',
            'topic',
            { durable: true }
        );
        expect(mockChannel.assertQueue).toHaveBeenCalledWith(
            'orderPreparedNotification',
            { durable: true }
        );
        expect(mockChannel.bindQueue).toHaveBeenCalledWith(
            'orderPreparedNotification',
            'order_prep_exch',
            'order_prepared'
        );
    });

    it('should process order message and send email', async () => {
        const testOrder = {
            email: 'test@example.com',
            firstName: 'John',
            uid: 'user123',
            itemName: 'Pizza',
            quantity: 2
        };

     
        await notificationsOrderPrepared();

        
        const consumeCallback = mockChannel.consume.mock.calls[0][1];
        const mockMessage = {
            content: Buffer.from(JSON.stringify(testOrder)),
            ack: vi.fn()
        };

        
        await consumeCallback(mockMessage);

        expect(sendEmail).toHaveBeenCalledWith(
            'test@example.com',
            'Your order is being prepared, John',
            expect.stringContaining('John')
        );

        const emailCall = vi.mocked(sendEmail).mock.calls[0];
        const htmlContent = emailCall[2];
        
        expect(htmlContent).toContain('John');
        expect(htmlContent).toContain('Pizza');
        expect(htmlContent).toContain('2');
        expect(htmlContent).toContain('localgrub');
    });
    it('should handle missing order data gracefully', async () => {
        await notificationsOrderPrepared();

        const consumeCallback = mockChannel.consume.mock.calls[0][1];
        const mockMessage = {
            content: Buffer.from(JSON.stringify({ email: 'test@example.com' })), // Missing fields
            ack: vi.fn()
        };

        expect(() => consumeCallback(mockMessage)).not.toThrow();
    });

    it('should handle RabbitMQ connection errors', async () => {
        vi.mocked(RabbitMQConnection.getInstance).mockRejectedValue(
            new Error('Connection failed')
        );

        expect(async () => {
            await notificationsOrderPrepared();
        }).not.toThrow();
    });

    it('should handle email sending errors gracefully', async () => {
        vi.mocked(sendEmail).mockRejectedValue(new Error('Email failed'));
        await notificationsOrderPrepared();

        const consumeCallback = mockChannel.consume.mock.calls[0][1];
        const mockMessage = {
            content: Buffer.from(JSON.stringify({
                email: 'test@example.com',
                firstName: 'John',
                itemName: 'Pizza',
                quantity: 1
            })),
            ack: vi.fn()
        };

        expect(() => consumeCallback(mockMessage)).not.toThrow();
    });


})