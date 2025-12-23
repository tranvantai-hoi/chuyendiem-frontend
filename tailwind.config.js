/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Định nghĩa thêm màu 'primary' để Tailwind hiểu được bg-primary
      colors: {
        primary: '#2563eb', // Đây là mã màu blue-600, bạn có thể đổi thành mã hex khác tùy thích
      }
    },
  },
  plugins: [],
}