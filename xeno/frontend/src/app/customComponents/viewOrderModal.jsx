"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ViewOrderModal({ open, onClose, order }) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order #{order._id.slice(-6)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 text-sm">
          <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
          <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
          {/* Add more order fields if needed */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
