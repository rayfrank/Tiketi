/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                kenya: {
                    black: "#0B0F19",
                    red: "#BB0A1E",
                    green: "#0D7A3B",
                    white: "#F7F7F7",
                    gold: "#C9A227",
                },
            },
        },
    },
    plugins: [],
};
