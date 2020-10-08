import Vue from 'vue';
import IText from '@/designcomponents/components/IText';

// load i-text synchronously because we need it when page loads
Vue.component('i-text', IText);

// load i-popup asynchronously because dont need it until user interracts with it
Vue.component('i-popup', () => import(/* webpackChunkName: "i-popup" */ '@/designcomponents/components/IPopup'));
