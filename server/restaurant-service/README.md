# Restaurant Service

## Overview

The Restaurant Service is a backend microservice for the LocalGrub platform. It is responsible for checking inventory, managing order preparation, and emitting order status events. The service listens for order events from RabbitMQ, verifies ingredient availability in its own database, and coordinates with other microservices via event-driven communication.

---

## Features

- Listens for `order_placed` events via RabbitMQ
- Checks inventory and ingredient availability in a PostgreSQL database
- Emits `order_prepared` events to RabbitMQ when an order can be prepared
- Receives order completion updates from the chef dashboard
- Emits `order_ready` events to RabbitMQ
- Designed for reliability and scalability

---

## API Documentation

### Base URL

http://localhost:3003

### Endpoints

#### POST /inventory/incredients-found

Notifies that an order has been prepared and ingredients are available.

**Headers:**
Content-Type: application/json

**Request Body:**

```json
{
  "uid": "user_789",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "itemId": "item_123",
  "itemName": "Classic Burger",
  "quantity": 2,
  "price": 12.99,
  "creditCardInfo": "encrypted_card_data",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "status": "pending"
}
```

**Response:**
Order prepared

### cURL Examples

**Order Prepared Notification:**

```bash
curl -X POST http://localhost:3003/inventory/incredients-found \
  -H "Content-Type: application/json" \
  -d '{
    "uid": "user_789",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "itemId": "item_123",
    "itemName": "Classic Burger",
    "quantity": 2,
    "price": 12.99,
    "creditCardInfo": "encrypted_card_data",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "status": "pending"
  }'
```

### Testing with Postman

Import the complete API collection: [localgrub-all.postman_collection.json](../../docs/api/postman-collections/localgrub-all.postman_collection.json)

---

## Environment Variables

This service requires a `.env` file for configuration.

**Setup:**

- Copy `.env.example` to `.env` in this directory.
- Fill in the required values before running the service.

| Variable     | Description                           | Where to get it / Example                                                                                  |
| ------------ | ------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| PORT         | Port the service runs on              | `3003`                                                                                                     |
| RABBITMQ_URL | RabbitMQ connection string            | `amqp://rabbitmq:5672` (default for Docker)                                                                |
| POSTGRES_URL | PostgreSQL database connection string | [Postgres Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING) |

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
docker build -t restaurant-service .
docker run -p 3003:3003 restaurant-service
```

---

## How It Works

- Listens for `order_placed` events from RabbitMQ
- Checks inventory and ingredient availability in the database
- Emits `order_prepared` events if the order can be fulfilled
- Receives order completion updates and emits `order_ready` events
- Coordinates with Order, Payment, and Notification services via events

---

## Tech Stack

- Node.js
- Express
- TypeScript
- PostgreSQL
- RabbitMQ (amqplib)

---

## Contributing

- Please see the main project [README](../../README.md) for guidelines.

---

## License

This project is licensed under the MIT License.
