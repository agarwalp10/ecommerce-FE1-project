// src/services/firestoreOrders.ts

// Service functions for managing orders in Firestore
// Includes creating orders and fetching orders by user or by order ID


import { addDoc, collection, serverTimestamp, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase/firebase";
import type { CartItem } from "../store/cartSlice";
import type { Order } from "../types/orders";
import { orderBy } from "firebase/firestore";

// ===== Create an order from cart items =====

export async function createOrder(
    userId: string,
    cartItems: CartItem[]
) {
    // Calculate total price
    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // Prepare order data
    const order = {
        userId,
        createdAt: serverTimestamp(),
        items: cartItems.map((i) => ({
            productId: i.id,
            title: i.title,
            price: i.price,
            image: i.image,
            quantity: i.quantity,
        })),
        total,
    };

    // Save order to Firestore
    const docRef = await addDoc(collection(db, "orders"), order);
    return docRef.id;
}

// ===== Fetch all orders for a user =====

export async function getOrdersByUser(userId: string): Promise<Order[]> {
    const q = query(
        collection(db, "orders"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    return snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Order, "id">),
    }));
}

// ===== Fetch a single order by id =====
export async function getOrderById(orderId: string): Promise<Order | null> {
    const ref = doc(db, "orders", orderId);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return {
        id: snap.id,
        ...(snap.data() as Omit<Order, "id">),
    };
}
