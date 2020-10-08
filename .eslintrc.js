// http://eslint.org/docs/user-guide/configuring

var OFF = 0; var WARN = 1; var ERROR = 2;

module.exports = {
	root: true,
	parserOptions: {
		parser: 'babel-eslint',
		sourceType: 'module'
	},
	env: {
		browser: true
	},
	// https://github.com/standard/standard/blob/master/docs/RULES-en.md
	extends: ['plugin:vue/base', 'standard'],
	// required to lint *.vue files
	plugins: [
		'html'
	],
	'rules': {
		'vue/script-indent': [ERROR, 'tab', {
			baseIndent: 1,
			switchCase: 1
		}],
		'implicit-arrow-linebreak': [ERROR, 'beside'],
		// allow paren-less arrow functions
		'arrow-parens': OFF,
		// allow async-await
		'generator-star-spacing': OFF,
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? ERROR : OFF,
		'indent': [ERROR, 'tab', {
			SwitchCase: WARN,
			FunctionExpression: {
				parameters: 'first',
				body: 1
			}
		}],
		'curly': [ERROR, 'all'],
		'no-multi-spaces': ERROR,
		'no-tabs': OFF,
		'semi': [ERROR, 'always', { 'omitLastInOneLineBlock': true }],
		'quote-props': OFF,
		'no-return-await': OFF,
		'standard/no-callback-literal': OFF,
		'prefer-const': OFF
	},
	overrides: [
		{
			files: ['*.vue'],
			rules: {
				'indent': 'off',
				'no-mixed-spaces-and-tabs': 'off'
			}
		}
	]
};
