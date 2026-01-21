// src/pages/Orders.tsx

// Orders page - list all orders for the logged-in user
// Uses React Query to fetch orders from Firestore
// Each order shows order ID and total price, with a link to view details


import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getOrdersByUser } from "../services/firestoreOrders";
import { Link } from "react-router-dom";

// Orders page component
const Orders = () => {
    const { user } = useAuth();

    // Helper to format Firestore Timestamp to readable date
    const formatDate = (timestamp: any) => {
        return timestamp?.toDate().toLocaleString();
    };


    // React Query to fetch orders for the logged-in user
    const { data: orders = [], isLoading } = useQuery({
        queryKey: ["orders", user?.uid],
        queryFn: () => getOrdersByUser(user!.uid),
        enabled: !!user,
    });

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="container py-3">
            <h1>My Orders</h1>

            {/* List of orders */}
            {orders.length === 0 ? (
                <p>No orders yet.</p>
            ) : (
                orders.map((o) => (
                <div key={o.id} className="border p-3 mb-2">
                    <p><b>Order ID:</b> {o.id}</p>
                    <p>
                        <b>Placed:</b> {formatDate(o.createdAt)}
                    </p>

                    <p>
                        <b>Total:</b> ${o.total.toFixed(2)}
                    </p>
                    <Link to={`/orders/${o.id}`}>View Details</Link>
                </div>
                ))
            )}
        </div>
    );
};

export default Orders;