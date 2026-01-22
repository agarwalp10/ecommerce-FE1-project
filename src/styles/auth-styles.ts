// src/styles/auth-styles.ts

import type { CSSProperties } from "react";

type Styles = Record<string, CSSProperties>;

const styles: Styles = {
    form: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
    },
    fieldset: {
        border: "1px solid #ccc",
        padding: "20px",
        borderRadius: "5px",
        width: "300px",
        margin: "0 auto",
    },
    legend: {
        fontSize: "20px",
        fontWeight: "bold",     
        marginBottom: "10px",
    },
    input: {
        display: "block",
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        width: "100%",
    },
    error: {
        color: "red",
        marginBottom: "10px",   
    },
    success: {
        color: "green",
        marginBottom: "10px",
    },
    button: {
        backgroundColor: "blue",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
    },
    deleteAccountButton: {
        backgroundColor: "red",
        color: "white",
        border: "none",
        padding: "10px",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default styles;