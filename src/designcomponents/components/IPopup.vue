<template>
	<transition enter-active-class="fast animated fadeInUp"
				leave-active-class="fast animated fadeOutDown"
				@after-leave="onAnimationEnd"
				@before-enter="onAnimationStart">
		<div class="popup"
			 @mousedown.self="close"
			 :class="{ 'embedded': $root.isIframe, 'fullscreen': fullscreen }"
			 v-if="isOpen"
			 v-on="$listeners"
			 ref="popup">
			<div class="popup-content">
				<span v-if="closeButton"
					  class="close-button cursor-p"
					  @click="close">
					  x
				</span>
				<slot></slot>
			</div>
		</div>
	</transition>
</template>

<script>
	const POPUP_BODY_CLASS_NAME = 'popup-opened';
	export default {
		name: 'IPopup',
		props: {
			fullscreen: Boolean,
			closeButton: Boolean,
			isOpen: {
				type: Boolean,
				default: false
			},
			animationDurationMS: {
				type: Number,
				default: 300
			},
			closingDisallow: Boolean,
			hash: {
				type: String,
				default: 'popup-open'
			}
		},
		model: {
			prop: 'isOpen',
			event: 'toggle'
		},
		data: function () {
			return {
				index: 0,
				popupParentNode: null
			};
		},
		created: function () {
			if (this.isOpen === true) {
				this.index = ++window.openSidebarCount;
			}
		},
		mounted: function () {
			this.checkHash();
		},
		beforeDestroy: function () {
			this.close();
		},
		methods: {
			checkHash: function () {
				if (!this.hash) {
					return;
				}
				let hash = this.hash;
				if (!hash.startsWith('#')) {
					hash = `#${hash}`;
				}
				if (hash === window.location.hash) {
					this.open();
				}
			},
			onAnimationEnd: function () {
				this.removeOverlay();
			},
			onAnimationStart: function () {
				this.addOverlay();
			},
			addOverlay: function () {
				if (this.fullscreen && this.$root.isMobile) { return }

				this.$nextTick(() => {
					this.popupParentNode = this.$refs.popup.parentNode;
					if (!this.popupParentNode) { return }
					let div = document.createElement('div');
					div.addEventListener('mousedown', () => {
						this.close();
					});
					div.className = 'popup-overlay';
					this.popupParentNode.appendChild(div);
				});
			},
			removeOverlay: function () {
				if ((this.fullscreen && this.$root.isMobile) || !this.popupParentNode) { return }
				let overlay = this.popupParentNode.querySelector('.popup-overlay');
				if (overlay) {
					overlay.remove();
				}
			},
			onBodyKeyUp: function (e) {
				if (e.keyCode === 27 && this.isOpen === true) { // esc
					this.close();
				}
			},
			open: function () {
				this.$emit('toggle', true);
			},
			close: function () {
				if (!this.closingDisallow) {
					this.$emit('toggle', false);
				}
			},
			stateChange: function (e) {
				// if clicked back from browser
				if ((!e.state || !e.state.poped) && !this.closingDisallow) {
					this.$emit('toggle', false);
				}
			}
		},
		computed: {
			isHashOn: {
				get: function () {
					return window.history.state && window.history.state.poped === true;
				},
				cache: false
			}
		},
		watch: {
			isOpen: function (to, from) {
				// TODO: refactor here. Divide these to events
				if (to === true && from === false) { // opening
					window.history.pushState({ 'poped': true }, null, '');
					document.body.classList.add(POPUP_BODY_CLASS_NAME);
					document.body.addEventListener('keyup', this.onBodyKeyUp);
					this.index = ++this.$root.openPopupCount;
					this.$emit('opened');
					window.addEventListener('popstate', this.stateChange);
				} else if (from === true && to === false) { // closing
					window.removeEventListener('popstate', this.stateChange);
					document.body.classList.remove(POPUP_BODY_CLASS_NAME);
					document.body.removeEventListener('keyup', this.onBodyKeyUp);
					this.$root.openPopupCount--;
					// hit back button manually if user didn't
					this.$nextTick(() => {
						if (this.isHashOn) {
							window.history.back();
						}
					});
					this.$emit('closed');
				}
			}
		}
	};
</script>
<style scoped>
	.popup {
		top: 0px;
		left: 0px;
		width: 100%;
		height: 100%;
		z-index: 1000;
		display: flex;
		position: fixed;
		overflow-y: auto;
		max-height: 100vh;
		align-items: center;
		justify-content: center;
		transition: none !important;
		-webkit-overflow-scrolling: touch;
	}
	.popup .popup-content {
		padding: 2.4em;
		background-color: white;
		border-radius: 1em;
		position: relative;
		max-height: 100vh;
		overflow: auto;
	}
	.popup .popup-content .close-button {
		position: absolute;
		top: 0px;
		right: 0px;
		cursor: pointer;
		padding: 0.5em;
		z-index: 5;
		font-size: 1.4rem;
	}
	@media (max-width: 767px) {
		.popup.fullscreen .popup-content {
			position: fixed;
			top: 0px;
			left: 0px;
			width: 100%;
			height: 100%;
			border-radius: 0px;
			padding: 1.4em;
		}
	}

	/* #region GLOBALS */
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 300ms / 2;
	}
	.fade-enter,
	.fade-leave-to {
		opacity: 0;
	}

	.animated {
		-webkit-animation-iteration-count: 1;
		animation-iteration-count: 1;
		-webkit-animation-fill-mode: forwards;
		animation-fill-mode: forwards;
		-webkit-animation-duration: 300ms;
		animation-duration: 300ms;
		-webkit-animation-timing-function: ease;
		animation-timing-function: ease;
	}
	.infinite {
		-webkit-animation-iteration-count: infinite;
		animation-iteration-count: infinite;
	}
	.fast {
		-webkit-animation-duration: 300ms / 2 !important;
		animation-duration: 300ms / 2 !important;
	}
	.slow {
		-webkit-animation-duration: 300ms * 2 !important;
		animation-duration: 300ms * 2 !important;
	}

	.fadeInUp {
		-webkit-animation-name: fadeInUp;
		animation-name: fadeInUp;
	}
	.fadeOutDown {
		-webkit-animation-name: fadeOutDown;
		animation-name: fadeOutDown;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translate3d(0, 5%, 0);
		}

		to {
			opacity: 1;
			transform: translate3d(0, 0, 0);
		}
	}
	@-webkit-keyframes fadeInUp {
		from {
			opacity: 0;
			-webkit-transform: translate3d(0, 5%, 0);
		}

		to {
			opacity: 1;
			-webkit-transform: translate3d(0, 0, 0);
		}
	}
	@keyframes fadeOutDown {
		from {
			opacity: 1;
			transform: translate3d(0, 0, 0);
		}
		to {
			opacity: 0;
			transform: translate3d(0, 5%, 0);
		}
	}
	@-webkit-keyframes fadeOutDown {
		from {
			opacity: 1;
			-webkit-transform: translate3d(0, 0, 0);
		}
		to {
			opacity: 0;
			-webkit-transform: translate3d(0, 5%, 0);
		}
	}
</style>
