// src/services/firestoreProducts.ts

// Service to interact with Firestore for admin-created products
// fetch firstore products, convertd docts to Product type, ensure id is "admin_<docId>""


import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase/firebase";
import type { Product } from "../types/types";

// Reads all admin-created products from Firestore and returns them as Product[]
export const getAdminProducts = async (): Promise<Product[]> => {
    const snap = await getDocs(collection(db, "products"));

    const products: Product[] = snap.docs.map((d) => {
        const data = d.data() as any;

        return {
        //  make id unique and string-based
        id: `admin_${d.id}`,

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

    return products;
};