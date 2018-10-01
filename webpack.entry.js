/** webpack.entry.js
  * 
  * Entry for bundling by webpack.
  * for example, if you have your own script, or plguin,
  * you can import that. 
  * ex) import "./bower_components/animate.css/animate.min.css"
  * 
  * you are able to include js, css
  * if you want to contain other scripts like .ts, .less, .sass,
  * set the loaders in ./webpack.base.conf.js
  * 
  * after import assets it will be contained in app.js
  */ 

/** React */
import React from 'react'
import ReactDOM from 'react-dom'

const References = require('~/assets/components/References');

const rootElement = document.getElementById('react-references');
ReactDOM.render(<References />, rootElement);

/** Vue.js */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

Vue.component(
  'tistory', 
  require('~/assets/components/Tistory.vue').default
);
new Vue({
  el: '#vue-tistory',
  store: new Vuex.Store({
    state: {
      authorized: false
    }
  }),
});