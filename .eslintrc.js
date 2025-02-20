module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020,
    project: './tsconfig.json',
  },
  extends: [
    'airbnb/hooks',
    'airbnb-typescript',
    'prettier',
  ],
  env: {
    browser: true,
    jest: true,
  },
  plugins: ['compat', 'import', 'jsx-a11y', 'react', 'react-hooks'],
  rules: {},
  settings: {
    polyfills: ['IntersectionObserver', 'Promise'],
  },
};
