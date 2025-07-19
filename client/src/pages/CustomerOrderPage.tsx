import Navbar from "../components/NavBar";
import { useCustomerOrderPage } from "../hooks/useCustomerOrder";

const CustomerOrderPage = () => {
  const { allOrders, readyOrder, handleReadyClick, user } =
    useCustomerOrderPage();

  const totalOrders = allOrders.flat().length;
  const completedCount = allOrders
    .flat()
    .filter((order) => readyOrder.has(order.orderId)).length;
  const pendingCount = totalOrders - completedCount;

  return (
    <>
      <Navbar userName={user?.email ?? "Guest"} />
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Customer Orders</h2>
          <p className="text-gray-500">Track and manage customer orders</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <p className="text-sm text-gray-500">Total Orders</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalOrders}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <p className="text-sm text-gray-500">Pending</p>
            <h3 className="text-2xl font-bold text-yellow-500">
              {pendingCount}
            </h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <p className="text-sm text-gray-500">Completed</p>
            <h3 className="text-2xl font-bold text-green-600">
              {completedCount}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <h4 className="text-lg font-semibold text-gray-900">
              Customer Orders ({totalOrders})
            </h4>
          </div>
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="text-left p-4">Item</th>
                <th className="text-left p-4">Quantity</th>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {allOrders
                .flat()
                .map(
                  ({
                    orderId,
                    userId,
                    name,
                    quantity,
                    firstName,
                    lastName,
                  }) => (
                    <tr key={orderId} className="border-t hover:bg-gray-50">
                      <td className="p-4">{name}</td>
                      <td className="p-4">
                        <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">
                          {quantity}x
                        </span>
                      </td>
                      <td className="p-4">
                        {firstName} {lastName}
                      </td> 
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            readyOrder.has(orderId)
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {readyOrder.has(orderId) ? "Completed" : "Not Ready"}
                        </span>
                        {!readyOrder.has(orderId) && (
                          <button
                            onClick={() => handleReadyClick(orderId, userId)}
                            className="ml-3 text-sm text-blue-600 hover:underline"
                          >
                            Mark Ready
                          </button>
                        )}
                      </td>
                    </tr>
                  ),
                )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CustomerOrderPage;
