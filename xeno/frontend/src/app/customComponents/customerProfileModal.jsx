"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function CustomerProfileModal({ open, onClose, customer }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>{customer?.name}'s Profile</DialogTitle>
        <div className="space-y-2 text-sm">
          <p>Email: {customer?.email}</p>
          <p>Phone: {customer?.phone}</p>
          <p>City: {customer?.city}</p>
          <p>Account Type: {customer?.accountType}</p>
          <p>Total Spend: ₹{customer?.totalSpend}</p>
          <p>Visits: {customer?.numberOfVisits}</p>
          <p>Inactive for {customer?.daysInactive} days</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
