// src/components/navbar.tsx


import { useAuth } from "../../context/AuthContext" // allows access to user and setUser, user info
import { Link } from "react-router-dom"
import "./Navbar.css" // import css for navbar styling
import { isAdminEmail } from "../../utils/isAdmin";

const Navbar = () => {
    const { user } = useAuth(); // get user from auth context

    return (
        <div className="nav-container">
            <Link to="/" className="link">Home</Link>
            <Link to="/cart" className="link">Cart</Link>
            {user ? (
                <>
                    <Link to="/profile" className="link">Profile</Link>

                    {isAdminEmail(user.email) && (
                        <Link to="/admin/products" className="link">Admin Products</Link>
                    )}
                    
                    <Link to="/logout" className="link">Logout</Link>
                </>
            ) : (
                <>
                    <Link to="/register" className="link">Register</Link>
                    <Link to="/login" className="link">Login</Link>
                </>
                
            )}

        </div>

    );
};

export default Navbar