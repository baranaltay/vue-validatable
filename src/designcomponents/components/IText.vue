<template>
	<div class="input-field i-text"
		 ref="inputWrapper"
		 :class="classes">

		<input v-if="isInput"
			   v-on="events"
			   :value="value"
			   ref="input"
			   :class="inputClasses"
			   :tabindex="tabindex"
			   :maxlength="characterCounter"
			   :required="required"
			   :readonly="readonly"
			   :disabled="disabled"
			   :placeholder="placeholder"
			   :step="type === 'number' ? step : null"
			   :min="type === 'number' ? min : null"
			   :max="type === 'number' ? max : null"
			   :type="type"
			   :autocapitalize="autocapitalize"
			   :autocomplete="autocompleteAttribute"
			   :name="name"
			   class="f-input" />

		<textarea v-else-if="textarea"
				  v-on="events"
				  :value="value"
				  ref="input"
				  :class="inputClasses"
				  :tabindex="tabindex"
				  :maxlength="characterCounter"
				  :required="required"
				  :readonly="readonly"
				  :disabled="disabled"
				  :placeholder="placeholder"
				  :autocapitalize="autocapitalize"
				  :autocomplete="autocompleteAttribute"
				  :name="name"
				  class="f-input"></textarea>

		<tag v-else-if="contenteditable"
			 :is="tag"
			 v-on="events"
			 :data-placeholder="!value || value.length === 0 ? placeholder : null"
			 ref="input"
			 :class="inputClasses"
			 contenteditable
			 :tabindex="tabindex"
			 :maxlength="characterCounter"
			 :required="required"
			 :readonly="readonly"
			 :disabled="disabled"
			 :autocapitalize="autocapitalize"
			 :autocomplete="autocompleteAttribute"
			 :name="name"
			 class="f-input"></tag>

		<span class="helper-text"
			  v-if="errorMessage">{{errorMessage}}
			<span class="arrow"></span>
		</span>
		<span class="character-counter"
			  v-if="characterCounter">
			{{value.length}}{{characterCounter !== true ? '/' + characterCounter : ''}}
		</span>
	</div>
</template>

<script>
	import validatable from '../base/validatable';

	function saveCaretPosition (context) {
		var selection = window.getSelection();
		var range = selection.getRangeAt(0);
		range.setStart(context, 0);
		var len = range.toString().length;

		return function restore () {
			var pos = getTextNodeAtPosition(context, len);
			selection.removeAllRanges();
			var range = new Range();
			range.setStart(pos.node, pos.position);
			selection.addRange(range);
		};
	}

	function getTextNodeAtPosition (root, index) {
		const NODE_TYPE = NodeFilter.SHOW_TEXT;
		var treeWalker = document.createTreeWalker(root, NODE_TYPE, function next (elem) {
			if (index > elem.textContent.length) {
				index -= elem.textContent.length;
				return NodeFilter.FILTER_REJECT;
			}
			return NodeFilter.FILTER_ACCEPT;
		});
		var c = treeWalker.nextNode();
		return {
			node: c || root,
			position: index
		};
	}

	export default {
		name: 'IText',
		extends: validatable,
		props: {
			name: String,
			autocapitalize: String,
			autocomplete: String,
			numeric: Boolean,
			naked: Boolean,
			maxCharacter: Number,
			disabled: Boolean,
			readonly: Boolean,
			hidden: Boolean,
			required: Boolean,
			textarea: Boolean,
			contenteditable: Boolean,
			placeholder: String,
			min: [Number, String],
			max: [Number, String],
			step: [Number, String],
			tabindex: [Number, String],
			value: {
				type: [String, Number],
				default: ''
			},
			type: {
				type: String,
				default: 'text'
			},
			characterCounter: {
				type: [Boolean, Number],
				default: false
			},
			tag: {
				type: String,
				default: 'p'
			}
		},
		data: function () {
			return {
				contentEditableCaretPosition: 0,
				isFocused: false,
				cache: null
			};
		},
		mounted: function () {
			this.updateContentEditableContent();
		},
		methods: {
			onPasteEvent: function (e) {
				e.preventDefault();
				var text = e.clipboardData.getData('text/plain');
				document.execCommand('insertText', false, text);
			},
			updateContentEditableContent: function (cursorToEnd = false) {
				if (this.contenteditable && this.input && !this.isFocused) {
					this.$nextTick(() => {
						this.input.innerText = this.value;
					});
				}
			},
			focus: function () { this.input.focus() },
			onFocus: function (e) {
				this.isFocused = true;
				this.$emit('focus', e);
			},
			onBlur: function (e) {
				this.isFocused = false;
				this.$emit('blur', e);
			},
			updateValue: function (e) {
				this.$emit('input', e.target.value || e.target.textContent);
			},
			updateValueNumber: function (e) {
				/* eslint-disable */
				let numberRegexp = new RegExp(/^-?(\d*)?(\.|\,)?(\d*)/);
				let v = e.target.value || e.target.textContent;
				let newVal = v.match(numberRegexp);
				if (newVal && newVal[0] !== v) {
					let isDeletedTooMuch = v.length - newVal[0].length > 1;

					let restore = saveCaretPosition(this.input);
					e.target[this.contenteditable ? 'textContent' : 'value'] = isDeletedTooMuch ? this.cache : newVal[0];
					restore();

					this.$refs.inputWrapper.classList.add('shake');
					setTimeout(() => {
						this.$refs.inputWrapper.classList.remove('shake');
					}, 300);
				}
				this.updateValue(e);
			}
		},
		computed: {
			autocompleteAttribute: function () {
				if (this.autocomplete) {
					return this.autocomplete;
				}
				if (this.numeric || this.type === 'number') {
					return 'off';
				}
				return null;
			},
			isInput () { return !this.contenteditable && !this.textarea },
			input () { return this.$refs.input },
			inputValue: { get () { return this.input.value || this.input.textContent }, cache: false },
			events () {
				let events = Object.assign({}, this.$listeners);
				events.focus = this.onFocus;
				events.blur = this.onBlur;
				events.input = this.numeric ? this.updateValueNumber : this.updateValue;
				if (this.contenteditable) {
					events.paste = this.onPasteEvent;
				}
				return events;
			},
			classes: function () {
				return {
					'character-counter': this.characterCounter > 0,
					'textarea': this.textarea,
					'contenteditable': this.contenteditable,
					'invalid-input-wrapper': this.errorMessage,
					'success-input-wrapper': !this.errorMessage,
					'naked': this.naked
				};
			},
			inputClasses: function () {
				return {
					'invalid': this.errorMessage,
					'success': !this.errorMessage
				};
			}
		},
		watch: {
			value: function (to) {
				this.cache = to;
				this.updateContentEditableContent();
			}
		}
	};
