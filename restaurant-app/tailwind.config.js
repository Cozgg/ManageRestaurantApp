/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#111827",
        primary: {
          DEFAULT: "#27AE60", // Màu xanh lá chủ đạo
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#FF7A00", // Màu cam điểm nhấn
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#F3F4F6",
          foreground: "#6B7280",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#111827",
        },
        warning: {
          DEFAULT: "#F59E0B",
          foreground: "#ffffff",
        },
        border: "#E5E7EB",
        input: "#E5E7EB",
      },
    },
  },
  plugins: [],
};
