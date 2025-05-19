import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import LogOutBtn from "./LogOutBtn";

vi.mock("firebase/auth", () => ({
    signOut: vi.fn(() => Promise.resolve()),
}));


vi.mock("../firebase/firebaseConfig", () => ({
    auth: {},
}));

// Mock useNavigate from react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock("../authentication/AuthContext", () => ({
    useAuth: () => ({
        user: { uid: "123", email: "test@example.com" },
    }),
}));

describe("LogOutBtn", () => {
    it("renders the button when user is logged in", () => {
        render(<LogOutBtn />);
        expect(screen.getByText("Log Out")).toBeInTheDocument();
    });

    it("calls signOut and navigates on click", async () => {
        const { signOut } = await import("firebase/auth");
        render(<LogOutBtn />);
        const button = screen.getByText("Log Out");

        await userEvent.click(button);

        expect(signOut).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });
});
