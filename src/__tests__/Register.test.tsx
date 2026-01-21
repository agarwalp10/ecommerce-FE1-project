// src/__tests__/Register.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Register from "../pages/Register";

// ---- Mock react-router-dom navigate ----
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  // keep other exports if you use them elsewhere
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

// ---- Mock firebase auth functions ----
const mockCreateUserWithEmailAndPassword = jest.fn();
const mockUpdateProfile = jest.fn();

jest.mock("firebase/auth", () => ({
    createUserWithEmailAndPassword: (...args: any[]) =>
        mockCreateUserWithEmailAndPassword(...args),
    updateProfile: (...args: any[]) => mockUpdateProfile(...args),
}));

// ---- Mock firestore functions ----
const mockSetDoc = jest.fn();
const mockDoc = jest.fn();
const mockServerTimestamp = jest.fn(() => "SERVER_TIMESTAMP");

jest.mock("firebase/firestore", () => ({
    setDoc: (...args: any[]) => mockSetDoc(...args),
    doc: (...args: any[]) => mockDoc(...args),
    serverTimestamp: () => mockServerTimestamp(),
}));

// ---- Mock your firebase config exports (auth/db) ----
jest.mock("../lib/firebase/firebase", () => ({
    auth: { __mock: "auth" },
    db: { __mock: "db" },
}));

// ---- The Tests ----

describe("Register Page", () => {
    // Clear mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test 1: Rendering and input state updates
    test("renders Register form and updates input state on typing", async () => {
        const user = userEvent.setup();
        render(<Register />);

        // Rendering checks
        expect(screen.getByRole("heading", { name: /register/i })).toBeInTheDocument();
        const emailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement;
        const nameInput = screen.getByPlaceholderText(/name/i) as HTMLInputElement;
        const passwordInput = screen.getByPlaceholderText(/password/i) as HTMLInputElement;
        const registerBtn = screen.getByRole("button", { name: /register/i });

        expect(emailInput).toBeInTheDocument();
        expect(nameInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(registerBtn).toBeInTheDocument();

        // State changes (controlled inputs)
        await user.type(emailInput, "test@example.com");
        await user.type(nameInput, "Pankaj");
        await user.type(passwordInput, "Password123!");

        expect(emailInput.value).toBe("test@example.com");
        expect(nameInput.value).toBe("Pankaj");
        expect(passwordInput.value).toBe("Password123!");
    });

    // Test 2: Successful form submission flow
    test("submits form, creates user, writes firestore doc, and navigates to /profile", async () => {
        const user = userEvent.setup();

        // Arrange: mock firebase return values
        const fakeUser = { uid: "uid_123" };
        mockCreateUserWithEmailAndPassword.mockResolvedValueOnce({ user: fakeUser });
        mockUpdateProfile.mockResolvedValueOnce(undefined);

        // doc(db, "users", uid) returns a "docRef" object
        const fakeDocRef = { __mock: "docRef" };
        mockDoc.mockReturnValueOnce(fakeDocRef);

        mockSetDoc.mockResolvedValueOnce(undefined);

        render(<Register />);

        // Fill out form
        await user.type(screen.getByPlaceholderText(/email/i), "test@example.com");
        await user.type(screen.getByPlaceholderText(/name/i), "Pankaj");
        await user.type(screen.getByPlaceholderText(/password/i), "Password123!");

        // Click register
        await user.click(screen.getByRole("button", { name: /register/i }));

        // Assert: auth called correctly
        await waitFor(() => {
        expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledTimes(1);
        });

        // We don't assert the exact auth object since it's mocked, but we can assert the important args.
        expect(mockCreateUserWithEmailAndPassword.mock.calls[0][1]).toBe("test@example.com");
        expect(mockCreateUserWithEmailAndPassword.mock.calls[0][2]).toBe("Password123!");

        // Assert: updateProfile called with displayName
        expect(mockUpdateProfile).toHaveBeenCalledWith(fakeUser, { displayName: "Pankaj" });

        // Assert: firestore doc + setDoc called correctly
        expect(mockDoc).toHaveBeenCalledWith(expect.anything(), "users", "uid_123");

        expect(mockSetDoc).toHaveBeenCalledWith(fakeDocRef, {
        uid: "uid_123",
        email: "test@example.com",
        displayName: "Pankaj",
        createdAt: "SERVER_TIMESTAMP",
        updatedAt: "SERVER_TIMESTAMP",
        age: null,
        });

        // Assert: navigate
        await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/profile");
        });
    });

    // Test 3: Handling registration errors
    test("shows an error message if firebase registration fails", async () => {
        const user = userEvent.setup();

        mockCreateUserWithEmailAndPassword.mockRejectedValueOnce(
        new Error("Firebase: Error (auth/email-already-in-use).")
        );

        render(<Register />);

        await user.type(screen.getByPlaceholderText(/email/i), "test@example.com");
        await user.type(screen.getByPlaceholderText(/name/i), "Pankaj");
        await user.type(screen.getByPlaceholderText(/password/i), "Password123!");
        await user.click(screen.getByRole("button", { name: /register/i }));

        // error should render
        expect(
        await screen.findByText(/email-already-in-use/i)
        ).toBeInTheDocument();

        // and should NOT navigate
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
