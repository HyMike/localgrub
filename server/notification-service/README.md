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

## Environment Variables

This service requires a `.env` file for configuration.

**Setup:**
- Copy `.env.example` to `.env` in this directory.
- Fill in the required values before running the service.

| Variable      | Description                        | Where to get it / Example                      |
|---------------|------------------------------------|------------------------------------------------|
| PORT          | Port the service runs on           | `3001`                                         |
| RABBITMQ_URL  | RabbitMQ connection string         | `amqp://rabbitmq:5672` (default for Docker)    |
| EMAIL_USER    | Email provider username            | e.g., Gmail address or SendGrid username       |
| EMAIL_PASS    | Email provider password/API key    | e.g., Gmail App Password or SendGrid API key   |

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

## Project Structure

```
notification-service/
├── src/
│   ├── services/
│   │   ├── notification-queue-consumer.ts
│   │   ├── notification-order-prepared-consumer.ts
│   │   ├── notification-order-ready-consumer.ts
│   │   └── rabbitmq-connection.ts
│   ├── utils/
│   │   └── send-email.ts
│   └── index.ts
├── .env.example
├── Dockerfile
├── package.json
└── README.md
```

---

## Contributing

- Please see the main project [README](../../README.md) for guidelines.

---

## License

This project is licensed under the MIT License.
