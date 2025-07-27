import { vi, it, expect, describe, beforeEach } from "vitest";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import SignUp from "./SignUp";
import { SignUpUser } from "../services/authService";

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("../services/authService", () => ({
  SignUpUser: vi.fn(),
}));

describe("SignUp", () => {
  const mockNavigate = vi.fn();
  const SignUpMock = SignUpUser as any;

  const testUserData = {
    firstName: "Russell",
    lastName: "Johnson",
    email: "RussellJohnson@gmail.com",
    password: "Russell123",
  };

  const fillOutSignUpForm = () => {
    const firstNameInput = screen.getByPlaceholderText("First Name");
    const lastNameInput = screen.getAllByPlaceholderText("Last Name")[0];
    const emailInput = screen.getAllByPlaceholderText("Email")[0];
    const passwordInput = screen.getAllByPlaceholderText("Password")[0];

    fireEvent.change(firstNameInput, { target: { value: "Russell" } });
    fireEvent.change(lastNameInput, { target: { value: "Johnson" } });
    fireEvent.change(emailInput, {
      target: { value: "RussellJohnson@gmail.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "Russell123" } });
  };
  const submitSignUpForm = () => {
    fireEvent.submit(screen.getByRole("button", { name: /sign up/i }));
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as vi.mock).mockReturnValue(mockNavigate);
    SignUpMock.mockResolvedValue(undefined);
  });

  // Test if the forms are showing up.
  (it("Make sure the fields are rendering"),
    () => {
      render(<SignUp />);
      expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /sign up/i }),
      ).toBeInTheDocument();
    });

  //Test to make sure the form works when type on
  it("Test for Changes On First Name Input Works", () => {
    render(<SignUp />);
    const firstNameInput = screen.getByPlaceholderText("First Name");
    fireEvent.change(firstNameInput, { target: { value: "adrianne" } });
    expect(firstNameInput).toHaveValue("adrianne");
  });

  it("Test for form submission to pass the correct data", async () => {
    render(<SignUp />);
    fillOutSignUpForm();
    submitSignUpForm();

    await waitFor(() => {
      expect(SignUpMock).toBeCalledWith(
        testUserData.email,
        testUserData.password,
        {
          email: testUserData.email,
          firstName: testUserData.firstName,
          lastName: testUserData.lastName,
        },
      );
    });
  });

  it("Test redirection to success page", async () => {
    render(<SignUp />);

    fillOutSignUpForm();
    submitSignUpForm();
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/success");
    });
  });

  it("Handle errors gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    SignUpMock.mockRejectedValue(new Error("Signup Failure"));

    render(<SignUp />);

    fillOutSignUpForm();
    submitSignUpForm();
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error logging out:",
        expect.any(Error),
      );
    });
  });

  it("Test for form submission not submitting on blank", async () => {
    render(<SignUp />);
    const form = screen.getByTestId("signup-form");
    fireEvent.submit(form);
    expect(SignUpMock).not.toBeCalled();
  });
  it("Test to validate email need be in the right format", async () => {
    render(<SignUp />);

    const emailInput = screen.getByPlaceholderText("Email");
    expect(emailInput).toHaveAttribute("type", "email");
  });
});

// import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import { vi } from "vitest";
// import { MemoryRouter } from "react-router-dom";
// import SignUp from "./SignUp";

// vi.mock("../services/authService", () => ({
//     SignUpUser: vi.fn(() => Promise.resolve()),
// }));

// const mockNavigate = vi.fn();
// vi.mock("react-router-dom", async () => {
//     const actual = await vi.importActual("react-router-dom");
//     return {
//         ...actual,
//         useNavigate: () => mockNavigate,
//     };
// });

// describe("SignUp component", () => {
//     it("submits the form with user input and navigates", async () => {
//         const user = userEvent.setup();
//         const { SignUpUser } = await import("../services/authService");

//         render(
//             <MemoryRouter>
//                 <SignUp />
//             </MemoryRouter>
//         );

//         await user.type(screen.getByPlaceholderText("First Name"), "John");
//         await user.type(screen.getByPlaceholderText("Last Name"), "Doe");
//         await user.type(screen.getByPlaceholderText("Email"), "john@example.com");
//         await user.type(screen.getByPlaceholderText("Password"), "password123");

//         await user.click(screen.getByRole("button", { name: /sign up/i }));

//         expect(SignUpUser).toHaveBeenCalledWith(
//             "john@example.com",
//             "password123",
//             {
//                 email: "john@example.com",
//                 firstName: "John",
//                 lastName: "Doe",
//             }
//         );

//         expect(mockNavigate).toHaveBeenCalledWith("/success");
//     });
// });
