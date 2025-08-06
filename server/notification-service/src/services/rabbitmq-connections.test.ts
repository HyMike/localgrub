import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";


vi.mock('amqplib');

vi.mock('dotenv', () => ({
    default: {
        config: vi.fn()
    }
}));

import * as amqp from "amqplib";
import RabbitMQConnection from './rabbitmq-connection';

describe('RabbitMQConnection', () => {
    let rabbitMQConnection: RabbitMQConnection;
    let mockConnection: any;
    let mockChannel: any;


    beforeEach(() => {
        vi.clearAllMocks();
        
     
        (RabbitMQConnection as any).instance = undefined;
        
        mockConnection = {
            createChannel: vi.fn(),
            close: vi.fn(),
            on: vi.fn(),
        };

        mockChannel = {
            close: vi.fn(),
            on: vi.fn(),
        };

        vi.mocked(amqp.connect).mockResolvedValue(mockConnection);
        mockConnection.createChannel.mockResolvedValue(mockChannel);

        rabbitMQConnection = RabbitMQConnection.getInstance();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    
    describe('Singleton Pattern', () => {
        it('should return the same instance when called multiple times', () => {
            const instance1 = RabbitMQConnection;
            const instance2 = RabbitMQConnection;
            
            expect(instance1).toBe(instance2);
        });

    });



    describe('Connection Management', () => {
        it('should establish connection successfully', async () => {
            const connection = await rabbitMQConnection.getConnection();
            
            expect(amqp.connect).toHaveBeenCalledWith('amqp://rabbitmq:5672');
            expect(connection).toBe(mockConnection);
        });
    
        it('should use custom RABBITMQ_URL from environment', async () => {
            const originalUrl = process.env.RABBITMQ_URL;
            process.env.RABBITMQ_URL = 'amqp://custom:5672';
            
            await rabbitMQConnection.getConnection();
            
            expect(amqp.connect).toHaveBeenCalledWith('amqp://custom:5672');
            
            process.env.RABBITMQ_URL = originalUrl;
        })


        it('should return existing connection if already established', async () => {

            const connection1 = await rabbitMQConnection.getConnection();
    
            const connection2 = await rabbitMQConnection.getConnection();
            
            expect(connection1).toBe(connection2);
            expect(amqp.connect).toHaveBeenCalledTimes(1);
        });

        it('should handle connection establishment failure', async () => {
            const connectionError = new Error('Connection failed');
            vi.mocked(amqp.connect).mockRejectedValue(connectionError);
            
            await expect(rabbitMQConnection.getConnection()).rejects.toThrow('Connection failed');
        });
    })



    describe('Channel Management', () => {
        it('should create channel successfully', async () => {
            const channel = await rabbitMQConnection.getChannel();
            
            expect(mockConnection.createChannel).toHaveBeenCalled();
            expect(channel).toBe(mockChannel);
        });

        it('should return existing channel if already created', async () => {
            const channel1 = await rabbitMQConnection.getChannel();
            
            const channel2 = await rabbitMQConnection.getChannel();
            
            expect(channel1).toBe(channel2);
            expect(mockConnection.createChannel).toHaveBeenCalledTimes(1);
        });

        it('should handle channel creation failure', async () => {
            const channelError = new Error('Channel creation failed');
            mockConnection.createChannel.mockRejectedValue(channelError);
            
            await expect(rabbitMQConnection.getChannel()).rejects.toThrow('Channel creation failed');
        });
    });

    describe('Cleanup', () => {
        it('should close channel and connection successfully', async () => {
            await rabbitMQConnection.getChannel();
            await rabbitMQConnection.close();
            
            expect(mockChannel.close).toHaveBeenCalled();
            expect(mockConnection.close).toHaveBeenCalled();
        });

        it('should handle close when no channel or connection exists', async () => {
            await expect(rabbitMQConnection.close()).resolves.not.toThrow();
        });
    });


    describe('Concurrent Connection Requests', () => {
        it('should handle multiple simultaneous connection requests', async () => {
            // Simulate slow connection
            let resolveConnection: (value: any) => void;
            const connectionPromise = new Promise((resolve) => {
                resolveConnection = resolve;
            });
            vi.mocked(amqp.connect).mockReturnValue(connectionPromise as any);
            
            // Start multiple connection requests
            const promise1 = rabbitMQConnection.getConnection();
            const promise2 = rabbitMQConnection.getConnection();
            const promise3 = rabbitMQConnection.getConnection();
            
            // Resolve the connection
            resolveConnection!(mockConnection);
            
            // All promises should resolve to the same connection
            const [connection1, connection2, connection3] = await Promise.all([
                promise1, promise2, promise3
            ]);
            
            expect(connection1).toBe(connection2);
            expect(connection2).toBe(connection3);
            expect(amqp.connect).toHaveBeenCalledTimes(1);
        });

        it('should handle connection failure during concurrent requests', async () => {
            // Simulate slow connection that fails
            let rejectConnection: (error: Error) => void;
            const connectionPromise = new Promise((resolve, reject) => {
                rejectConnection = reject;
            });
            vi.mocked(amqp.connect).mockReturnValue(connectionPromise as any);
            
            // Start multiple connection requests
            const promise1 = rabbitMQConnection.getConnection();
            const promise2 = rabbitMQConnection.getConnection();
            
            // Reject the connection
            rejectConnection!(new Error('Connection failed'));
            
            // All promises should reject
            await expect(Promise.all([promise1, promise2])).rejects.toThrow('Connection failed');
        });
    });

    describe('Connection Lifecycle Events', () => {
        it('should handle connection close event', async () => {
            await rabbitMQConnection.getConnection();
            
            // Get the close event handler
            const closeHandler = mockConnection.on.mock.calls.find(
                call => call[0] === 'close'
            )[1];
            
            // Simulate connection close
            closeHandler();
            
            // Connection and channel should be nullified
            const channel = await rabbitMQConnection.getChannel();
            expect(channel).toBe(mockChannel); // Should create new channel
        });

        it('should handle connection error event', async () => {
            await rabbitMQConnection.getConnection();
            
            // Get the error event handler
            const errorHandler = mockConnection.on.mock.calls.find(
                (call: any[]) => call[0] === 'error'
            )[1];
            
            // Simulate connection error
            errorHandler(new Error('Connection error'));
            
            // Connection and channel should be nullified
            const channel = await rabbitMQConnection.getChannel();
            expect(channel).toBe(mockChannel); // Should create new channel
        });

        it('should handle channel close event', async () => {
            await rabbitMQConnection.getChannel();
            
            // Get the channel close event handler
            const closeHandler = mockChannel.on.mock.calls.find(
                (call: any[])  => call[0] === 'close'
            )[1];
            
            // Simulate channel close
            closeHandler();
            
            // Channel should be nullified
            const channel = await rabbitMQConnection.getChannel();
            expect(channel).toBe(mockChannel); // Should create new channel
        });

        it('should handle channel error event', async () => {
            await rabbitMQConnection.getChannel();
            
            // Get the channel error event handler
            const errorHandler = mockChannel.on.mock.calls.find(
                (call: any[])  => call[0] === 'error'
            )[1];
            
            // Simulate channel error
            errorHandler(new Error('Channel error'));
            
            // Channel should be nullified
            const channel = await rabbitMQConnection.getChannel();
            expect(channel).toBe(mockChannel); // Should create new channel
        });
    });

    
    });
