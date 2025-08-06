import "../test/setup";
import { it, describe, expect, vi, beforeEach } from "vitest";
import { sendEmail } from "./send-email";
import nodemailer from "nodemailer";

describe("sendEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (nodemailer.createTransport as any).mockImplementation(() => ({
      sendMail: vi.fn().mockResolvedValue({ messageId: "test-message-id" }),
    }));
  });

  it("Send email with the correct parameters", async () => {
    const to = "test@gmail.com";
    const subject = "The test is correct";
    const html = "<p>Correct Test</p>";
    await sendEmail(to, subject, html);

    expect(nodemailer.createTransport).toBeCalledWith({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mockTransporter = (nodemailer.createTransport as any).mock.results[0]
      .value;
    expect(mockTransporter.sendMail).toBeCalledWith({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
  });

  it("should handle email sending errors", async () => {
    const to = "test@gmail.com";
    const subject = "Cool Error Message";
    const html = "<p>Wow, An Error!</p>";

    const mockSendMail = vi.fn().mockRejectedValue(new Error("SMTP error"));
    (nodemailer.createTransport as any).mockReturnValue({
      sendMail: mockSendMail,
    });
    await expect(sendEmail(to, subject, html)).rejects.toThrow("SMTP error");
  });

  it("Test when environment variables aren't there", async () => {
    const originalUser = process.env.EMAIL_USER;
    const originalPass = process.env.EMAIL_PASS;
    delete process.env.EMAIL_USER;
    delete process.env.EMAIL_PASS;

    const to = "test@gmail.com";
    const subject = "Cool Error Message";
    const html = "<p>Wow, An Error!</p>";

    await sendEmail(to, subject, html);

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: "gmail",
      auth: {
        user: undefined,
        pass: undefined,
      },
    });

    process.env.EMAIL_USER = originalUser;
    process.env.EMAIL_PASS = originalPass;
  });

  it("should handle sendMail returning undefined", async () => {
    const mockSendMail = vi.fn().mockResolvedValue(undefined);
    (nodemailer.createTransport as any).mockReturnValue({
      sendMail: mockSendMail,
    });

    // Should not throw (successful case)
    await expect(
      sendEmail("test@gmail.com", "Subject", "<p>Content</p>"),
    ).resolves.not.toThrow();
  });
});
