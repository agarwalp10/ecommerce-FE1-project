// src/types/types.ts

/// Product type as per the Fake Store API
// helps in type safety and autocompletion across the app

export interface Product {
        id: number;
        title: string;
        price: number;
        description: string;
        category: string;
        image: string;
        rating: {
            rate: number;
            count: number;
        };
    }

export type Category = string;