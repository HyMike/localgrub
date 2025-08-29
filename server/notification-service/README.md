# Notification Service

## Overview

The Notification Service is a backend microservice for the LocalGrub platform. It is responsible for sending email notifications to customers at various stages of the order lifecycle. The service listens for order-related events (such as order placed, order prepared, and order ready) from RabbitMQ and sends appropriate emails using the configured email provider.

---

## Features

- Listens for order events via RabbitMQ
- Sends order confirmation, preparation, and ready-for-pickup emails
- Configurable email provider credentials
- Designed for reliability and scalability

---

## API Documentation

**Note:** This service primarily communicates via RabbitMQ events and doesn't expose REST endpoints. It listens for order events and sends emails asynchronously.

### RabbitMQ Events

#### Consumes:

- `order_placed` - Sends order confirmation email
- `order_prepared` - Sends order preparation notification
- `order_ready` - Sends order ready for pickup notification

### Testing with RabbitMQ Management

1. Access RabbitMQ Management UI: http://localhost:15672 (guest/guest)
2. Navigate to Exchanges → `order_placed`, `order_prepared`, or `order_ready`
3. Publish test messages to trigger email notifications

### Testing with Postman

Import the complete API collection: [localgrub-all.postman_collection.json](../../docs/api/postman-collections/localgrub-all.postman_collection.json)

The collection includes a "Notification Service" section with RabbitMQ Management access for testing event-driven communication.

---

## Environment Variables

This service requires a `.env` file for configuration.

**Setup:**

- Copy `.env.example` to `.env` in this directory.
- Fill in the required values before running the service.

| Variable     | Description                     | Where to get it / Example                    |
| ------------ | ------------------------------- | -------------------------------------------- |
| PORT         | Port the service runs on        | `3001`                                       |
| RABBITMQ_URL | RabbitMQ connection string      | `amqp://rabbitmq:5672` (default for Docker)  |
| EMAIL_USER   | Email provider username         | e.g., Gmail address or SendGrid username     |
| EMAIL_PASS   | Email provider password/API key | e.g., Gmail App Password or SendGrid API key |

> See the main project [README](../../README.md) for more details on environment variables and how to obtain them.

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
# Edit .env and fill in the required values
```

### 3. Run the service (development)

```bash
npm run dev
```

### 4. With Docker

```bash
docker build -t notification-service .
docker run -p 3001:3001 notification-service
```

---

## How It Works

- Subscribes to RabbitMQ events (`order_placed`, `order_prepared`, `order_ready`)
- Parses event data and sends emails to customers using the configured email provider
- Handles errors gracefully and logs failures

---

## Tech Stack

- Node.js
- Express
- TypeScript
- RabbitMQ (amqplib)
- Nodemailer (or similar for sending emails)

---

## Contributing

- Please see the main project [README](../../README.md) for guidelines.

---

## License

This project is licensed under the MIT License.
