module.exports = {
    root: true,
    parser: "vue-eslint-parser",
    parserOptions: {
        parser: "@typescript-eslint/parser",
    },
    extends: ["eslint:recommended", "@vue/typescript/recommended", "prettier"],
    plugins: ["@typescript-eslint", "prettier"],
    rules: {
        "prettier/prettier": "error",
        "no-console": 1,
        "no-debugger": 1,
    },
    globals: {
        window: true,
        module: true,
    },
}
