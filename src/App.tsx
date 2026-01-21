// src/App.tsx

import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
//import Profile from "./pages/Profile"
// import { ProductProvider } from "./context/ProductContext";
import Cart from "./pages/Cart";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { AuthProvider } from "./context/AuthContext"; for firebase auth
import { AuthProvider } from "./context/AuthContext";  // for firebase auth
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import AdminProducts from "./pages/AdminProducts";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";


// react query client instance handling caching, laoading states, and refetching
const client = new QueryClient();  // react query client for caching and managing server state

function App() {
  return (
    // any children can use react query features
    <QueryClientProvider client={client}>
      <AuthProvider>  {/* for firebase auth */} 
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* Product Listing */}
            <Route path="/" element={<Home />} /> 
            {/* Shopping Cart Page */}
            <Route path="/cart" element={<Cart />} />
            {/* Register Page */}
            <Route path="/register" element={<Register />} />
            {/* Login Page */}
            <Route path="/login" element={<Login />} />
            {/* Logout Page */}
            <Route path="/logout" element={<Logout />} />

            {/* ====== Protected Route ====== */}

            {/* profile */}
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />

            {/* admin route */}
            <Route path="/admin/products" element={
              <PrivateRoute>
                <AdminProducts />
              </PrivateRoute>
            } />

            {/* orders route */}
            <Route path="/orders" element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            } />
            
            {/* order details route */}
            <Route path="/orders/:orderId" element={
              <PrivateRoute>
                <OrderDetails />
              </PrivateRoute>
            } />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
