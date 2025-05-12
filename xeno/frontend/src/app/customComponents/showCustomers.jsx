"use client";
import { useEffect, useState } from "react";
import CustomerCard from "./customerCard";

export default function ShowCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/getCustomers`)
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data.customers || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching customers:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!customers.length) return <p>No customers found.</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
      {customers.map((customer) => (
        <CustomerCard key={customer._id} customer={customer} />
      ))}
    </div>
  );
}
