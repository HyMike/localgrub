import SubmitBtn from "./SubmitBtn";
import { vi, describe, it, beforeEach } from "vitest";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { sendData } from "../services/orderService";
import { useAuth } from "../authentication/AuthContext";
import { getIdToken } from "firebase/auth";
import { OrderFormData } from "../types/SubmitBtn";

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("../authentication/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../services/orderService", () => ({
  sendData: vi.fn(),
}));

type renderSubmitBtn = {
  user: any;
  loading: boolean;
  formData: any;
  toPage: string;
  btnTxt: string;
};

describe("SubmitBtn", () => {
  const mockNavigate = vi.fn();
  const mockSendData = sendData as any;
  const mockUseAuth = useAuth as any;

  const renderSubmitBtn = ({
    user,
    loading,
    formData,
    toPage,
    btnTxt,
  }: renderSubmitBtn) => {
    mockUseAuth.mockReturnValue({ user, loading });
    return render(
      <SubmitBtn formData={formData} toPage={toPage} btnTxt={btnTxt} />,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as any).mockReturnValue(mockNavigate);
  });

  // if page navigate to sucess is sendData called does it send the right data
  it("Display the correct text for button", () => {
    renderSubmitBtn({
      user: null,
      loading: false,
      formData: {},
      toPage: "checkout",
      btnTxt: "Submit Order",
    });

    expect(screen.getByText("Submit Order")).toBeInTheDocument();
  });

  it("Display doesn't render when loading", () => {
    const { container } = renderSubmitBtn({
      user: null,
      loading: true,
      formData: {},
      toPage: "checkout",
      btnTxt: "Submit Order",
    });

    expect(container.firstChild).toBeNull();
  });

  // if the user is null is the page redirected to /login
  it("navigate to login page if user isn't authenticated", () => {
    renderSubmitBtn({
      user: null,
      loading: false,
      formData: { itemName: "pizza" },
      toPage: "checkout",
      btnTxt: "Submit Order",
    });

    const submitBtn = screen.getByRole("button", { name: "Submit Order" });
    fireEvent.click(submitBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/login", {
      state: {
        formData: { itemName: "pizza", creditCardInfo: "" },
        from: "/checkout",
      },
    });
  });

  it("navigate to checkout page if user is authenticated", async () => {
    const mockUser = { getIdToken: vi.fn().mockResolvedValue("test-user") };
    renderSubmitBtn({
      user: mockUser,
      loading: false,
      formData: { itemName: "pizza" },
      toPage: "checkout",
      btnTxt: "Submit Order",
    });
    const submitBtn = screen.getByRole("button", { name: "Submit Order" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/checkout", {
        state: {
          formData: { itemName: "pizza", creditCardInfo: "" },
          from: "/checkout",
        },
      });
    });
  });

  it("Test to combine credit card infor and form data correctly", () => {
    const mockUser = { getIdToken: vi.fn().mockResolvedValue("test-user") };
    mockUseAuth.mockResolvedValue({ user: mockUser, loading: false });

    render(
      <SubmitBtn
        formData={{
          id: "pizza123",
          itemName: "Pizza",
          quantity: 2,
          price: 5.99,
        }}
        creditCardInfo="1234-5678-9012-3456"
        toPage="checkout"
        btnTxt="Submit"
      />,
    );

    fireEvent.click(screen.getByText("Submit"));

    expect(mockNavigate).toHaveBeenCalledWith("/login", {
      state: {
        formData: {
          id: "pizza123",
          itemName: "Pizza",
          quantity: 2,
          price: 5.99,
          creditCardInfo: "1234-5678-9012-3456",
        },
        from: "/checkout",
      },
    });
  });

  it("uses empty string for creditCardInfo when not provided", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });

    render(
      <SubmitBtn
        formData={{ itemName: "Pizza" }}
        toPage="checkout"
        btnTxt="Submit"
      />,
    );

    fireEvent.click(screen.getByText("Submit"));

    expect(mockNavigate).toHaveBeenCalledWith("/login", {
      state: {
        formData: { itemName: "Pizza", creditCardInfo: "" },
        from: "/checkout",
      },
    });
  });
  it("Test if send data is called when success page is navigate to after submit", async () => {
    const mockUser = { getIdToken: vi.fn().mockResolvedValue("test-user") };
    mockUseAuth.mockReturnValue({ user: mockUser, loading: false });

    render(
      <SubmitBtn
        formData={{
          id: "pizza123",
          itemName: "Pizza",
          quantity: 2,
          price: 5.99,
        }}
        creditCardInfo="1234-5678-9012-3456"
        toPage="success"
        btnTxt="Submit"
      />,
    );

    const submitBtn = screen.getByText("Submit");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockSendData).toHaveBeenCalledWith(
        {
          id: "pizza123",
          itemName: "Pizza",
          quantity: 2,
          price: 5.99,
          creditCardInfo: "1234-5678-9012-3456",
        },
        "test-user",
      );
    });
  });

  it("Doesn't call sendData if when navigating to other pages", async () => {
    const mockUser = {
      getIdToken: vi.fn().mockResolvedValue("test-user"),
    };
    mockUseAuth.mockReturnValue({ user: mockUser, loading: false });

    render(
      <SubmitBtn
        formData={{
          id: "pizza123",
          itemName: "Pizza",
          quantity: 2,
          price: 5.99,
        }}
        creditCardInfo="1234-5678-9012-3456"
        toPage="checkout"
        btnTxt="Submit"
      />,
    );
    const submitBtn = screen.getByText("Submit");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockSendData).not.toHaveBeenCalled();
    });
  });

  it("handles token retrieval error gracefully", async () => {
    const mockUser = {
      getIdToken: vi.fn().mockRejectedValue(new Error("Token error")),
    };
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockUseAuth.mockReturnValue({ user: mockUser, loading: false });

    render(
      <SubmitBtn
        formData={{ itemName: "Pizza" }}
        toPage="success"
        btnTxt="Submit"
      />,
    );

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to get token or send data:",
        expect.any(Error),
      );
    });
  });

  it("handles sendData error gracefully", async () => {
    const mockUser = { getIdToken: vi.fn().mockResolvedValue("fake-token") };
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockUseAuth.mockReturnValue({ user: mockUser, loading: false });
    mockSendData.mockRejectedValue(new Error("API error"));

    render(
      <SubmitBtn
        formData={{ itemName: "Pizza" }}
        toPage="success"
        btnTxt="Submit"
      />,
    );

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to get token or send data:",
        expect.any(Error),
      );
    });
  });

  it("handles empty formData", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });

    render(<SubmitBtn formData={{}} toPage="checkout" btnTxt="Submit" />);

    fireEvent.click(screen.getByText("Submit"));

    expect(mockNavigate).toHaveBeenCalledWith("/login", {
      state: {
        formData: { creditCardInfo: "" },
        from: "/checkout",
      },
    });
  });

  it("handles complex formData objects", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });

    const complexFormData = {
      itemName: "Pizza",
      quantity: 2,
      toppings: ["cheese", "pepperoni"],
      specialInstructions: "Extra crispy",
    };

    render(
      <SubmitBtn
        formData={complexFormData}
        toPage="checkout"
        btnTxt="Submit"
      />,
    );

    fireEvent.click(screen.getByText("Submit"));

    expect(mockNavigate).toHaveBeenCalledWith("/login", {
      state: {
        formData: {
          ...complexFormData,
          creditCardInfo: "",
        },
        from: "/checkout",
      },
    });
  });
});
