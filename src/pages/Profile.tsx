// src/pages/Profile.tsx

// src/pages/Profile.tsx

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile, deleteUser } from "firebase/auth";
import { db } from "../lib/firebase/firebase";
import { doc, getDoc, setDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import styles from "../styles/auth-styles";

type UserDoc = {
    uid: string;
    email: string;
    displayName: string;
    age: number | null;
};

const Profile: React.FC = () => {
    const { user, loading: authLoading } = useAuth();

    // simple form state (like your original)
    const [displayName, setDisplayName] = useState("");
    const [age, setAge] = useState<string>("");

    const [pageLoading, setPageLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

  // 1) Load Firestore user doc ONCE when page loads
    useEffect(() => {
        const loadUserDoc = async () => {
        if (!user) return;

        setError("");
        setSuccess("");
        setPageLoading(true);

        try {
            const userRef = doc(db, "users", user.uid);
            const snap = await getDoc(userRef);

            if (snap.exists()) {
            const data = snap.data() as UserDoc;
            setDisplayName(data.displayName ?? user.displayName ?? "");
            setAge(data.age == null ? "" : String(data.age));
            } else {
            // If Firestore doc doesn't exist yet, fallback to Auth values
            setDisplayName(user.displayName ?? "");
            setAge("");
            }
        } catch (err: any) {
            setError(err?.message ?? "Failed to load profile");
        } finally {
            setPageLoading(false);
        }
        };

        if (!authLoading) loadUserDoc();
    }, [user, authLoading]);

    // 2) Save updates to Firestore + Auth when user clicks Save
    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!user) {
        setError("User not found");
        return;
        }

        if (!displayName.trim()) {
        setError("Name cannot be empty.");
        return;
        }

        const ageValue = age.trim() === "" ? null : Number(age);
        if (ageValue !== null && (!Number.isFinite(ageValue) || ageValue < 0)) {
        setError("Age must be a number 0 or higher.");
        return;
        }

        try {
        setSaving(true);

        const userRef = doc(db, "users", user.uid);

        // Firestore is your profile storage
        // gets existing fields by user.uid, merges with new data
        await setDoc(
            userRef,
            {
            uid: user.uid,
            email: user.email ?? "",
            displayName: displayName.trim(),
            age: ageValue,
            updatedAt: serverTimestamp(),
            },
            { merge: true }
        );

        // keep Auth displayName in sync (optional, but nice)
        await updateProfile(user, { displayName: displayName.trim() });

        setSuccess("Profile saved!");
        } catch (err: any) {
        setError(err?.message ?? "Failed to save profile");
        } finally {
        setSaving(false);
        }
    };

    // 3) Delete: Firestore doc first, then Auth user
    const handleDeleteAccount = async () => {
        setError("");
        setSuccess("");

        if (!user) {
        setError("User not found");
        return;
        }

        try {
        setSaving(true);

        await deleteDoc(doc(db, "users", user.uid));
        await deleteUser(user);

        setSuccess("Account deleted.");
        } catch (err: any) {
        setError(err?.message ?? "Failed to delete (may require recent login).");
        } finally {
        setSaving(false);
        }
    };

    if (authLoading) return <p>Loading...</p>;
    if (!user) return <p>Please login.</p>;
    if (pageLoading) return <p>Loading profile...</p>;

    return (
        <div style={styles.form}>
        <h1>Profile</h1>

        <form onSubmit={handleSave}>
            <input
            style={styles.input}
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Name"
            disabled={saving}
            />

            <input
            style={styles.input}
            disabled
            type="email"
            value={user.email ?? ""}
            placeholder="Email"
            />

            <input
            style={styles.input}
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Age"
            disabled={saving}
            />

            <button style={styles.button} type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save"}
            </button>

            {success && <p style={styles.success}>{success}</p>}
            {error && <p style={styles.error}>{error}</p>}

            <div>
            <button
                type="button"
                onClick={handleDeleteAccount}
                style={styles.deleteAccountButton}
                disabled={saving}
            >
                Delete Account
            </button>
            </div>
        </form>
        </div>
    );
};

export default Profile;
