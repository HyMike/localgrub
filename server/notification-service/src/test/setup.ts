import { beforeAll, afterEach, vi } from "vitest";
import dotenv from "dotenv";
import { createTransport } from "nodemailer";

dotenv.config({ path: ".env" });

vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn().mockResolvedValue({ messageId: "test-message-id" }),
    })),
  },
}));

vi.mock("amqplib", () => ({
  connect: vi.fn(),
}));
