module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  // Ensure frequently used color utilities and variants are generated under Tailwind v4
  safelist: [
    // whites with opacity
    { pattern: /(bg|text|border)-white\/(5|10|20|30|50|70|90)/, variants: ["hover", "group-hover"] },
    // zinc backgrounds used in cards
    { pattern: /(bg|text|border)-zinc-(800|900)/, variants: ["hover"] },
    // common sizing utilities used across components
    "text-9xl", "text-8xl", "text-4xl", "text-3xl", "text-2xl", "text-xl",
    "p-6", "p-8", "mb-16", "mt-16", "gap-8", "w-6", "h-6", "w-12", "h-12",
    "min-h-[200px]", "h-screen", "min-h-screen",
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
};