</script>

<style scoped>
	.input-field:not(.naked) .f-input {
		width: 100%;
		color: inherit;
		border: solid 1px #ececec;
		background-color: white;
		border-radius: 999px;
		padding: 0.9em 1.2em;
		min-height: 3.5em;
	}
	.f-input.invalid {
		border-color: #ef5350 !important;
	}
	.f-input {
		border: 1px solid transparent;
		line-height: 1.5;
		display: block;
		width: auto;
	}
	.input-field {
		position: relative;
	}
	.input-field:not(.naked) .f-input {
		width: 100%;
		color: inherit;
		border-color: #ececec;
		background-color: #fff;
		border-radius: 999px;
		padding: 0.9em 1.2em;
		min-height: 3.5em;
		line-height: 1.2em;
	}
	.input-field:not(.naked) .f-input::placeholder {
		opacity: 1;
		line-height: 1.5em;
		color: #818181;
	}
	.input-field:not(.naked) .f-input:-ms-input-placeholder {
		opacity: 1;
		line-height: 1.5em;
		color: #818181;
	}
	.input-field:not(.naked) .f-input::-ms-input-placeholder {
		opacity: 1;
		line-height: 1.5em;
		color: #818181;
	}
	.input-field:not(.naked) p.f-input,
	.input-field:not(.naked) textarea.f-input {
		padding: 1.2em;
		border-radius: 14px;
	}
	.input-field.character-counter {
		padding-bottom: 20px;
	}
	.input-field.character-counter .character-counter {
		right: 0px;
		position: absolute;
		bottom: 0px;
		font-size: 12px;
		font-weight: 200;
	}
	.input-field p.f-input::before {
		content: attr(data-placeholder);
		color: rgba(45, 45, 45, 0.3);
	}
	.input-field input.f-input,
	.input-field textarea.f-input {
		-webkit-appearance: none;
		-moz-appearance: textfield;
		-ms-appearance: none;
		-o-appearance: none;
	}
	.input-field textarea.f-input {
		max-width: 100%;
	}
	.input-field .icon-right {
		right: 0;
	}
	.input-field .icon-left {
		left: 0;
	}
	.input-field .icon-left,
	.input-field .icon-right {
		width: 3em;
		height: 3.5em;
		position: absolute;
		top: 0;
		bottom: 0;
	}
	.input-field .icon-left.i-icon.loading,
	.input-field .icon-right.i-icon.loading {
		top: 50%;
		transform: translateY(-50%);
	}
	.input-field .cross {
		position: absolute;
		right: 5px;
		top: 47%;
		transform: translateY(-50%);
		padding: 0.2em;
		color: black;
	}
	.input-field .cross :hover {
		color: gray;
		cursor: pointer;
	}

	span.helper-text {
		position: absolute;
		border-radius: 99px;
		background-color: #e86c68;
		font-size: 0.95em;
		margin-top: 0.8em;
		color: white;
		display: inline-flex;
		align-items: center;
		border: 0 !important;
		z-index: 999999;
		padding: 0.5em 1em;
		right: 0;
	}

	span.helper-text .arrow {
		display: inline-block;
		position: absolute;
		width: 1em;
		height: 1em;
		border-radius: 3px;
		background-color: #e86c68;
		transform: rotate(45deg) translateX(-50%);
		z-index: -1;
		top: 0;
		left: 50%;
	}

	.shake {
		-webkit-animation-name: shake;
		animation-name: shake;
		-webkit-animation-fill-mode: both;
		animation-fill-mode: both;
		-webkit-animation-duration: 300ms;
		animation-duration: 300ms;
	}

	@keyframes shake {
		from,
		to {
			transform: translate3d(0, 0, 0);
		}

		25%,
		75% {
			transform: translate3d(15px, 0, 0);
		}

		50% {
			transform: translate3d(-15px, 0, 0);
		}
	}
	@-webkit-keyframes shake {
		from,
		to {
			-webkit-transform: translate3d(0, 0, 0);
		}

		25%,
		75% {
			-webkit-transform: translate3d(15px, 0, 0);
		}

		50% {
			-webkit-transform: translate3d(-15px, 0, 0);
		}
	}
</style>
