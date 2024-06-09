module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh"],
  "rules": {
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "destructuredArrayIgnorePattern": "^_",
      },
    ],
    "no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "destructuredArrayIgnorePattern": "^_",
      },
    ],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-empty-function": "off",
    "semi": [
      "error",
      "never",
    ],
    "quotes": [
      "error",
      "double",
    ],
    "no-console": ["error", { "allow": ["info", "error", "debug"] }],
    "react-hooks/exhaustive-deps": "off",
  },
}
