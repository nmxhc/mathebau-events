/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  important: true,
  theme: {
    extend: {},
  },
  safelist: [
    "bg-red-600",
    "text-red-50",
    "hover:bg-red-700",
    "bg-stone-600",
    "text-stone-50",
    "hover:bg-stone-700",
  ],
  plugins: [],
};
