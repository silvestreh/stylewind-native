// Editor-only: lets tailwindcss-language-server offer this package's own
// prefixes and safe-area utilities while working on the tests. Not published.
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('./tailwind.cjs')],
};
