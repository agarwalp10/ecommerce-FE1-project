
// src/pages/Cart.tsx

// Cart page - view, remove, totals,checkout
// list items, remove button, show total number of products
// and total price, checkout button, 
// checkout confirmation message, clears Redux + sessionStorage cart
// Cart is a global state managed by Redux
// sessionStorage used for persistence across reloads from cartSlice

import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearCart, removeFromCart, updateQuantity } from "../store/cartSlice";
import { Link } from "react-router-dom";

// Cart page component

const Cart: React.FC = () => {
    // Redux hooks to get cart items and dispatch actions
    const dispatch = useAppDispatch(); // to dispatch actions
    const items = useAppSelector((state) => state.cart.items);
    // State for showing checkout confirmation message
    const [checkoutMessage, setCheckoutMessage] = useState("");

    // Total number of products in cart (sum of quantities)
    const totalCount = useMemo(() => {
        return items.reduce((sum, item) => sum + item.quantity, 0);
    }, [items]);

    // Total price (sum of price * quantity)
    const totalPrice = useMemo(() => {
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [items]);

    // Handler for checkout button to show message and clear cart (since API doesn't support real checkout)
    const handleCheckout = () => {
        dispatch(clearCart()); // clears Redux + sessionStorage
        setCheckoutMessage("Checkout complete!");
    };

    // UI for Cart page
    return (
        <div className="container py-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h2>Shopping Cart</h2>
                <Link to="/" className="btn btn-outline-secondary">
                Continue Shopping
                </Link>
            </div>

            {/* Visual feedback for checkout */}
            {checkoutMessage && (
                <div className="alert alert-success">{checkoutMessage}</div>
            )}

            {/* Cart items or empty message */}
            {items.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                

                {/* List of cart items */}
                <div className="d-flex flex-column gap-3">
                    {items.map((item) => (
                    <div
                        key={item.id}
                        className="d-flex align-items-center justify-content-between border rounded p-3"
                    >
                        <div className="d-flex align-items-center gap-3">
                        <img
                            src={item.image}
                            alt={item.title}
                            style={{ width: 60, height: 60, objectFit: "contain" }}
                        />
                        <div>
                            <div className="fw-bold">{item.title}</div>
                            <div>${item.price.toFixed(2)}</div>
                        </div>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                            
                        {/* Count / quantity controls (optional but helpful) */}
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() =>
                            dispatch(
                                updateQuantity({ id: item.id, quantity: item.quantity - 1 })
                            )
                            }
                        >
                            -
                        </button>

                        <span style={{ minWidth: 24, textAlign: "center" }}>
                            {item.quantity}
                        </span>

                        {/* Button to increase quantity */}
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() =>
                            dispatch(
                                updateQuantity({ id: item.id, quantity: item.quantity + 1 })
                            )
                            }
                        >
                            +
                        </button>

                        {/* Remove button */}
                        <button
                            className="btn btn-danger"
                            onClick={() => dispatch(removeFromCart(item.id))}
                        >
                            Remove
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
            {/* Total items and price summary */}
                <div className="m-3">
                    <p className="mb-1">
                    <strong>Total items:</strong> {totalCount}
                    </p>
                    <p className="mb-0">
                    <strong>Total price:</strong> ${totalPrice.toFixed(2)}
                    </p>
                </div>
                {/* Checkout button */}
                <div className="mt-4 d-flex justify-content-end">
                    <button className="btn btn-success" onClick={handleCheckout}>
                    Checkout
                    </button>
                </div>
                </>
            )}
        </div>
    );
};

export default Cart;
