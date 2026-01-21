// src/pages/Register.tsx

// Register page - allows new users to create an account

import { useState } from "react"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "../lib/firebase/firebase"
import styles from "../styles/auth-styles" 
import { useNavigate } from "react-router-dom"

// we need a state for email, password, displayName, error message

const Register = () => {
    // ==== STATE FOR OUR FORM FIELDS ====
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [displayName, setDisplayName] = useState("")
    const [error, setError] = useState("")

    const navigate = useNavigate();

    // ==== HANDLE FORM SUBMISSION ====
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // prevent default form submission behavior
        setError(""); // reset error messagenpm


        try {
            // 1) create auth user with email and password using firebase auth 
            const userCredential = await createUserWithEmailAndPassword(
                auth, 
                email, 
                password
            );

            // 2) update auth user profile with displayName after use is created 
            await updateProfile(userCredential.user, {
                displayName: displayName
            });
            
            // 3) create a user document in firestore 'users' collection - users(uid), doc id = auth user uid
            const uid = userCredential.user.uid;
            await setDoc(doc(db, "users", uid), {
                uid,
                email, 
                displayName, 
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                age: null,
            });

            // 4) redirect to profile page after successful registration
            navigate("/profile"); // redirect to profile page after successful registration
        } catch (err: any) {
            setError(err.message); // set error message if registration fails
        }
    };

    return (
        <div style={styles.form}>
            <h1>Register</h1>

            {/* when we submit form we want to run handleSubmit */}
            <form onSubmit={handleSubmit}>
                {error && <p style={styles.error}>{error}</p>}
                <fieldset style={styles.fieldset}>
                    <legend style={styles.legend}>Register</legend>

                    <input 
                        style={styles.input}
                        type="email" 
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input 
                        style={styles.input}
                        type="text"
                        placeholder="Name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                    />

                    <input 
                        style={styles.input}
                        type="password" 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Register</button>
                </fieldset>

            </form>
        </div>

    );
};          


export default Register