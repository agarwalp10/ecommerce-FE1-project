

// __tests__ is where our tets will live and where Jest will look to find them 
// We will use Jest and React Testing Library to write ourt tests
// this test will check if the LogOut component renders correctly

// ===== test should verify: 
// signOut function get called when component is rendered
// get it from firebase/auth
// it runs on component mount becuase useEffect runs after render 

// === Snapshot test to verify UI rendering correctly

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Logout from '../pages/Logout'

// Mock firebase/auth signOut
jest.mock("firebase/auth", () => ({
    signOut: jest.fn(() => Promise.resolve()),
}));

// Mock your firebase auth export
jest.mock("../lib/firebase/firebase", () => ({
    auth: { mock: "auth" },
}));


// 2) Import mocked members AFTER mocks (clarity + avoids weird edge cases)
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase/firebase";


describe('Logout Component', () => {
    // 3) Reset mock call history between tests (prevents test bleed)
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("behavior", () => {
        test("calls signOut(auth) on mount", async () => {
            render(<Logout />);
            
            // waitFor is used to wait for async operations
            await waitFor(() => {
                expect(signOut).toHaveBeenCalledTimes(1);
                expect(signOut).toHaveBeenCalledWith(auth);
            });
        });
    });

    describe("render", () => {
        test("render Logout text", () => {
            const { getByText } = render(<Logout />);
            expect(getByText("Logout")).toBeInTheDocument();
        })

        // snapshot test
        test("matches snapshot", () => {
            const { asFragment } = render(<Logout />);
            expect(asFragment()).toMatchSnapshot();
        });
    });
});
