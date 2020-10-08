export default {
	name: 'validatable',
	data: function () {
		return {
			isValidatable: true,
			errorMessage: null,
			erroredBefore: false
		};
	},
	props: {
		rules: {
			type: Array,
			default: () => []
		}
	},
	mounted: function () {
		if (this.input) {
			let onInput = () => {
				if (this.beforeOnSubmit()) {
					this.input.removeEventListener('input', onInput, false);
				}
			};
			let onFocus = () => {
				this.input.addEventListener('input', onInput, false);
			};
			this.input.addEventListener('blur', () => {
				this.beforeOnSubmit();
				this.input.removeEventListener('input', onInput, false);
			}, false);
			this.input.addEventListener('focus', onFocus, false);
		}
	},
	methods: {
		validate: function (value = this.inputValue) {
			for (let i = 0; i < this.rules.length; i++) {
				const rule = this.rules[i];
				const valid = typeof rule === 'function' ? rule(value) : rule;
				if (typeof valid === 'string') {
					this.errorMessage = valid;
					this.$emit('validation', false);
					this.erroredBefore = true;
					return false;
				}
			}
			this.errorMessage = null;
			this.$emit('validation', true);
			return true;
		},
		beforeOnSubmit: function () {
			if (this.rules) {
				return this.validate();
			}
			return true;
		}
	},
	computed: {
		isValid () { return this.errorMessage === null || this.errorMessage === undefined }
	},
	watch: {
		rules: {
			handler: function (newVal, oldVal) {
				if (newVal && oldVal && newVal.length === oldVal.length) {
					return;
				}
				this.validate();
			},
			deep: true
		},
		value: function () {
			if (!this.isValid || this.erroredBefore) {
				this.$nextTick(() => {
					this.validate();
				});
			}
		}
	}
};
