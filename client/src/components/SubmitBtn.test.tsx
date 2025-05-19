import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import axios from "axios";
import SubmitBtn from "./SubmitBtn";
import { MemoryRouter } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext";

// --- Mock useNavigate ---
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// --- Mock useAuth ---
const mockGetIdToken = vi.fn();
vi.mock("../authentication/AuthContext", () => ({
    useAuth: () => ({
        user: null, // default: not logged in
        loading: false,
    }),
}));

// --- Mock axios ---
vi.mock("axios");

describe("SubmitBtn", () => {
    const formData = {
        id: 1,
        name: "Test User",
        img: "test.png",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("navigates to /login if user is not logged in", async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <SubmitBtn formData={formData} />
            </MemoryRouter>
        );

        await user.click(screen.getByRole("button", { name: /submit/i }));

        expect(mockNavigate).toHaveBeenCalledWith("/login", {
            state: {
                formData,
                from: "/success",
            },
        });
    });

    it("calls getIdToken, sends data, and navigates if user is logged in", async () => {
        // Override mock to simulate logged-in user
        vi.mocked(await import("../authentication/AuthContext")).useAuth = () => ({
            user: { getIdToken: mockGetIdToken },
            loading: false,
        });

        mockGetIdToken.mockResolvedValue("mock-token");
        vi.mocked(axios.post).mockResolvedValue({ data: "ok" });

        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <SubmitBtn formData={formData} />
            </MemoryRouter>
        );

        await user.click(screen.getByRole("button", { name: /submit/i }));

        expect(mockGetIdToken).toHaveBeenCalled();
        expect(axios.post).toHaveBeenCalledWith(
            "http://localhost:3005/success",
            formData,
            { headers: { Authorization: "Bearer mock-token" } }
        );
        expect(mockNavigate).toHaveBeenCalledWith("/success");
    });
});
