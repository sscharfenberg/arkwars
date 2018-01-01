// Configure ESLint
// http://eslint.org/docs/rules/

module.exports = {
    "extends": ["eslint:recommended"],
    "plugins": ["import", "html"],
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": false,
            "modules": true,
            "experimentalObjectRestSpread": true
        }
    },
    "settings": {
        "import/resolver": {
            "webpack": {
                "config": "internals/webpack/config.base.js"
            }
        }
    },
    "rules": {
        // http://eslint.org/docs/rules/
        "indent": [2, 4, { SwitchCase: 1 }],
        "quotes": [2, "double"],
        "linebreak-style": [1, "windows"],
        "semi": [2, "always"],
        "comma-style": [2, "last"],
        "no-undef": 2,
        "no-console": ["error", { allow: ["log", "warn", "error", "dir"] }],
        "comma-spacing": [2, { before: false, after: true }],
        "new-cap": [2, { newIsCap: true, capIsNew: false }],
        "no-multi-spaces": [
            1,
            {
                exceptions: {
                    ImportDeclaration: true,
                    VariableDeclarator: true
                }
            }
        ],
        // don"t require .vue extension when importing
        "import/extensions": ["error", "always", {
            "js": "never",
            "vue": "never"
        }],
    },
    "globals": {
        Promise: true
    },
    "env": {
        browser: true,
        node: true,
        es6: true
    }
};
