// src/store/store.ts

// Creates the Redux store to hold global state
// store is the central place to manage global state. Source of truth
// using it for the cart state across the app
// combines reducers

import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

// configureStore from Redux Toolkit to create the store
// includes devtools by default
export const store = configureStore({
    reducer: {
        cart: cartReducer,
    },
})

// Helpful types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;