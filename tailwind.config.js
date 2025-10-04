// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        popcard: {
      '0%': { transform: 'scale(0.6) rotateX(10deg)', opacity: '0' },
      '100%': { transform: 'scale(1) rotateX(0deg)', opacity: '1' },
    },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        popcard: 'popcard 0.4s ease-out forwards',
      },
    },
  },
  plugins: [],
};
