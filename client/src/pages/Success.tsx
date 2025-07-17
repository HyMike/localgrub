const Success = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-xl max-w-md w-full p-8 text-center border border-green-200">
        <svg
          className="mx-auto mb-4 w-16 h-16 text-green-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>

        <h1 className="text-3xl font-bold text-green-600 mb-2">Thank You!</h1>
        <p className="text-gray-700 text-lg mb-4">
          Your order <span className="font-medium"></span> has been placed
          successfully.
        </p>

        <p className="text-gray-600 mb-4">
          It will be ready for pickup in approximately{" "}
          <span className="font-semibold">10–15 minutes</span>.
        </p>

        <p className="text-gray-600 mb-6">
          We'll notify you via email at <span className="font-semibold"></span>{" "}
          once your order is ready.
        </p>

        <a
          href="/"
          style={{ color: "#ffffff" }}
          className="inline-block mt-4 px-6 py-2 bg-[#5797fd] text-white no-underline rounded-md font-semibold shadow hover:brightness-90 transition"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
};
export default Success;
