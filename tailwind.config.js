/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,js}"],
	
	theme: {
		extend: {
			fontFamily: {
				display: ["DM Serif Display", "serif"],
				body: ["Lato", "sans-serif"],
			},
			colors: {
				primary: {
					100: "#d3f5dd",
					200: "#a1d1af",
					300: "#86bf96",
					400: "#76b588",
					500: "#5da171",
					600: "#568D66",
					700: "#2B6A4D",
					800: "#0D4A3C",
					900: "#062b23",
				},
				secondary: {
					100: "#F7F7F2",
					200: "#dec1af",
					300: "#bf9982",
					400: "#ab846c",
					500: "#966f57",
					600: "#916950",
					700: "#7F5539",
					800: "#573925",
					900: "#2e1d12",
				},
				warning: {
					500: "#F27059",
				},
			},
		},
	},
	plugins: [],
};
