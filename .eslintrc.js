module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    //"plugin:vue/vue3-essential",
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],

  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    parserOptions: {
      project: ["./tsconfig.json"],
    },
  },
  plugins: ["@typescript-eslint"],

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
