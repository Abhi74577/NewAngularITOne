/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'rgba(var(--color-primary-50) / <alpha-value>)',
          100: 'rgba(var(--color-primary-100) / <alpha-value>)',
          200: 'rgba(var(--color-primary-200) / <alpha-value>)',
          300: 'rgba(var(--color-primary-300) / <alpha-value>)',
          400: 'rgba(var(--color-primary-400) / <alpha-value>)',
          500: 'rgba(var(--color-primary-500) / <alpha-value>)',
          600: 'rgba(var(--color-primary-600) / <alpha-value>)',
          700: 'rgba(var(--color-primary-700) / <alpha-value>)',
          800: 'rgba(var(--color-primary-800) / <alpha-value>)',
          900: 'rgba(var(--color-primary-900) / <alpha-value>)',
        },
        secondary: {
          50: 'rgba(var(--color-secondary-50) / <alpha-value>)',
          100: 'rgba(var(--color-secondary-100) / <alpha-value>)',
          200: 'rgba(var(--color-secondary-200) / <alpha-value>)',
          300: 'rgba(var(--color-secondary-300) / <alpha-value>)',
          400: 'rgba(var(--color-secondary-400) / <alpha-value>)',
          500: 'rgba(var(--color-secondary-500) / <alpha-value>)',
          600: 'rgba(var(--color-secondary-600) / <alpha-value>)',
          700: 'rgba(var(--color-secondary-700) / <alpha-value>)',
          800: 'rgba(var(--color-secondary-800) / <alpha-value>)',
          900: 'rgba(var(--color-secondary-900) / <alpha-value>)',
        },
        surface: 'rgba(var(--color-surface) / <alpha-value>)',
        'surface-variant': 'rgba(var(--color-surface-variant) / <alpha-value>)',
        'on-surface': 'rgba(var(--color-on-surface) / <alpha-value>)',
        'on-surface-variant': 'rgba(var(--color-on-surface-variant) / <alpha-value>)',
      },
      spacing: {
        'sidebar-expanded': '280px',
        'sidebar-collapsed': '80px',
      },
      transitionDuration: {
        'sidebar': '300ms',
      },
    },
  },
  plugins: [],
}
