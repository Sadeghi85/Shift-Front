module.exports = {
  root: true,

  env: {
    node: true,
    "vue/setup-compiler-macros": true,
  },

  extends: [
    //"plugin:vue/vue3-essential",
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "./.eslintrc-auto-import.json",
  ],

  parser: "vue-eslint-parser",

  // https://github.com/vuejs/eslint-config-typescript/blob/main/index.js
  plugins: ["@typescript-eslint"],
  // Prerequisite `eslint-plugin-vue`, being extended, sets
  // root property `parser` to `'vue-eslint-parser'`, which, for code parsing,
  // in turn delegates to the parser, specified in `parserOptions.parser`:
  // https://github.com/vuejs/eslint-plugin-vue#what-is-the-use-the-latest-vue-eslint-parser-error
  parserOptions: {
    parser: {
      js: "espree",
      jsx: "espree",

      ts: require.resolve("@typescript-eslint/parser"),
      tsx: require.resolve("@typescript-eslint/parser"),

      // Leave the template parser unspecified, so that it could be determined by `<script lang="...">`
    },
    extraFileExtensions: [".vue"],
    ecmaFeatures: {
      jsx: true,
    },
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        // The core 'no-unused-vars' rules (in the eslint:recommeded ruleset)
        // does not work with type definitions
        "no-unused-vars": "off",
      },
    },
  ],

  // parserOptions: {
  //   ecmaVersion: 2020,
  // },

  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-useless-escape": "off",
    "vue/multi-word-component-names": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-var-requires": "off",
    "linebreak-style": ["error", "windows"],
    "max-len": [
      "off",
      {
        code: 80,
      },
    ],
  },
};
