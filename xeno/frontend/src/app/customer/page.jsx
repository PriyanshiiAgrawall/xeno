"use client";
import { useEffect, useState } from "react";
import AddCustomerModal from "../customComponents/addCustomerModel";
import AddOrderModal from "../customComponents/addOrderModel";
import CustomerProfileModal from "../customComponents/customerProfileModal";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import ViewOrderModal from "../customComponents/viewOrderModal";


export default function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [expandedCustomers, setExpandedCustomers] = useState({});
  const [expandedOrders, setExpandedOrders] = useState({});
  const [customerOrders, setCustomerOrders] = useState({});

  const [loading, setLoading] = useState(true);
  const [showViewOrderModal, setShowViewOrderModal] = useState(false);


  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/getCustomers`);
      
      const data = await res.json();
      console.log(data)
      setCustomers(data.customers || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setLoading(false);
    }
  };

  const fetchCustomerOrders = async (customerId) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/getOrdersByCustomerId?customerId=${customerId}`);
      
      const data = await res.json();
      console.log(data)
      if (res.ok) {
        setCustomerOrders(prev => ({ ...prev, [customerId]: data }));
      } else {
        console.error("Error fetching orders:", data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };


  useEffect(() => {
    fetchCustomers();
  }, []);

  const toggleCustomer = async (customerId) => {
    setExpandedCustomers(prev => {
      const newState = { ...prev, [customerId]: !prev[customerId] };
      if (newState[customerId]) {
        fetchCustomerOrders(customerId);
      }
      return newState;
    });
  };

  const toggleOrder = async (orderId) => {
    setExpandedOrders(prev => {
      const newState = { ...prev, [orderId]: !prev[orderId] };
      if (newState[orderId]) {
        fetchOrderProducts(orderId);
      }
      return newState;
    });
  };

  const openProfile = (customer) => {
    setSelectedCustomer(customer);
    setShowProfileModal(true);
  };

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6">
        <Button onClick={() => setShowCustomerModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <div className="space-y-4">
        {customers.map((customer) => (
          <div key={customer._id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCustomer(customer._id)}
                >
                  {expandedCustomers[customer._id] ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{customer.name}</h3>
                  <p className="text-sm text-gray-500">
                    {customer.email} • {customer.phone}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setShowOrderModal(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Order
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openProfile(customer)}
                >
                  View Profile
                </Button>
              </div>
            </div>

            {/* Orders Section */}
            {expandedCustomers[customer._id] && (
              <div className="mt-4 ml-8 space-y-4">
                {customerOrders[customer._id]?.map((order) => (
                  <div key={order._id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
  <div className="flex items-center gap-2">
    <Button
      variant="ghost"
      size="sm"
      onClick={() => toggleOrder(order._id)}
    >
      {expandedOrders[order._id] ? (
        <ChevronDown className="w-4 h-4" />
      ) : (
        <ChevronRight className="w-4 h-4" />
      )}
    </Button>
    <div className="flex-1">
      <h4 className="font-medium">
        Order #{order._id.slice(-6)}
      </h4>
      <p className="text-sm text-gray-500">
        {new Date(order.orderDate).toLocaleDateString()} • ₹{order.totalAmount}
      </p>
    </div>
  </div>
  <div className="flex gap-2">
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        setSelectedOrder(order);
        setShowViewOrderModal(true);
      }}
    >
      View Order
    </Button>
  </div>
</div>


                   
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modals */}
      <AddCustomerModal
        open={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        onCustomerAdded={(newCustomer) => {
          fetchCustomers().then(() => {
            setExpandedCustomers((prev) => ({ ...prev, [newCustomer._id]: true }));
            setSelectedCustomer(newCustomer); // Set for add order
          });
          setShowCustomerModal(false);
        }}
      />


      <AddOrderModal
        open={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        customerId={selectedCustomer?._id}
        onOrderAdded={(newOrder) => {
          if (selectedCustomer) {
            fetchCustomerOrders(selectedCustomer._id).then(() => {
              setExpandedCustomers(prev => ({ ...prev, [selectedCustomer._id]: true }));
              setExpandedOrders(prev => ({ ...prev, [newOrder._id]: true }));
              setSelectedOrder(newOrder); // Set for adding product
            });
          }
          setShowOrderModal(false);
        }}
      />

      <CustomerProfileModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        customer={selectedCustomer}
      />
      <ViewOrderModal
  open={showViewOrderModal}
  onClose={() => setShowViewOrderModal(false)}
  order={selectedOrder}
/>

     
    </div>
  );
}
