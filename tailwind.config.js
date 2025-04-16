// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"], // Assuming 'class' strategy from original configs
  content: [
    "./index.html", // Include index.html for base structure
    "./src/**/*.{js,ts,jsx,tsx}", // Scan all relevant TS/JS files in src
  ],
  prefix: "", // No prefix was used in originals
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Base shadcn colors (using HSL variables is best practice)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))', // Will be defined in index.css
          foreground: 'hsl(var(--primary-foreground))', // Will be defined in index.css
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Merged Custom colors
        iot: { // From Inquiry Form
          "light-blue": "#D3E4FD", // hsl(215, 94%, 91%)
          "blue": "#1EAEDB",       // hsl(197, 89%, 49%) - Matches Inquiry Primary
          "sky-blue": "#33C3F0",   // hsl(195, 85%, 57%) - Matches Support Primary
          "light-gray": "#F1F1F1",
          "dark-blue": "#0E86A8",  // hsl(197, 86%, 35%)
          "pastel-blue": "#E5F5FC",// hsl(198, 83%, 94%)
          "accent-yellow": "#FFD166",
          "success-green": "#06D6A0",
          "warning-orange": "#FF9F1C",
        },
         support: { // From Support Form
          blue: '#33C3F0',        // hsl(195, 85%, 57%) - Matches Support Primary
          'light-blue': '#D3E4FD', // hsl(215, 94%, 91%) - Matches IoT Light Blue
          'dark-blue': '#1EAEDB',   // hsl(197, 89%, 49%) - Matches IoT Blue / Inquiry Primary
        },
      },
      borderRadius: { // Consistent with shadcn defaults
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: { // Merged Keyframes
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-out': { // Added from Inquiry Form
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(10px)' },
        },
        'pulse-glow': { // Added from Inquiry Form
           '0%, 100%': { boxShadow: '0 0 0 rgba(30, 174, 219, 0)' },
           '50%': { boxShadow: '0 0 20px rgba(30, 174, 219, 0.3)' },
        },
         'slide-in': { // Added from Landing Page
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        }
      },
      animation: { // Merged Animations
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-out': 'fade-out 0.3s ease-out', // Added from Inquiry
        'pulse-glow': 'pulse-glow 2s infinite', // Added from Inquiry
        'slide-in': 'slide-in 0.3s ease-out' // Added from Landing
      },
      boxShadow: { // Added from Inquiry Form
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")], // Consistent plugin
}