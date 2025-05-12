"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useEffect } from "react";
const defaultForm = {
  shippingAddress: "",
  totalProducts: 1,
  totalAmount: 0,
  products: [],
  orderStatus: "Processing",
};

 const productsList = [
  { _id: "1", name: "Soap" },
  { _id: "2", name: "Towel" },
  { _id: "3", name: "Chocolate" },
  { _id: "4", name: "Toothpaste" },
  { _id: "5", name: "Shampoo" },
  { _id: "6", name: "Notebook" },
  { _id: "7", name: "Pen" },
  { _id: "8", name: "Biscuits" },
  { _id: "9", name: "Rice" },
  { _id: "10", name: "Sugar" },
  { _id: "11", name: "Salt" },
  { _id: "12", name: "Cooking Oil" },
  { _id: "13", name: "Detergent" },
  { _id: "14", name: "Face Wash" },
  { _id: "15", name: "Toilet Paper" },
  { _id: "16", name: "Milk" },
  { _id: "17", name: "Bread" },
  { _id: "18", name: "Eggs" },
  { _id: "19", name: "Juice" },
  { _id: "20", name: "Sanitizer" },


];

export default function AddOrderModal({ open, onClose, customerId, onOrderAdded }) {
const [form, setForm] = useState(defaultForm);
const [selectedProducts, setSelectedProducts] = useState([]);

 useEffect(() => {
  if (!open) {
    setForm(defaultForm);
    setSelectedProducts([]);
  }
}, [open]);

  const handleProductSelect = (product) => {
    const exists = selectedProducts.find((p) => p._id === product._id);
    if (exists) {
      setSelectedProducts(selectedProducts.filter((p) => p._id !== product._id));
    } else {
      setSelectedProducts([
        ...selectedProducts,
        { ...product, quantity: 1, price: 0 },
      ]);
    }
  };

  const updateProductDetails = (id, field, value) => {
    const updated = selectedProducts.map((product) =>
      product._id === id ? { ...product, [field]: value } : product
    );
    setSelectedProducts(updated);

    // Update total calculations
    const totalProducts = updated.reduce((sum, p) => sum + p.quantity, 0);
    const totalAmount = updated.reduce((sum, p) => sum + p.quantity * p.price, 0);

    setForm({
      ...form,
      products: updated,
      totalProducts,
      totalAmount,
    });
  };

  const handleSubmit = async () => {
    if (!customerId) {
      alert("Please select a customer first");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/addOrder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          customer: customerId,
          orderDate: new Date(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        onOrderAdded?.(data.order);
        onClose();
      } else {
        alert(data.message || "Error creating order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Error creating order");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogTitle>Add Order</DialogTitle>
        <div className="space-y-3">
          {/* Shipping Address */}
          <div>
            <label className="block mb-1">Shipping Address</label>
            <Input
              placeholder="Enter shipping address"
              value={form.shippingAddress}
              onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
              required
            />
          </div>

          {/* Total Products */}
          <div>
            <label className="block mb-1">Total Products</label>
            <Input
              type="number"
              value={form.totalProducts}
              disabled
            />
          </div>

          {/* Total Amount */}
          <div>
            <label className="block mb-1">Total Amount (₹)</label>
            <Input
              type="number"
              value={form.totalAmount}
              disabled
            />
          </div>

          {/* Product Selection */}
          <div>
            <label className="block mb-2">Select Products</label>
            <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto p-2 border rounded">
              {productsList.map((product) => (
                <div
                  key={product._id}
                  className={`p-2 border rounded cursor-pointer ${selectedProducts.find((p) => p._id === product._id) ? 'bg-blue-100' : ''}`}
                  onClick={() => handleProductSelect(product)}
                >
                  {product.name}
                </div>
              ))}
            </div>
          </div>

          {selectedProducts.length > 0 && (
            <div>
              <label className="block mb-2">Selected Products</label>
              <div className="space-y-2">
                {selectedProducts.map((product) => (
                  <div key={product._id} className="p-2 border rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span>{product.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleProductSelect(product)}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-sm">Quantity</label>
                        <Input
                          type="number"
                          min="1"
                          value={product.quantity}
                          onChange={(e) =>
                            updateProductDetails(product._id, "quantity", parseInt(e.target.value))
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm">Price (₹)</label>
                        <Input
                          type="number"
                          min="0"
                          value={product.price}
                          onChange={(e) =>
                            updateProductDetails(product._id, "price", parseFloat(e.target.value))
                          }
                        />
                      </div>
                    </div>
                    <div className="text-sm text-right mt-1">
                      Total: ₹{product.price * product.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Status */}
          <div>
            <label className="block mb-1">Order Status</label>
            <select
              value={form.orderStatus}
              onChange={(e) => setForm({ ...form, orderStatus: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Submit */}
          <Button onClick={handleSubmit} className="w-full">
            Create Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
