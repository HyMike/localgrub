import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import LogOutBtn from "./LogOutBtn";
import { useAuth } from "../authentication/AuthContext";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

vi.mock("../authentication/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
  signOut: vi.fn(),
  getAuth: vi.fn(),
}));

describe("LogOutBtn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  // Want to check if user is null if there is no User.
  it("./LogOutBtn", () => {
    (useAuth as vi.Mock).mockReturnValue({ user: null });
    const { container } = render(<LogOutBtn />);
    expect(container).toBeEmptyDOMElement();
  });
  //testing for if there is a user there would be a sign out btn shown.
  it("./LogOutBtn", () => {
    (useAuth as vi.Mock).mockReturnValue({ user: { uid: "charlie" } });
    render(<LogOutBtn />);
    expect(
      screen.getByRole("button", { name: /sign out/i }),
    ).toBeInTheDocument();
  });

  // Testing if logout btn will redirect when clicked to the main page
  it("LogOutBtn", async () => {
    (useAuth as vi.Mock).mockReturnValue({ user: { name: "charlie" } });
    const mockSignOut = signOut as vi.Mock;
    const mockNavigate = vi.fn();
    (useNavigate as vi.mock).mockReturnValue(mockNavigate);

    render(<LogOutBtn />);
    fireEvent.click(screen.getByRole("button", { name: /sign out/i }));

    await waitFor(() => {
      expect(mockSignOut).toBeCalled();
      expect(mockNavigate).toBeCalledWith("/");
    });

    render(<LogOutBtn />);
  });
});
