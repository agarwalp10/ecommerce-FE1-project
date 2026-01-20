// src/utils/isAdmin.ts

// Update this list for your actual admin email
const ADMIN_EMAILS = [
    "admin10@gmail.com",
];

export const isAdminEmail = (email?: string | null) => {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email);
};