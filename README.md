LocalGrub 🍔 
Food Delivery Platform

Goal:
Enable customers to order food, notify restaurants, assign drivers, track deliveries, and manage payments—all through asynchronous, event-driven microservices.




Data flow Diagram: 

1.Customer Order Placement
  The customer selects menu items and checks out using their credit card. The frontend application sends an API request to the Order Service, containing all necessary order and payment details.

2. Order Storage
  The Order Service receives the request and stores the order in its database. The following customer and order information is saved:
  uid, firstName, lastName, email, itemId, itemName, quantity, price, creditCardInfo, and createdAt.

3. Event Emission: order_placed
  Acting as a producer, the Order Service publishes an order_placed event to RabbitMQ with a topic-based exchange. The event uses the routing key order_placed, and is routed to all bound queues listening for that topic.

4.Event Consumption – Multiple Services
  The order_placed event is consumed by multiple microservices:
  Payment Service: Charges the customer’s credit card.
  Restaurant Service: Begins processing the order and checks inventory.
  Notification Service: Sends a confirmation email to the customer acknowledging the order.

5. Restaurant Inventory Check
  Upon consuming the order_placed message, the Restaurant Service queries its own database to verify ingredient availability for the ordered items. A boolean response indicates whether the items can be prepared.

6. Event Emission: order_prepared
  If the ingredients are available, the Restaurant Service emits an order_prepared event to RabbitMQ. This informs the Order Service to update the order status to "Pending."

7. Notification: Order in Preparation
  The Notification Service, subscribed to the order_prepared event, sends an email to the customer indicating that their order is being prepared and will be ready for pickup at an estimated time.

8. Order Completion by Chef
  The restaurant chef accesses a dedicated Order Management Dashboard, which displays all incoming and in-progress orders. When the chef marks an order as "Completed", the frontend sends a POST request to the Order Service.

9. Order Status Update
  The Order Service processes the request and updates the order’s status in its database to "Completed".

10. Event Emission: order_ready
  After successfully updating the order status, the Order Service emits an order_ready event to RabbitMQ, signaling that the order is ready for pickup.

11. Final Notification to Customer
  The Notification Service, listening for the order_ready event, sends a final email to the customer notifying them that their order is ready for pickup.
