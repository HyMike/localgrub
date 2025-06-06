LocalGrub 🍔 
Food Delivery Platform

Goal:
Enable customers to order food, notify restaurants, assign drivers, track deliveries, and manage payments—all through asynchronous, event-driven microservices.




Data flow Diagram: 


1. Customer orders food from menu item and checkout with credit card information. The frontend makes a API request to the backend order service.
2. Order service takes customer order information and stores it in the database: Customer information that sent to the order service is: uid, firstName,lastName, email, itemId, itemName, quantity, price, creditCardInfo, createdAt
3. Order Service as a producer will emit to RabbitMQ a order_placed router key. The exchange using a topic method will have consumer that will listen to this thru it's specific topic queue for binding key: order_placed.
4. Order_placed will be consume by multiple microservices (payment service,restaurant service and notification service). Payment Service will consume the message and charge their customer. Notification service will take order_placed message and send out a confirmation email to the customer.
5. Restaurant Service will make an API call to its database upon consuming the order_placed message to check if there is enought incredients to make the menu items the customer order. A boolean is return stating if enough items are available or not.
6. Order_prepared message is emited from restaurant service to the exchange letting order service know to update the order service database for that order as pending.
7. Notification service also consume order_prepared message and send out a email to customer that their is preparing and ready to pick up at a certain time.
8. The restaurant chef has an order managment page. It allows them to access all orders. When the chef marks the order as completed. An API POST request is sent to the order service to mark the order has been completed.
9. Order service makes an API call to its database to update the status of the order to completed.
10. A order_ready is emited to the exchange.
11. Notification Service send out a email to customer letting them know that their order is ready for pickup. 


1.Customer Order Placement
  The customer selects menu items and checks out using their credit card. The frontend application sends an API request to the Order Service, containing all necessary order and payment details.

2. Order Storage
  The Order Service receives the request and stores the order in its database. The following customer and order information is saved:
  uid, firstName, lastName, email, itemId, itemName, quantity, price, creditCardInfo, and createdAt.

4. Event Emission: order_placed
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
  The restaurant chef accesses a dedicated Order Management Dashboard, which displays all incoming and in-progress orders. When the chef marks an order as "Completed", the frontend sends a POST request to the Order       Service.
9. Order Status Update
  The Order Service processes the request and updates the order’s status in its database to "Completed".
10. Event Emission: order_ready
  After successfully updating the order status, the Order Service emits an order_ready event to RabbitMQ, signaling that the order is ready for pickup.
11. Final Notification to Customer
  The Notification Service, listening for the order_ready event, sends a final email to the customer notifying them that their order is ready for pickup.


1. Customer submits order in the frontend
2. Frontend sends API request to the backend (order service) which inserts the order info into a DB and publishes a message to the order.received topic in rabbitmq
3. Restaurant service looks at the order to determine if you have enough of the required ingredients to make this dish. (let's assume yes) Restaurant service prepares the meal and publishes a message order.preparing.
4. The order stays in this state until the chef says the order is ready. At which point he clicks a button in the UI and makes a PUT api request to order service to update the status as "ready" and publish a new message "order.ready"
5. At this point, you can choose to continue the flow and have the user eat their meal and then try to submit a payment after. or you could move payments up in the flow if this is like a food truck or casual dining place where you pay first and then go pick up your food. It depends on what you wanna do.
6. OPTIONAL: At each point of this flow, you can have a NotificationService, that is listening to every message that is being published and sending out notifications to the user about their order. This is where you could really highlight how your system has multiple consumers listening to the same messages and really show off the power of a pub sub pattern.
