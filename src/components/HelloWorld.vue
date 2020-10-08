<template>
	<div class="demos">
		<h1>I-Text</h1>
		<div class="demo">
			<h2>This is simple</h2>
			<i-text v-model="demo1" />
			<p>Value: {{demo1}}</p>
		</div>
		<div class="demo">
			<h2>This is naked</h2>
			<i-text naked
					v-model="demo2" />
			<p>Value: {{demo2}}</p>
		</div>
		<div class="demo">
			<h2>This is required</h2>
			<i-text :rules="[requiredRule]"
					v-model="demo3" />
			<p>Value: {{demo3}}</p>
		</div>
		<div class="demo">
			<h2>This is email validated and required</h2>
			<i-text :rules="[requiredRule, emailRule]"
					v-model="demo4" />
			<p>Value: {{demo4}}</p>
		</div>
		<div class="demo">
			<h2>This is numeric</h2>
			<i-text numeric
					v-model="demo5" />
			<p>Value: {{demo5}}</p>
		</div>
		<div class="demo">
			<h2>This is textarea</h2>
			<i-text textarea
					v-model="demo6" />
			<p>Value: {{demo6}}</p>
		</div>
		<div class="demo">
			<h2>This is textarea with character counter</h2>
			<i-text textarea
					characterCounter
					v-model="demo7" />
			<p>Value: {{demo7}}</p>
		</div>
		<div class="demo">
			<h2>This is textarea with limited character counter</h2>
			<i-text textarea
					:character-counter="20"
					v-model="demo8" />
			<p>Value: {{demo8}}</p>
		</div>
		<div class="demo">
			<h2>This is a &lt;p&gt; tag with contenteditable attribute</h2>
			<i-text contenteditable
					v-model="demo9" />
			<p>Value: {{demo9}}</p>
		</div>
		<div class="demo">
			<h2>This is a &lt;div&gt; tag with contenteditable attribute, validation, character counter, numeric</h2>
			<i-text contenteditable
					tag="div"
					character-counter
					numeric
					:rules="[requiredRule, higherThan30, lowerThan60]"
					v-model="demo10" />
			<p>Value: {{demo10}}</p>
		</div>
		<h1>I-Popup</h1>
		<div class="demo">
			<h2>This is an empty popup</h2>
			<button @click="isPopupOpen1 = true">Click me to open</button>
			<i-popup v-model="isPopupOpen1">Hi, I'm empty</i-popup>
		</div>
		<div class="demo">
			<h2>This is a popup with an i-text</h2>
			<button @click="isPopupOpen2 = true">Click me to open</button>
			<i-popup v-model="isPopupOpen2">
				<div class="demo">
					<h2>This is simple</h2>
					<i-text v-model="demo11" />
					<p>Value: {{demo11}}</p>
				</div>
			</i-popup>
		</div>
		<div class="demo">
			<h2>This is a popup with close button</h2>
			<button @click="isPopupOpen3 = true">Click me to open</button>
			<i-popup close-button
					 v-model="isPopupOpen3">
				<div class="demo">
					<h2>You can close me from top right</h2>
					<button @click="isPopupOpen3 = false">Or by clicking here</button>
				</div>
			</i-popup>
		</div>
	</div>
</template>

<script>
	const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
	export default {
		name: 'HelloWorld',
		data () {
			return {
				isPopupOpen1: false,
				isPopupOpen2: false,
				isPopupOpen3: false,
				isPopupOpen4: false,
				isPopupOpen5: false,
				isPopupOpen6: false,
				demo1: '',
				demo2: '',
				demo3: '',
				demo4: '',
				demo5: '',
				demo6: '',
				demo7: '',
				demo8: '',
				demo9: '',
				demo10: '',
				demo11: '',
				requiredRule: (v) => !!v || v.length > 0 || 'required!',
				emailRule: (v) => emailPattern.test(v) || 'this should be an email...',
				higherThan30: (v) => Number(v) > 30 || 'should be higher than 30',
				lowerThan60: (v) => Number(v) < 60 || 'should be lower than 60'
			};
		}
	};
</script>
<style scoped>
	.demos {
		max-width: 50%;
		margin: 0 auto;
		text-align: left;
	}
	.demos .demo:not(:last-child) {
		margin-bottom: 5em;
		padding-bottom: 5em;
		/* border-bottom: 1px solid gainsboro; */
	}
	h1 {
		margin-bottom: 1em;
	}
</style>
