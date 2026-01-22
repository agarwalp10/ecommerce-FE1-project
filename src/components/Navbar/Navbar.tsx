// src/components/navbar.tsx


import { useAuth } from "../../context/AuthContext" // allows access to user and setUser, user info
import { Link, NavLink } from "react-router-dom"
import "./Navbar.css" // import css for navbar styling
import { isAdminEmail } from "../../utils/isAdmin";

const Navbar = () => {
    const { user } = useAuth(); // get user from auth context




    return (
        <nav className="nav">
            {/* Brand */}
            <div className="nav-inner">
                <Link to="/" className="brand" >
                    E-Commerce App
                </Link>
            </div>
            {/* Middle: Main links */}
            <div className="nav-links">
                <NavLink to="/" className={({ isActive }) => (isActive ? "link active" : "link")}>
                    Home
                </NavLink>
                <NavLink to="/cart" className={({ isActive }) => (isActive ? "link active" : "link")}>
                    Cart
                </NavLink>

                {user && (
                    <>
                    <NavLink to="/orders" className={({ isActive }) => (isActive ? "link active" : "link")}>
                        Orders
                    </NavLink>

                    {isAdminEmail(user.email) && (
                        <NavLink
                        to="/admin/products"
                        className={({ isActive }) => (isActive ? "link active" : "link")}
                        >
                        Admin
                        </NavLink>
                    )}
                    </>
                )}
            </div>

            {/* Right: Auth links */}
            <div className="nav-actions">
                {user ? (
                    <>
                    <NavLink
                        to="/profile"
                        className={({ isActive }) => (isActive ? "link active" : "link")}
                    >
                        Profile
                    </NavLink>
                    <NavLink 
                        to="/logout" 
                        className={({ isActive }) => (isActive ? "link active" : "link")}>
                        Logout
                    </NavLink>
                    </>
                ) : (
                    <>
                    <NavLink to="/login" 
                        className={({ isActive }) => (isActive ? "link active" : "link")}>
                        Log in
                    </NavLink>
                    <NavLink to="/register" className="btn btn-primary">
                        Register
                    </NavLink>
                    </>
                )}
            </div>

        </nav>
    );
};

export default Navbar;