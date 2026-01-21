// src/__tests__/addToCart.integration.test.tsx

// INTEGRATION TEST
// Tests the full flow of adding a product to cart from Home page

// React Query data fetch (mocked but still flows through hooks)

// Home page rendering + filtering structure

// ProductCard dispatching Redux action

// Redux store updating cart state

// Home’s cartCount selector updating UI

// React Router navigation to Cart page

// Cart page deriving totals from Redux state


import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import cartReducer from "../store/cartSlice";




// ----------------------
// MOCK: API layer used by React Query
// Home.tsx calls fetchProducts() + fetchCategories()
// ----------------------
// Prevent rating library from breaking JSDOM render
jest.mock("@smastrom/react-rating", () => ({
    Rating: () => <div data-testid="rating" />,
}));

jest.mock("../services/firestoreOrders", () => ({
    createOrder: jest.fn(),
}));

jest.mock("../lib/firebase/firebase", () => ({
    auth: {},
    db: {},
}));

jest.mock("../api/api", () => ({
    fetchProducts: jest.fn(),
    fetchCategories: jest.fn(),
}));

jest.mock("../services/firestoreAdminProducts", () => ({
    getAdminProducts: jest.fn(),
}));

jest.mock("../context/AuthContext", () => ({
    useAuth: () => ({ user: null }),
}));

import Home from "../pages/Home";
import Cart from "../pages/Cart";
import { fetchProducts, fetchCategories } from "../api/api";
import { getAdminProducts } from "../services/firestoreAdminProducts";

function renderApp(initialRoute = "/") {
    const store = configureStore({
        reducer: { cart: cartReducer },
    });

    // fresh client per test so no cache leakage
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });

    return render(
        <Provider store={store}>
        <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={[initialRoute]}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
            </Routes>
            </MemoryRouter>
        </QueryClientProvider>
        </Provider>
    );
}

describe("Integration: Add to Cart flow", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("adds product to cart, updates Cart count, and shows item/totals on Cart page", async () => {
        const user = userEvent.setup();

        // IMPORTANT: include rating.rate because ProductCard renders Rating(value={product.rating.rate})
        (fetchProducts as jest.Mock).mockResolvedValueOnce([
            {
                id: 101,
                title: "Test Product",
                price: 10,
                image: "https://example.com/test.jpg",
                description: "A test product",
                category: "test",
                rating: { rate: 4.2, count: 100 },
            },
        ]);

        (fetchCategories as jest.Mock).mockResolvedValueOnce(["test"]);
        (getAdminProducts as jest.Mock).mockResolvedValueOnce([]); // no firestore products in this test

        renderApp("/");


        // 1) Product appears (proves Home + React Query + ProductCard rendered)
        expect(await screen.findByRole("heading", { name: "Test Product" })).toBeInTheDocument();

        // 2) Cart link shows count = 0 initially
        expect(screen.getByRole("link", { name: "Cart (0)" })).toBeInTheDocument();

        // 3) Click Add to Cart on ProductCard
        await user.click(screen.getByRole("button", { name: /add to cart/i }));

        // 4) Cart count updates to 1 (Redux state + Home selector are working together)
        expect(screen.getByRole("link", { name: "Cart (1)" })).toBeInTheDocument();

        // 5) Navigate to cart page
        await user.click(screen.getByRole("link", { name: "Cart (1)" }));

        // 6) Cart page shows item + totals
        expect(await screen.findByRole("heading", { name: /shopping cart/i })).toBeInTheDocument();
        expect(screen.getByText("Test Product")).toBeInTheDocument();

        // Totals — robust to split nodes
        const totalItemsLine = screen.getByText(/total items:/i).closest("p");
        expect(totalItemsLine).toHaveTextContent("Total items:");
        expect(totalItemsLine).toHaveTextContent("1");

        const totalPriceLine = screen.getByText(/total price:/i).closest("p");
        expect(totalPriceLine).toHaveTextContent("Total price:");
        expect(totalPriceLine).toHaveTextContent("$10.00");
    });
});
