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
