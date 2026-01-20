// src/types/types.ts

// unified product type that works for FakeStore API and Firestore admin-created products 
// helps in type safety and autocompletion across the app

export interface Product {
        // fake store: number
        // firestore: "admin_<docId>"
        id: number | string;

        title: string;
        price: number;
        description: string;
        category: string;
        image: string;

        // FakeStore products have ratings
        rating: {
            rate: number;
            count: number;
        };

        // Optional helper for UI/ debugging
        source?: 'fakestore' | 'admin';
    }

export type Category = string;