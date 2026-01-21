// src/pages/OrderDetails.tsx

// Order Details page - shows details of a single order
// Uses React Query to fetch order by ID from Firestore
// Displays list of items in the order and total price

import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "../services/firestoreOrders";

const OrderDetails = () => {
    const { orderId } = useParams();

    const formatDate = (timestamp: any) => {
        return timestamp?.toDate().toLocaleString();
    };

    // React Query to fetch order details by ID
    const { data: order, isLoading } = useQuery({
        queryKey: ["order", orderId],
        queryFn: () => getOrderById(orderId!),
        enabled: !!orderId,
    });

    if (isLoading) return <p>Loading...</p>;
    if (!order) return <p>Order not found.</p>;

    return (
        <div className="container py-3">
            <h1>Order Details</h1>
            <p>
                <b>Order Date:</b> {formatDate(order.createdAt)}
            </p>
            {order.items.map((item) => (
                <div key={item.productId} className="border p-2 mb-2">
                    <p>{item.title}</p>
                    <p>{item.quantity} × ${item.price}</p>
                </div>
            ))}

            <h3>Total: ${order.total.toFixed(2)}</h3>
        </div>
    );
};

export default OrderDetails;