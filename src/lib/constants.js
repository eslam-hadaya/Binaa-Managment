export const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Islam Hadaya",
  email: process.env.NEXT_PUBLIC_SITE_EMAIL || "hdayaaslam34@gmail.com",
  github:
    process.env.NEXT_PUBLIC_SITE_GITHUB || "https://github.com/eslam-hadaya",
  linkedin:
    process.env.NEXT_PUBLIC_SITE_LINKEDIN ||
    "https://www.linkedin.com/in/islam-hadaya",
  whatsapp: process.env.NEXT_PUBLIC_SITE_WHATSAPP || "963932642429",
  telegram: process.env.NEXT_PUBLIC_SITE_TELEGRAM || "EslamCA",
  telegramBotToken: process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || "",
  telegramChatId: process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID || "",
  telegramBotToken: process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN,
  telegramChatId: "5220737704",
};

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://binaa-server.vercel.app/api";
