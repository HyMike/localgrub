import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendEmail } from "../utils/send-email";
import RabbitMQConnection from './rabbitmq-connection';
import orderReadyNotification from './notification-order-ready-consumer';

vi.mock('../utils/send-email');
vi.mock('./rabbitmq-connection');

describe('orderReadyNotification', () => {
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

    describe('RabbitMQ Setup', () => {
        it('should set up RabbitMQ connection and queue correctly', async () => {
            await orderReadyNotification();

            expect(mockConnection.getChannel).toHaveBeenCalled();
            expect(mockChannel.assertExchange).toHaveBeenCalledWith(
                'order_ready_exch',
                'topic',
                { durable: true }
            );
            expect(mockChannel.assertQueue).toHaveBeenCalledWith(
                'orderReadyNotification',
                { durable: true }
            );
            expect(mockChannel.bindQueue).toHaveBeenCalledWith(
                'orderReadyNotification',
                'order_ready_exch',
                'order.ready'
            );
        });

        it('should set up consumer with correct options', async () => {
            await orderReadyNotification();

            expect(mockChannel.consume).toHaveBeenCalledWith(
                'test-queue',
                expect.any(Function),
                { noAck: false }
            );
        });
    });

    describe('Message Processing', () => {
        it('should process order message and send email', async () => {
            const testOrder = {
                name: 'Sarah',
                email: 'sarah@example.com',
                itemName: 'Caesar Salad',
                quantity: 2
            };

            await orderReadyNotification();

            const consumeCallback = mockChannel.consume.mock.calls[0][1];
            const mockMessage = {
                content: Buffer.from(JSON.stringify(testOrder)),
                ack: vi.fn()
            };

            await consumeCallback(mockMessage);

            expect(sendEmail).toHaveBeenCalledWith(
                'sarah@example.com',
                'Your order is ready for pickup, Sarah!',
                expect.stringContaining('Sarah')
            );
        });

        it('should acknowledge message after processing', async () => {
            const testOrder = {
                name: 'John',
                email: 'john@example.com',
                itemName: 'Pizza',
                quantity: 1
            };

            await orderReadyNotification();

            const consumeCallback = mockChannel.consume.mock.calls[0][1];
            const mockMessage = {
                content: Buffer.from(JSON.stringify(testOrder)),
                ack: vi.fn()
            };

            await consumeCallback(mockMessage);

            expect(mockChannel.ack).toHaveBeenCalledWith(mockMessage);
        });

        it('should handle null message gracefully', async () => {
            await orderReadyNotification();

            const consumeCallback = mockChannel.consume.mock.calls[0][1];

            expect(() => consumeCallback(null)).not.toThrow();
        });

        it('should handle malformed JSON gracefully', async () => {
            await orderReadyNotification();

            const consumeCallback = mockChannel.consume.mock.calls[0][1];
            const mockMessage = {
                content: Buffer.from('invalid json'),
                ack: vi.fn()
            };

            expect(() => consumeCallback(mockMessage)).not.toThrow();
        });
    });

    describe('Email Content', () => {
        it('should generate correct email subject with name', async () => {
            const testOrder = {
                name: 'Alice',
                email: 'alice@example.com',
                itemName: 'Burger',
                quantity: 1
            };

            await orderReadyNotification();

            const consumeCallback = mockChannel.consume.mock.calls[0][1];
            const mockMessage = {
                content: Buffer.from(JSON.stringify(testOrder)),
                ack: vi.fn()
            };

            await consumeCallback(mockMessage);

            expect(sendEmail).toHaveBeenCalledWith(
                'alice@example.com',
                'Your order is ready for pickup, Alice!',
                expect.any(String)
            );
        });

        it('should include all order details in HTML email', async () => {
            const testOrder = {
                name: 'Bob',
                email: 'bob@example.com',
                itemName: 'Pizza Margherita',
                quantity: 3
            };

            await orderReadyNotification();

            const consumeCallback = mockChannel.consume.mock.calls[0][1];
            const mockMessage = {
                content: Buffer.from(JSON.stringify(testOrder)),
                ack: vi.fn()
            };

            await consumeCallback(mockMessage);

            const emailCall = vi.mocked(sendEmail).mock.calls[0];
            const htmlContent = emailCall[2];

            expect(htmlContent).toContain('Bob');
            expect(htmlContent).toContain('Pizza Margherita');
            expect(htmlContent).toContain('3');
            expect(htmlContent).toContain('localgrub');
            expect(htmlContent).toContain('✅');
        });

        it('should generate properly formatted HTML email', async () => {
            const testOrder = {
                name: 'TestUser',
                email: 'test@example.com',
                itemName: 'Test Item',
                quantity: 5
            };

            await orderReadyNotification();

            const consumeCallback = mockChannel.consume.mock.calls[0][1];
            const mockMessage = {
                content: Buffer.from(JSON.stringify(testOrder)),
                ack: vi.fn()
            };

            await consumeCallback(mockMessage);

            const emailCall = vi.mocked(sendEmail).mock.calls[0];
            const htmlContent = emailCall[2];

        
            expect(htmlContent).toContain('<div style="font-family: Arial, sans-serif');
            expect(htmlContent).toContain('<h2 style="color: #27ae60;">');
            expect(htmlContent).toContain('<footer style="font-size: 12px; color: #888;">');
            expect(htmlContent).toContain('localgrub');
            expect(htmlContent).toContain('support@localgrub.com');
            expect(htmlContent).toContain('✅ Your order is ready');
        });

        it('should use correct color scheme for ready notification', async () => {
            const testOrder = {
                name: 'Customer',
                email: 'customer@example.com',
                itemName: 'Food',
                quantity: 1
            };

            await orderReadyNotification();

            const consumeCallback = mockChannel.consume.mock.calls[0][1];
            const mockMessage = {
                content: Buffer.from(JSON.stringify(testOrder)),
                ack: vi.fn()
            };

            await consumeCallback(mockMessage);

            const emailCall = vi.mocked(sendEmail).mock.calls[0];
            const htmlContent = emailCall[2];

            expect(htmlContent).toContain('color: #27ae60');
            expect(htmlContent).toContain('border-left: 4px solid #27ae60');
        });
    });

    describe('Error Handling', () => {
        it('should handle RabbitMQ connection errors gracefully', async () => {
            vi.mocked(RabbitMQConnection.getInstance).mockRejectedValue(
                new Error('Connection failed')
            );

            expect(async () => {
                await orderReadyNotification();
            }).not.toThrow();
        });

        it('should handle email sending errors gracefully', async () => {
            vi.mocked(sendEmail).mockRejectedValue(new Error('Email failed'));

            await orderReadyNotification();

            const consumeCallback = mockChannel.consume.mock.calls[0][1];
            const mockMessage = {
                content: Buffer.from(JSON.stringify({
                    name: 'John',
                    email: 'john@example.com',
                    itemName: 'Pizza',
                    quantity: 1
                })),
                ack: vi.fn()
            };

            expect(() => consumeCallback(mockMessage)).not.toThrow();
        });

        it('should handle missing order data gracefully', async () => {
            await orderReadyNotification();

            const consumeCallback = mockChannel.consume.mock.calls[0][1];
            const mockMessage = {
                content: Buffer.from(JSON.stringify({ email: 'test@example.com' })), // Missing fields
                ack: vi.fn()
            };

            expect(() => consumeCallback(mockMessage)).not.toThrow();
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty message content', async () => {
            await orderReadyNotification();

            const consumeCallback = mockChannel.consume.mock.calls[0][1];
            const mockMessage = {
                content: Buffer.from(''),
                ack: vi.fn()
            };

            expect(() => consumeCallback(mockMessage)).not.toThrow();
        });

        // Missing name, itemName, quantity
        it('should handle message with missing required fields', async () => {
            await orderReadyNotification();

            const consumeCallback = mockChannel.consume.mock.calls[0][1];
            const mockMessage = {
                content: Buffer.from(JSON.stringify({
                    email: 'test@example.com'
                
                })),
                ack: vi.fn()
            };

            expect(() => consumeCallback(mockMessage)).not.toThrow();
        });

        it('should handle special characters in order data', async () => {
            const testOrder = {
                name: 'José',
                email: 'jose@example.com',
                itemName: 'Pizza & Wings',
                quantity: 2
            };

            await orderReadyNotification();

            const consumeCallback = mockChannel.consume.mock.calls[0][1];
            const mockMessage = {
                content: Buffer.from(JSON.stringify(testOrder)),
                ack: vi.fn()
            };

            await consumeCallback(mockMessage);

            expect(sendEmail).toHaveBeenCalledWith(
                'jose@example.com',
                'Your order is ready for pickup, José!',
                expect.stringContaining('José')
            );
        });

        it('should handle large quantities correctly', async () => {
            const testOrder = {
                name: 'Customer',
                email: 'customer@example.com',
                itemName: 'Coffee',
                quantity: 100
            };

            await orderReadyNotification();

            const consumeCallback = mockChannel.consume.mock.calls[0][1];
            const mockMessage = {
                content: Buffer.from(JSON.stringify(testOrder)),
                ack: vi.fn()
            };

            await consumeCallback(mockMessage);

            const emailCall = vi.mocked(sendEmail).mock.calls[0];
            const htmlContent = emailCall[2];

            expect(htmlContent).toContain('100');
            expect(htmlContent).toContain('100 × Coffee');
        });
    });

    describe('Console Logging', () => {
        it('should log notification content', async () => {
            const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
            
            const testOrder = {
                name: 'TestUser',
                email: 'test@example.com',
                itemName: 'Test Item',
                quantity: 1
            };

            await orderReadyNotification();

            const consumeCallback = mockChannel.consume.mock.calls[0][1];
            const mockMessage = {
                content: Buffer.from(JSON.stringify(testOrder)),
                ack: vi.fn()
            };

            await consumeCallback(mockMessage);

            expect(consoleSpy).toHaveBeenCalledWith('Sending Out Notifications:', testOrder);
            
            consoleSpy.mockRestore();
        });
    });
});
