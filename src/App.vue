<template>
	<div id="app">
		<HelloWorld />
	</div>
</template>

<script>
	import HelloWorld from './components/HelloWorld';

	export default {
		name: 'App',
		components: { HelloWorld }
	};
</script>

<style>
	html {
		font-size: 14px;
		color: #2d2d2d;
	}

	body {
		font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		color: #2d2d2d;
		background-color: #f5f5f5;
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		font-feature-settings: 'liga', 'kern';
		-webkit-font-feature-settings: 'liga', 'kern';
		-moz-font-feature-settings: 'liga', 'kern';
		font-kerning: normal;
		-webkit-font-kerning: normal;
		-moz-font-kerning: normal;
		overflow-x: hidden;
		overflow-y: initial;
	}

	* {
		outline: none !important;
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
	*::after,
	*::before {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	input,
	textarea {
		min-height: 2em;
		color: #2d2d2d;
	}

	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		margin: 1em;
		padding-bottom: 40vh;
	}

	.popup-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: transparent;
		transition: background-color 300ms ease;
		z-index: 999;
	}
	body.popup-opened .popup-overlay {
		background-color: rgba(0, 0, 0, 0.2);
		transform: translate(0, 0);
	}
</style>
