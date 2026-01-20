// src/services/firestoreProducts.ts

// this keeps firestore logic out of the components page
// CRUD operations for admin-created products in Firestore

import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase/firebase";
import type { Product } from "../types/types";

// Firestore document shape for products
// (we do NOT store "id: admin_<docId>" in Firestore, because docId already exists)
// We'll generate that id when reading products.
export type FirestoreProductInput = Omit<Product, "id" | "source">;

// Reads all admin-created products from Firestore and returns them as Product[]
export const getAdminProducts = async (): Promise<Product[]> => {
    const snap = await getDocs(collection(db, "products"));

    return snap.docs.map((d) => {
        const data = d.data() as any;

        return {
            id: `admin_${d.id}`, // unique UI id
            title: data.title ?? "",
            price: Number(data.price ?? 0),
            description: data.description ?? "",
            category: data.category ?? "",
            image: data.image ?? "",
            rating: {
                rate: Number(data?.rating?.rate ?? 0),
                count: Number(data?.rating?.count ?? 0),
            },
            source: "admin",
        };
    });
};

// Create product in Firestore products collection
export const createAdminProduct = async (
    product: FirestoreProductInput,
    createdByUid: string
) => {
    await addDoc(collection(db, "products"), {
        ...product,
        source: "admin",
        createdByUid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
};

// Update product by Firestore docId
export const updateAdminProduct = async (
    docId: string,
    updates: Partial<FirestoreProductInput>
) => {
    await updateDoc(doc(db, "products", docId), {
        ...updates,
        updatedAt: serverTimestamp(),
    });
};

// Delete product by Firestore docId
export const deleteAdminProduct = async (docId: string) => {
    await deleteDoc(doc(db, "products", docId));
};