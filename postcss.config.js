// Docsy 0.16+ runs PostCSS in production only when the site has this file.
// Keep Autoprefixer on, as Docsy did before.
module.exports = {
  plugins: {
    autoprefixer: {},
  },
};
