const js = require('@eslint/js');
const globals = require('globals');
const prettier = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier/flat');

// export default defineConfig([
//   { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.node } },
//   { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
// ]);

module.exports = [
    js.configs.recommended,
    prettierConfig, // Disables ESLint rules that conflict with Prettier
    {
        files: ['**/*.{js,mjs,cjs}'],
        languageOptions: {
            globals: globals.node,
            sourceType: 'commonjs'
        },
        plugins: {
            prettier // Adds Prettier as an ESLint plugin
        },
        rules: {
            'prettier/prettier': 'error' // Reports Prettier style issues as ESLint errors
        }
    }
];
