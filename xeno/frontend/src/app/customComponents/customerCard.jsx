// // components/CustomerCard.jsx
// export default function CustomerCard({ customer }) {
//   return (
//     <div className="border rounded-lg p-4 shadow-md bg-white">
//       <h2 className="text-lg font-bold mb-2">{customer.name}</h2>
//       <p><strong>Email:</strong> {customer.email}</p>
//       <p><strong>Phone:</strong> {customer.phone}</p>
//       <p><strong>City:</strong> {customer.city}</p>
//       <p><strong>Account Type:</strong> {customer.accountType}</p>
//       <p><strong>Total Spend:</strong> ₹{customer.totalSpend}</p>
//       <p><strong>Visits:</strong> {customer.numberOfVisits}</p>
//       <p><strong>Inactive Days:</strong> {customer.daysInactive}</p>
//       <p><strong>Last Purchase:</strong> {customer.lastPurchaseDate?.split("T")[0]}</p>
//       <p><strong>Subscribed:</strong> {customer.isSubscribed ? "Yes" : "No"}</p>
//       <p><strong>Top Category:</strong> {customer.mostCategoryOfProductsPurchased}</p>
//     </div>
//   );
// }
