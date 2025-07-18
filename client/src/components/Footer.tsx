import React from "react";

const Footer: React.FC = () => {
  return (
    <>
      <div className="bg-black w-full mt-25"></div>
      <footer className="bg-white border-t border-gray-100 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img src="/Localgrub_logo.png" style={{ maxWidth: "100px" }} />
              </div>
              <p className="text-gray-600 mb-4 max-w-md">
                Connecting you with the best local restaurants in your area.
                Fresh food, fast delivery, supporting your community.
              </p>
              <div className="text-sm text-gray-500">
                © 2024 LocalGrub. All rights reserved.
              </div>
            </div>

            <div>
              <h3 className="text-gray-900 font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/restaurants"
                    className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                  >
                    Restaurants
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-gray-900 font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/help"
                    className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/delivery"
                    className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                  >
                    Delivery Info
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 mt-10 pt-6">
            <div className="flex flex-col md:flex-row justify-center items-center">
              <div className="text-sm text-gray-500 mb-4 md:mb-0">
                Made with ❤️ for your local community
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
