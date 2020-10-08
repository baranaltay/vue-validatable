import Vue from 'vue';
import App from './App.vue';

import './designcomponents';

Vue.config.productionTip = false;

new Vue({
	render: h => h(App),
	data () {
		return {
			tooltip: {
				text: null,
				isOpen: false,
				defaultElement: null,
				buffer: {}
			}
		};
	}
}).$mount('#app');
