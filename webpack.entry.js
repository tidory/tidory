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

/** Vue.js */
import Vue from 'vue';
import VueRouter from 'vue-router';

if(process.env.APP_VIEW_TYPE == 'vue') {

  Vue.use(VueRouter);
  Vue.component(
    'blog-title', 
    require('~/components/blog-title.vue').default
  );

  new Vue({
    el: '#app',
    /** vue-router */
    router: new VueRouter({
      mode: 'history',
      routes: [
        { path: '/', component: require('~/components/blog-menu.vue').default }
      ]
    })
  });
}
else {
  require('@config');
}
