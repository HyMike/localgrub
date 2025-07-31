import "../test/setup";
import { it, describe, expect, vi, beforeEach } from "vitest";
import { sendEmail } from "./send-email";
import nodemailer from "nodemailer";

describe("sendEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
    // await sendEmail(to, subject, html);

    const mockSendMail = vi.fn().mockRejectedValue(new Error("SMTP error"));
    (nodemailer.createTransport as any).mockReturnValue({
      sendMail: mockSendMail,
    });
    await expect(sendEmail(to, subject, html)).rejects.toThrow("SMTP error");
  });
});

// it("should handle email sending errors", async () => {
//     const mockTransporter = (nodemailer.createTransport as any).mock.results[0].value;
//     mockTransporter.sendMail.mockRejectedValue(new Error('SMTP error'));

//     await expect(sendEmail('test@gmail.com', 'Subject', '<p>Content</p>'))
//         .rejects.toThrow('SMTP error');
// });
