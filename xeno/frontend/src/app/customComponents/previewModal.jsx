import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";

export default function PreviewModal({ rule, onClose }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCustomers, setExpandedCustomers] = useState({});

  const toggleCustomerDetails = (customerId) => {
    setExpandedCustomers(prev => ({
      ...prev,
      [customerId]: !prev[customerId]
    }));
  };

  // Fetch matching customers when the modal is opened or when the rule changes
  useEffect(() => {
    const fetchMatchingCustomers = async () => {
      try {
        setLoading(true);
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/match-customers`, { rule });
        setCustomers(response.data);
        // Initialize all customers as collapsed
        const initialExpandedState = {};
        response.data.forEach(customer => {
          initialExpandedState[customer._id] = false;
        });
        setExpandedCustomers(initialExpandedState);
      } catch (error) {
        console.error("Failed to fetch matching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchingCustomers();
  }, [rule]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto w-[100vw] max-w-[2000px] bg-white dark:bg-gray-900">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Preview Customers
          </DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Showing customers that match your criteria
          </p>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : customers.length > 0 ? (
          <>
            <div className="space-y-4 py-4">
              {customers.map((customer) => (
                <Card
                  key={customer._id}
                  className="flex flex-col shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
                >
                  {/* Basic Info Header - Always Visible */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => toggleCustomerDetails(customer._id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{customer.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{customer.email}</p>
                      </div>
                      <Badge className="ml-2">{customer.accountType}</Badge>
                    </div>
                    {expandedCustomers[customer._id] ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>

                  {/* Detailed Info - Collapsible */}
                  {expandedCustomers[customer._id] && (
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 p-6 pt-0 border-t">
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Phone:</span>{" "}
                          <span className="font-medium text-gray-900 dark:text-white">{customer.phone}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500 dark:text-gray-400">City:</span>{" "}
                          <span className="font-medium text-gray-900 dark:text-white">{customer.city}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Subscribed:</span>{" "}
                          <Badge
                            variant={customer.isSubscribed ? "default" : "outline"}
                            className="ml-1"
                          >
                            {customer.isSubscribed ? "Yes" : "No"}
                          </Badge>
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Total Spend:</span>{" "}
                          <span className="font-medium text-gray-900 dark:text-white">₹{customer.totalSpend}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Visits:</span>{" "}
                          <span className="font-medium text-gray-900 dark:text-white">{customer.numberOfVisits}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Days Inactive:</span>{" "}
                          <span className="font-medium text-gray-900 dark:text-white">{customer.daysInactive}</span>
                        </p>
                      </div>

                      <div className="space-y-2">
                        {customer.lastPurchaseDate && (
                          <p className="text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Last Purchase:</span>{" "}
                            <span className="font-medium text-gray-900 dark:text-white">
                              {new Date(customer.lastPurchaseDate).toLocaleDateString()}
                            </span>
                          </p>
                        )}
                        {customer.mostCategoryOfProductsPurchased && (
                          <p className="text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Favorite Category:</span>{" "}
                            <span className="font-medium text-gray-900 dark:text-white">
                              {customer.mostCategoryOfProductsPurchased}
                            </span>
                          </p>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Customers: <span className="text-primary font-bold">{customers.length}</span>
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-lg text-gray-500 dark:text-gray-400">
              No customers match the criteria.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Try adjusting your filter rules to see more results.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}