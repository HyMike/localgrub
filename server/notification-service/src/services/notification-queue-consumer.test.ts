import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendEmail } from "../utils/send-email";
import RabbitMQConnection from './rabbitmq-connection';
import consumeOrder from './notification-queue-consumer';

vi.mock('../utils/send-email');
vi.mock('./rabbitmq-connection');

describe('consumeOrder', () => {
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
            await consumeOrder();

            expect(mockConnection.getChannel).toHaveBeenCalled();
            expect(mockChannel.assertExchange).toHaveBeenCalledWith(
                'topic_exc',
                'topic',
                { durable: true }
            );
            expect(mockChannel.assertQueue).toHaveBeenCalledWith(
                'orderNotifications',
                { durable: true }
            );
            expect(mockChannel.bindQueue).toHaveBeenCalledWith(
                'orderNotifications',
                'topic_exc',
                'order.placed'
            );
        });

        it('should set up consumer with correct options', async () => {
            await consumeOrder();

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
                email: 'mike@example.com',
                firstName: 'Mike',
                name: 'Chicken Wings',
                quantity: 4
            };

            await consumeOrder();

            const consumeCallback = mockChannel.consume.mock.calls[0][1];
            const mockMessage = {
                content: Buffer.from(JSON.stringify(testOrder)),
                ack: vi.fn()
            };

            await consumeCallback(mockMessage);

            expect(sendEmail).toHaveBeenCalledWith(
                'mike@example.com',
                'We\'ve received your order, Mike!',
                expect.stringContaining('Mike')
            );
        });

        it('should acknowledge message after processing', async () => {
            const testOrder = {
                email: 'alice@example.com',
                firstName: 'Alice',
                name: 'Burger',
                quantity: 1
            };

            await consumeOrder();

            const consumeCallback = mockChannel.consume.mock.calls[0][1];
            const mockMessage = {
                content: Buffer.from(JSON.stringify(testOrder)),
                ack: vi.fn()
            };

            await consumeCallback(mockMessage);

            expect(mockChannel.ack).toHaveBeenCalledWith(mockMessage);
        });

        it('should handle null message', async () => {
            await consumeOrder();

            const consumeCallback = mockChannel.consume.mock.calls[0][1];

            expect(() => consumeCallback(null)).not.toThrow();
        });

        it('should handle malformed JSON', async () => {
            await consumeOrder();

            const consumeCallback = mockChannel.consume.mock.calls[0][1];
            const mockMessage = {
                content: Buffer.from('invalid json'),
                ack: vi.fn()
            };

            expect(() => consumeCallback(mockMessage)).not.toThrow();
        });
    });

    describe('Email Content', () => {
        it('should generate correct email subject with firstName', async () => {
            const testOrder = {
                email: 'sarah@example.com',
                firstName: 'Sarah',
                name: 'Caesar Salad',
                quantity: 2
            };

            await consumeOrder();

            const consumeCallback = mockChannel.consume.mock.calls[0][1];
            const mockMessage = {
                content: Buffer.from(JSON.stringify(testOrder)),
                ack: vi.fn()
            };

            await consumeCallback(mockMessage);

            expect(sendEmail).toHaveBeenCalledWith(
                'sarah@example.com',
                'We\'ve received your order, Sarah!',
                expect.any(String)
            );
        });

        it('should include all order details in HTML email', async () => {
            const testOrder = {
                email: 'bob@example.com',
                firstName: 'Bob',
                name: 'Pizza Margherita',
                quantity: 3
            };

            await consumeOrder();

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
            expect(htmlContent).toContain('🍴');
        });

        it('should generate properly formatted HTML email', async () => {
            const testOrder = {
                email: 'test@example.com',
                firstName: 'TestUser',
                name: 'Test Item',
                quantity: 5
            };

            await consumeOrder();

            const consumeCallback = mockChannel.consume.mock.calls[0][1];
            const mockMessage = {
                content: Buffer.from(JSON.stringify(testOrder)),
                ack: vi.fn()
            };

            await consumeCallback(mockMessage);

            const emailCall = vi.mocked(sendEmail).mock.calls[0];
            const htmlContent = emailCall[2];

            expect(htmlContent).toContain('<div style="font-family: Arial, sans-serif');
            expect(htmlContent).toContain('<h2 style="color: #e67e22;">');
            expect(htmlContent).toContain('<footer style="font-size: 12px; color: #888;">');
            expect(htmlContent).toContain('localgrub');
            expect(htmlContent).toContain('support@localgrub.com');
            expect(htmlContent).toContain('🍴 Thanks for your order');
        });

        it('should use correct color scheme for order confirmation', async () => {
            const testOrder = {
                email: 'customer@example.com',
                firstName: 'Customer',
                name: 'Food',
                quantity: 1
            };

            await consumeOrder();

            const consumeCallback = mockChannel.consume.mock.calls[0][1];
            const mockMessage = {
                content: Buffer.from(JSON.stringify(testOrder)),
                ack: vi.fn()
            };

            await consumeCallback(mockMessage);

            const emailCall = vi.mocked(sendEmail).mock.calls[0];
            const htmlContent = emailCall[2];

            // Check for orange color scheme (order confirmation)
            expect(htmlContent).toContain('color: #e67e22');
            expect(htmlContent).toContain('border-left: 4px solid #e67e22');
        });
    });

    describe('Error Handling', () => {
        it('should handle RabbitMQ connection errors gracefully', async () => {
            vi.mocked(RabbitMQConnection.getInstance).mockRejectedValue(
                new Error('Connection failed')
            );

            expect(async () => {
                await consumeOrder();
            }).not.toThrow();
        });

        it('should handle email sending errors gracefully', async () => {
            vi.mocked(sendEmail).mockRejectedValue(new Error('Email failed'));

            await consumeOrder();

            const consumeCallback = mockChannel.consume.mock.calls[0][1];
            const mockMessage = {
                content: Buffer.from(JSON.stringify({
                    email: 'test@example.com',
                    firstName: 'John',
                    name: 'Pizza',
                    quantity: 1
                })),
                ack: vi.fn()
            };

            expect(() => consumeCallback(mockMessage)).not.toThrow();
        });

        it('should handle missing order data gracefully', async () => {
            await consumeOrder();

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
            await consumeOrder();

            const consumeCallback = mockChannel.consume.mock.calls[0][1];
            const mockMessage = {
                content: Buffer.from(''),
                ack: vi.fn()
            };

    
            expect(() => consumeCallback(mockMessage)).not.toThrow();
        });

        it('should handle message with missing required fields', async () => {
            await consumeOrder();

            const consumeCallback = mockChannel.consume.mock.calls[0][1];
            const mockMessage = {
                content: Buffer.from(JSON.stringify({
                    email: 'test@example.com'
                    // Missing firstName, name, quantity
                })),
                ack: vi.fn()
            };

            expect(() => consumeCallback(mockMessage)).not.toThrow();
        });

        it('should handle special characters in order data', async () => {
            const testOrder = {
                email: 'jose@example.com',
                firstName: 'José',
                name: 'Pizza & Wings',
                quantity: 2
            };

            await consumeOrder();

            const consumeCallback = mockChannel.consume.mock.calls[0][1];
            const mockMessage = {
                content: Buffer.from(JSON.stringify(testOrder)),
                ack: vi.fn()
            };

            await consumeCallback(mockMessage);

            expect(sendEmail).toHaveBeenCalledWith(
                'jose@example.com',
                'We\'ve received your order, José!',
                expect.stringContaining('José')
            );
        });

        it('should handle large quantities correctly', async () => {
            const testOrder = {
                email: 'customer@example.com',
                firstName: 'Customer',
                name: 'Coffee',
                quantity: 100
            };

            await consumeOrder();

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
                email: 'test@example.com',
                firstName: 'TestUser',
                name: 'Test Item',
                quantity: 1
            };

            await consumeOrder();

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