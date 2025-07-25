# Order Service

## Overview

The Order Service is a backend microservice for the LocalGrub platform. It is responsible for handling order creation, updating order status, and emitting order-related events to RabbitMQ. This service acts as the central point for order management and coordinates with other microservices (Payment, Restaurant, Notification) via event-driven communication.

---

## Features

- Receives and stores new customer orders
- Emits `order_placed` events to RabbitMQ
- Updates order status (e.g., to "Completed")
- Emits `order_ready` events to RabbitMQ
- Integrates with Firebase for authentication and Firestore for order storage
- Designed for reliability and scalability

---

## Environment Variables

This service requires a `.env` file for configuration.

**Setup:**

- Copy `.env.example` to `.env` in this directory.
- Fill in the required values before running the service.

| Variable              | Description                 | Where to get it / Example                                                   |
| --------------------- | --------------------------- | --------------------------------------------------------------------------- |
| PORT                  | Port the service runs on    | `3005`                                                                      |
| RABBITMQ_URL          | RabbitMQ connection string  | `amqp://rabbitmq:5672` (default for Docker)                                 |
| FIREBASE_PROJECT_ID   | Firebase Project ID         | [Firebase Console](https://console.firebase.google.com/)                    |
| FIREBASE_PRIVATE_KEY  | Firebase Admin private key  | [Firebase Console > Service Accounts](https://console.firebase.google.com/) |
| FIREBASE_CLIENT_EMAIL | Firebase Admin client email | [Firebase Console > Service Accounts](https://console.firebase.google.com/) |

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
docker build -t order-service .
docker run -p 3005:3005 order-service
```

---

## How It Works

- Receives order requests from the frontend
- Stores order data in Firestore
- Publishes `order_placed` events to RabbitMQ
- Listens for order status updates and emits `order_ready` events
- Coordinates with Payment, Restaurant, and Notification services via events

---

## Tech Stack

- Node.js
- Express
- TypeScript
- Firebase Admin SDK (Firestore, Auth)
- RabbitMQ (amqplib)

---

## Contributing

- Please see the main project [README](../../README.md) for guidelines.

---

## License

This project is licensed under the MIT License.
