/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      colors: {
        premium: {
          slate: '#0B0F19',     // Deep rich slate for dark mode bg
          surface: '#131B2C',   // Slightly lighter slate for elements
          white: '#FFFFFF',     // Crisp white for light mode
          offwhite: '#F8FAFC',  // Soft background for light mode
          royal: '#2563EB',     // Vibrant royal blue
          violet: '#7C3AED',    // Rich violet for gradients
          crimson: '#E11D48',   // Energetic crimson
          emerald: '#10B981',   // Success green
        }
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [],
}