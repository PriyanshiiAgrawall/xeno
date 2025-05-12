"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
  import { useEffect } from "react";
const defaultForm = {
name: "",
    email: "",
    phone: "",
    city: "",
    accountType: "New",
    totalSpend: 0,
    numberOfVisits: 0,
    daysInactive: 0,
    lastPurchaseDate: "",
    isSubscribed: "Yes",
    mostCategoryOfProductsPurchased: "",
};
export default function AddCustomerModal({ open, onClose, onCustomerAdded }) {
  const [form, setForm] = useState(defaultForm);



useEffect(() => {
  if (!open) {
    setForm(defaultForm);
  
  }
}, [open]);



  const handleSubmit = async () => {
    console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/addCustomer`)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/addCustomer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        onCustomerAdded(data.customer);
        onClose();
      } else {
        alert(data.message || "Error creating customer");
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      alert("Error creating customer");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogTitle>Add New Customer</DialogTitle>
        <div className="space-y-3">
          <div>
            <label className="block">Name</label>
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block">Email</label>
            <Input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block">Phone</label>
            <Input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block">City</label>
            <Input
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>

          <div>
            <label className="block">Account Type</label>
            <select
              value={form.accountType}
              onChange={(e) => setForm({ ...form, accountType: e.target.value })}
              className="w-full border p-2 rounded"
            >
              <option value="New">New</option>
              <option value="VIP">VIP</option>
              <option value="Regular">Regular</option>
            </select>
          </div>

          <div>
            <label className="block">Total Spend (₹)</label>
            <div className="flex items-center border rounded">
              <span className="px-2 text-gray-500">₹</span>
              <Input
                type="number"
                placeholder="Total Spend"
                value={form.totalSpend}
                onChange={(e) =>
                  setForm({ ...form, totalSpend: parseFloat(e.target.value) })
                }
                className="border-none focus:ring-0"
              />
            </div>
          </div>

          <div>
            <label className="block">Number of Visits</label>
            <Input
              type="number"
              placeholder="Number of Visits"
              value={form.numberOfVisits}
              onChange={(e) =>
                setForm({ ...form, numberOfVisits: parseInt(e.target.value) })
              }
            />
          </div>

          <div>
            <label className="block">Days Inactive</label>
            <Input
              type="number"
              placeholder="Days Inactive"
              value={form.daysInactive}
              onChange={(e) =>
                setForm({ ...form, daysInactive: parseInt(e.target.value) })
              }
            />
          </div>

          <div>
            <label className="block">Last Purchase Date</label>
            <Input
              type="date"
              value={form.lastPurchaseDate}
              onChange={(e) =>
                setForm({ ...form, lastPurchaseDate: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block">Subscribed</label>
            <select
              value={form.isSubscribed}
              onChange={(e) => setForm({ ...form, isSubscribed: e.target.value })}
              className="w-full border p-2 rounded"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div>
            <label className="block">Most Category of Products Purchased</label>
            <select
              value={form.mostCategoryOfProductsPurchased}
              onChange={(e) =>
                setForm({
                  ...form,
                  mostCategoryOfProductsPurchased: e.target.value,
                })
              }
              className="w-full border p-2 rounded"
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Groceries">Groceries</option>
              <option value="Home Appliances">Home Appliances</option>
            </select>
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
