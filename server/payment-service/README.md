# Payment Service

## Overview

The Payment Service is a backend microservice for the LocalGrub platform. It is responsible for processing customer payments when an order is placed. The service listens for order events from RabbitMQ, charges the customer using the configured payment gateway, and emits payment status events as needed.

**Scope:**
Solo MVP project – Designed and developed backend microservice

---

## Features

- Listens for `order_placed` events via RabbitMQ
- Processes payments using a payment gateway (e.g., Stripe, PayPal)
- Emits payment status events
- Designed for reliability and scalability

---

## API Documentation

**Note:** This service primarily communicates via RabbitMQ events and doesn't expose REST endpoints. It listens for `order_placed` events and processes payments asynchronously.

### RabbitMQ Events

#### Consumes:

- `order_placed` - Triggers payment processing

#### Produces:

- Payment success/failure events

### Testing with RabbitMQ Management

1. Access RabbitMQ Management UI: http://localhost:15672 (guest/guest)
2. Navigate to Exchanges → `order_placed`
3. Publish test messages to trigger payment processing

### Testing with Postman

Import the complete API collection: [localgrub-all.postman_collection.json](../../docs/api/postman-collections/localgrub-all.postman_collection.json)

The collection includes a "Payment Service" section with RabbitMQ Management access for testing event-driven communication.

---

## Environment Variables

This service requires a `.env` file for configuration.

**Setup:**

- Copy `.env.example` to `.env` in this directory.
- Fill in the required values before running the service.

| Variable            | Description                | Where to get it / Example                                                                                     |
| ------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------- |
| PORT                | Port the service runs on   | `3002`                                                                                                        |
| RABBITMQ_URL        | RabbitMQ connection string | `amqp://rabbitmq:5672` (default for Docker)                                                                   |
| PAYMENT_GATEWAY_KEY | Payment processor API key  | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) or [PayPal Developer](https://developer.paypal.com/) |

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
docker build -t payment-service .
docker run -p 3002:3002 payment-service
```

---

## How It Works

- Listens for `order_placed` events from RabbitMQ
- Processes payments using the configured payment gateway
- Emits payment status events (e.g., payment success/failure)
- Integrates with other services via event-driven communication

---

## Tech Stack

- Node.js
- Express
- TypeScript
- RabbitMQ (amqplib)
- [Stripe](https://stripe.com/) or [PayPal](https://paypal.com/) (or other payment gateway)

---

## Contributing

- Please see the main project [README](../../README.md) for guidelines.

---

## License

This project is licensed under the MIT License.
