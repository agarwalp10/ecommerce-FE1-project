// src/pages/AdminProducts.tsx

// using react query to fetch products, create, update, and delete products, and refresh the list 

// src/pages/AdminProducts.tsx

import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { isAdminEmail } from "../utils/isAdmin";
import type { Product } from "../types/types";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
createAdminProduct,
    deleteAdminProduct,
    getAdminProducts,
    updateAdminProduct,
    type FirestoreProductInput,
} from "../services/firestoreAdminProducts";
import styles from "./AdminProducts.module.css";

// convert "admin_<docId>" back to Firestore docId
const getDocIdFromAdminId = (id: string | number) => {
    if (typeof id !== "string") return "";
    return id.startsWith("admin_") ? id.replace("admin_", "") : "";
};

// Admin Products Management Page
const AdminProducts: React.FC = () => {
    const { user, loading } = useAuth();
    const queryClient = useQueryClient();

  // Create form state
    const [form, setForm] = useState<FirestoreProductInput>({
        title: "",
        price: 0,
        description: "",
        category: "",
        image: "",
        rating: { rate: 0, count: 0 },
    });

    // Edit mode state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<FirestoreProductInput>({
        title: "",
        price: 0,
        description: "",
        category: "",
        image: "",
        rating: { rate: 0, count: 0 },
    });

    // check if current user is admin
    const isAdmin = useMemo(() => isAdminEmail(user?.email), [user?.email]);

    // Read: fetch Firestore products
    const {
        data: adminProducts = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["adminProducts"],
        queryFn: getAdminProducts,
        enabled: !!user && isAdmin, // only fetch if logged in AND admin
    });

    // Create mutation
    const createMutation = useMutation({
        mutationFn: async () => {
            if (!user) throw new Error("Not logged in");
            await createAdminProduct(form, user.uid);
        },
        onSuccess: async () => {
            setForm({
                title: "",
                price: 0,
                description: "",
                category: "",
                image: "",
                rating: { rate: 0, count: 0 },
            });
            await queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
            },
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: async () => {
            if (!editingId) throw new Error("No product selected");
            const docId = getDocIdFromAdminId(editingId);
            if (!docId) throw new Error("Invalid product id");
            await updateAdminProduct(docId, editForm);
        },
        onSuccess: async () => {
            setEditingId(null);
            await queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (adminId: string) => {
            const docId = getDocIdFromAdminId(adminId);
            if (!docId) throw new Error("Invalid product id");
            await deleteAdminProduct(docId);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
        },
    });

    // ====== Handlers for form inputs
    const onCreateChange =
        (field: keyof FirestoreProductInput) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const value = e.target.value;

            //  handle nested rating fields separately
            if (field === "rating") return;

            setForm((prev) => ({
                ...prev,
                [field]: field === "price" ? Number(value) : value,
            }));
        };

    const onCreateRatingChange =
        (field: "rate" | "count") => (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setForm((prev) => ({
                ...prev,
                rating: {
                ...prev.rating,
                [field]: field === "count" ? Math.floor(Number(value)) : Number(value),
                },
            }));
        };

    // start editing a product
    const startEdit = (p: Product) => {
        setEditingId(String(p.id));
        setEditForm({
            title: p.title,
            price: p.price,
            description: p.description,
            category: p.category,
            image: p.image,
            rating: {
                rate: p.rating?.rate ?? 0,
                count: p.rating?.count ?? 0,
            },
        });
    };

    const onEditChange =
        (field: keyof FirestoreProductInput) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const value = e.target.value;

            if (field === "rating") return;

            setEditForm((prev) => ({
                ...prev,
                [field]: field === "price" ? Number(value) : value,
            }));
        };

    const onEditRatingChange =
        (field: "rate" | "count") => (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setEditForm((prev) => ({
                ...prev,
                rating: {
                ...prev.rating,
                [field]: field === "count" ? Math.floor(Number(value)) : Number(value),
                },
            }));
        };
    
    //  validation before create/ update
    const validate = (p: FirestoreProductInput) => {
        if (!p.title.trim()) return "Title is required";
        if (!p.category.trim()) return "Category is required";
        if (!p.description.trim()) return "Description is required";
        if (!p.image.trim()) return "Image URL is required";
        if (!Number.isFinite(p.price) || p.price < 0) return "Price must be 0 or higher";
        if (!Number.isFinite(p.rating.rate) || p.rating.rate < 0 || p.rating.rate > 5)
        return "Rating rate must be between 0 and 5";
        if (!Number.isFinite(p.rating.count) || p.rating.count < 0)
        return "Rating count must be 0 or higher";
        return null;
    };

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>Please login.</p>;
    if (!isAdmin) return <p>Not authorized (admin only).</p>;

    // ====== UI ======
    return (
        <div className="container py-3">
            <h1>Admin Product Management</h1>

            {/* ===== CREATE FORM ===== */}
            <div className={styles.panel}>
                <h3>Create Product (Firestore)</h3>

                {createMutation.error && (
                    <p className={styles.error}>
                    {(createMutation.error as any)?.message ?? "Create failed"}
                    </p>
                )}

    
                <div className={styles.form}>
                    {/* Title */}
                    <div className={styles.row}>
                        <label className={styles.label}>Title</label>
                        <input
                            className={styles.input}
                            value={form.title}
                            onChange={onCreateChange("title")}
                        />
                    </div>

                    {/* Price */}
                    <div className={styles.row}>
                        <label className={styles.label}>Price ($)</label>
                        <input
                            className={styles.input}
                            type="number"
                            value={form.price}
                            onChange={onCreateChange("price")}
                        />
                    </div>

                    {/* Category */}
                    <div className={styles.row}>
                        <label className={styles.label}>Category</label>
                        <input
                            className={styles.input}
                            value={form.category}
                            onChange={onCreateChange("category")}
                        />
                    </div>

                    {/* Image URL */}
                    <div className={styles.row}>
                        <label className={styles.label}>Image URL</label>
                        <input
                            className={styles.input}
                            value={form.image}
                            onChange={onCreateChange("image")}
                        />
                    </div>

                    {/* Description */}
                    <div className={`${styles.row} ${styles.rowTop}`}>
                        <label className={`${styles.label} ${styles.labelTop}`}>Description</label>
                        <textarea
                            className={styles.textarea}
                            value={form.description}
                            onChange={onCreateChange("description")}
                        />
                    </div>

                    {/* Rating Rate */}
                    <div className={styles.row}>
                        <label className={styles.label}>Rating (0–5)</label>
                        <input
                            className={styles.smallInput}
                            type="number"
                            value={form.rating.rate}
                            onChange={onCreateRatingChange("rate")}
                        />
                    </div>

                    {/* Rating Count */}
                    <div className={styles.row}>
                        <label className={styles.label}>Review Count</label>
                        <input
                            className={styles.smallInput}
                            type="number"
                            value={form.rating.count}
                            onChange={onCreateRatingChange("count")}
                        />
                    </div>

                    {/* Submit */}
                    <div className={styles.actions}>
                        <button
                            className={styles.button}
                            onClick={() => {
                            const err = validate(form);
                            if (err) return alert(err);
                            createMutation.mutate();
                            }}
                            disabled={createMutation.isPending}
                        >
                            {createMutation.isPending ? "Creating..." : "Create Product"}
                        </button>
                    </div>
                </div>
            </div>


            {/* ===== LIST ===== */}
            <h2>Firestore Products</h2>

            {isLoading && <p>Loading products...</p>}
            {error && <p style={{ color: "crimson" }}>Error loading products.</p>}

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {adminProducts.map((p) => (
                <div
                    key={p.id}
                    style={{ border: "2px solid black", padding: 12, width: 320 }}
                >
                    <p>
                        <b>ID:</b> {String(p.id)}
                    </p>
                    <p>
                        <b>Title:</b> {p.title}
                    </p>
                    <p>
                        <b>Price:</b> ${p.price}
                    </p>
                    <p>
                        <b>Category:</b> {p.category}
                    </p>
                    <p>
                        <b>Rating:</b> {p.rating.rate} ({p.rating.count})
                    </p>

                    <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => startEdit(p)}>Edit</button>
                        <button
                            style={{ backgroundColor: "crimson", color: "white" }}
                            onClick={() => deleteMutation.mutate(String(p.id))}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </button>
                    </div>

                    {/* ===== EDIT FORM (only shows when editing this product) ===== */}
                    {editingId === String(p.id) && (
                        <div style={{ marginTop: 10, borderTop: "1px solid #ddd", paddingTop: 10 }}>
                            <h4>Edit Product</h4>

                            {updateMutation.error && (
                            <p style={{ color: "crimson" }}>
                                {(updateMutation.error as any)?.message ?? "Update failed"}
                            </p>
                            )}

                            <input
                                placeholder="Title"
                                value={editForm.title}
                                onChange={onEditChange("title")}
                            />

                            <input
                                placeholder="Price"
                                type="number"
                                value={editForm.price}
                                onChange={onEditChange("price")}
                            />

                            <input
                                placeholder="Category"
                                value={editForm.category}
                                onChange={onEditChange("category")}
                            />

                            <input
                                placeholder="Image URL"
                                value={editForm.image}
                                onChange={onEditChange("image")}
                            />

                            <textarea
                                placeholder="Description"
                                value={editForm.description}
                                onChange={onEditChange("description")}
                            />

                            <div style={{ display: "flex", gap: 8 }}>
                                <input
                                    placeholder="Rating Rate (0-5)"
                                    type="number"
                                    value={editForm.rating.rate}
                                    onChange={onEditRatingChange("rate")}
                                />
                                <input
                                    placeholder="Rating Count"
                                    type="number"
                                    value={editForm.rating.count}
                                    onChange={onEditRatingChange("count")}
                                />
                            </div>

                            <div style={{ display: "flex", gap: 8 }}>
                                <button
                                    onClick={() => {
                                    const err = validate(editForm);
                                    if (err) return alert(err);
                                    updateMutation.mutate();
                                    }}
                                    disabled={updateMutation.isPending}
                                >
                                    {updateMutation.isPending ? "Saving..." : "Save"}
                                </button>

                                <button onClick={() => setEditingId(null)}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
                ))}
            </div>
        </div>
    );
};

export default AdminProducts;
