// src/types/orders.ts

import { Timestamp } from "firebase/firestore";

// Type definitions for Order and OrderItem in an e-commerce application
export type OrderItem = {
    productId: string | number;
    title: string;
    price: number;
    image: string;
    quantity: number;
};

export type Order = {
    id: string;            // Firestore doc ID
    userId: string;
    createdAt: Timestamp;        // Firestore Timestamp
    items: OrderItem[];
    total: number;
};