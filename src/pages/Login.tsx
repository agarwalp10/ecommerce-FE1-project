// src/pages/Login.tsx

import { useState, useEffect } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"  
import { auth } from "../lib/firebase/firebase"
import styles from "../styles/auth-styles" 
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

// we need a state for email, password, displayName, error message

const Login = () => {
    // ==== STATE FOR OUR FORM FIELDS ====
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
// get user from auth context to check if logged in
    const { user } = useAuth();
    const navigate = useNavigate();

    
    useEffect(() => {
        // if user is already logged in, redirect to profile
        if (user) {
            navigate("/profile");
        }
    }, [user, navigate]);

    // ==== HANDLE FORM SUBMISSION ====
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // prevent default form submission behavior
        setError(""); // reset error message
        try {
            await signInWithEmailAndPassword(
                auth, 
                email, 
                password
            );

            navigate("/profile"); // redirect to profile page after successful registration
        } catch (err: any) {
            setError(err.message); // set error message if registration fails
        }
    };

    return (
        <div style={styles.form}>
            <h1>Login</h1>
            {/* when we submit form we want to run handleSubmit */}
            <form onSubmit={handleSubmit}>
                {error && <p style={styles.error}>{error}</p>}
                <fieldset style={styles.fieldset}>
                    <legend style={styles.legend}>Login</legend>
                    <input 
                        style={styles.input}
                        type="email" 
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                        style={styles.input}
                        type="password" 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Login</button>
                </fieldset>

            </form>
        </div>

    );
};          


export default Login