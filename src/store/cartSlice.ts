// src/store/cartSlice.ts

// using Redux Toolkit to create slice - 'cart' slice to manage cart state globally
// add/update/remove/clear
// every time cart changes, we save it back to the sessionStorage
// stores items in Redux + sessionStorage for persistence across reloads
// this is shared state across multiple components/pages

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../types/types";


// Cart item type or shape, representing a product in the cart with quantity
// storing only necessary fields
export interface CartItem {
    id: Product["id"]; // number | string
    title: string;
    price: number;
    image: string;
    quantity: number;
}

// Cart state shape
interface CartState {
    // store cart as an array of product objects with its quantity
    items: CartItem[];
}

// ==== sessionStorage  ====
// load and save cart state to sessionStorage for persistence across reloads
const CART_KEY = "cart";

// load initial state from sessionStorage
function loadCartFromSession(): CartItem[] {
    try {
        const raw = sessionStorage.getItem(CART_KEY);
        if (!raw) return [];
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

// save cart to sessionStorage
function saveCartToSession(items: CartItem[]) {
    sessionStorage.setItem(CART_KEY, JSON.stringify(items));
}

// initial state - loads cart from sessionStorage
const initialState: CartState = {
    items: loadCartFromSession(),
};

// Slice - reducers + actions
// add, update, remove, clear 
const cartSlice = createSlice({
    name: "cart",
    initialState,
    // reducers to handle cart actions and update state
    reducers: {
        // Add product from Home listing
        addToCart: (state, action: PayloadAction<Product>) => {
            const product = action.payload;
            const existing = state.items.find((i) => i.id === product.id);

            if (existing) {
                existing.quantity += 1;
            } else {
                state.items.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: 1,
                });
            }

            // Persist after change
            saveCartToSession(state.items);
        },

        // Update quantity (optional but useful)
        updateQuantity: (
            state,
            action: PayloadAction<{ id: Product["id"]; quantity: number }>
            ) => {
            const { id, quantity } = action.payload;
            const item = state.items.find((i) => i.id === id);
            if (!item) return;

            if (quantity <= 0) {
                state.items = state.items.filter((i) => i.id !== id);
            } else {
                item.quantity = quantity;
            }

            saveCartToSession(state.items);
        },

        // Remove item completely (per your requirement)
        removeFromCart: (state, action: PayloadAction<Product["id"]>) => {
            state.items = state.items.filter((i) => i.id !== action.payload);
            saveCartToSession(state.items);
        },

        // Checkout (simulated): clear Redux + sessionStorage
        clearCart: (state) => {
            state.items = [];
            sessionStorage.removeItem(CART_KEY);
        },
    },
});

// Exporting actions and reducer
export const { addToCart, updateQuantity, removeFromCart, clearCart } =
    cartSlice.actions;

export default cartSlice.reducer;