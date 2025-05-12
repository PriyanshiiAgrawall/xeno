import { Button } from "@/components/ui/button";

export default function DashboardControls({ onAddCustomer, onAddOrder, onAddProduct }) {
  return (
    <div className="flex gap-4 mb-6">
      <Button onClick={onAddCustomer}>+ Customer</Button>
      <Button onClick={onAddOrder}>+ Order</Button>
      <Button onClick={onAddProduct}>+ Product</Button>
    </div>
  );
}
