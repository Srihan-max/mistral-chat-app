module.exports = {
  // Next.js requires PostCSS plugins to be specified as package name strings
  // (or an object with keys as package names). Supplying require() functions
  // causes the "postcss-shape" / malformed config error.
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}