// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// const eslintConfig = [
//   ...compat.extends("next/core-web-vitals", "next/typescript"),
//   {
//     ignores: [".next/**"]
//   }
// ];

// export default eslintConfig;

// eslint.config.mjs
import antfu from '@antfu/eslint-config';

export default antfu({
  type: 'app',
  formatters: true,
  stylistic: {
    indent: 2,
    semi: true,
    quotes: 'single',
  },
  ignores: [],
  rules: {
    'style/no-tabs': 'off',
    'node/prefer-global/process': ['off'],
  },
});
