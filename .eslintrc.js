module.exports = {
  env: {
    browser: true,
  },
  extends: ["plugin:vue/vue3-recommended", "prettier", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaVersion: 13,
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  plugins: ["vue", "@typescript-eslint"],
  rules: {
    "vue/no-setup-props-destructure" : "off"
  },
};
