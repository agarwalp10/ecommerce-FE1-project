// src/App.tsx

import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
//import Profile from "./pages/Profile"
// import { ProductProvider } from "./context/ProductContext";
import Cart from "./pages/Cart";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// react query client instance handling caching, laoading states, and refetching
const client = new QueryClient();  // react query client for caching and managing server state

function App() {
  return (
    // any children can use react query features
    <QueryClientProvider client={client}>
        <BrowserRouter>
          <Routes>
            {/* Product Listing */}
            <Route path="/" element={<Home />} /> 
            {/* Shopping Cart Page */}
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
