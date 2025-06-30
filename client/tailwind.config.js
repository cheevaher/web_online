/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ✅ เปิดใช้งาน Dark Mode แบบ class
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // ✅ ทุกไฟล์ใน src
    "./public/index.html",        // ✅ HTML หลัก
  ],
  theme: {
    extend: {
      fontFamily: {
        lao: ['"Noto Sans Lao"', 'sans-serif'], // ✅ เพิ่มฟอนต์ภาษาลาว
      },
    },
  },
  plugins: [],
};
