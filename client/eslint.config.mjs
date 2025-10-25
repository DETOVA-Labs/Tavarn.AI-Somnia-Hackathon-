import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
      rules: {
          'react/no-unescaped-entities': 'off',
          '@next/next/no-page-custom-font': 'off',
          "react-hooks/rules-of-hooks": "error",
          "react-hooks/exhaustive-deps": "warn",
          "react/prop-types": "off",
          "react/react-in-jsx-scope": "off",
          "@typescript-eslint/explicit-module-boundary-types": "off",
          "@typescript-eslint/no-non-null-assertion": "off",
          "@typescript-eslint/ban-ts-comment" : "off",
          "@typescript-eslint/no-explicit-any" : "off",
          "@typescript-eslint/no-unused-vars": "off",
      },
  },
];

export default eslintConfig;
