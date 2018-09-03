<template lang="pug">
  nav#td-nav-wrapper(role="navigation")
    ul
      li(class="left")
        ul
          li: a(href="https://tidory.com"): img.logo(:src='require("~/assets/images/logo.png")')
          li(v-for="ref in references"): a(:href="ref.href") {{ ref.text }}
      li(class="right")
        ul
          li(v-if="!$store.state.authorized")
            form(method="GET" action="https://www.tistory.com/oauth/authorize/")
              input(type="hidden" name="client_id" value=`${process.env.TISTORY_CLIENT_ID}`)
              input(type="hidden" name="redirect_uri" value=`${process.env.TISTORY_CALLBACK}`)
              input(type="hidden" name="response_type" value="token")
              button(type="submit") 로그인
          li(v-if="$store.state.authorized")
            a(href="#" @click="destroy"): img.profile(:src="thumbnail")
</template>
<script>
  import tistory from 'tistory';
  import jsCookie from 'js-cookie';

  export default {
    name: 'nav-component',
    mounted() {

      /** setting access token to cookie */
      this.store();
      let 
        access_token = jsCookie.get('access_token'),
        self = this
      ;

      /** if cookie has access token, it has already been logined */
      if(access_token !== undefined && access_token) {
        let 
          api = tistory(access_token)
        ;
        /** authoirzed */
        self.$store.state.authorized = true;

        if(self.$store.state.authorized) {
          /** getting tistory blog info */
          api.blog.info({ output: 'json'}, (request, aEvt) => {
            let 
              represent = JSON.parse(request.responseText).tistory.item.blogs[0]
            ;
            /** update view model */
            self.thumbnail = represent.profileThumbnailImageUrl;
          });
        }
      }
    },
    data() {
      return {
        thumbnail: new String(),
        references: [
          { text:"프로젝트 템플릿",  href:"https://github.com/pronist/tidory-starter-template" },
          { text:"티도리 모듈",  href:"https://www.npmjs.com/package/tidory" },
          { text:"티스토리 가이드",  href:"https://www.tistory.com/guide/skin/step0" }
        ]
      }
    },
    methods: {
      store() {
        /** refrash, or new login */
        if(location.hash) {
          const 
            access_token = location.hash
              .split('#access_token=')[1]
              .split('&')[0]
          ;
          if(access_token) {
            jsCookie.set('access_token', access_token);
          }
        }
      },
      destroy() {
        /** logout */
        jsCookie.remove('access_token');
        this.$store.state.authorized = false;
      }
    },
  }
</script>
<style>
  #td-nav-wrapper {
    position: absolute;
    top: 20px;
    width: 100%;
    padding: 0 35px;
    box-sizing: border-box;
    height: 50px;
  }
  #td-nav-wrapper form button {
    border: none;
    background: none;
    font-size: 0.95em;
    cursor: pointer;
  }
  #td-nav-wrapper img {
    border-radius: 50%;
    position: relative;
  }
  #td-nav-wrapper a {
    display: inline;
  }
  #td-nav-wrapper ul > li li  {
    margin: 0 10px;
    display: inline-block;
  }
  #td-nav-wrapper ul > li li a {
    font-size: 0.9em;
    font-weight: 300;
  }
  #td-nav-wrapper > ul > li {
    line-height: 50px;
  }
  #td-nav-wrapper > ul > .right {
    float: right;
  }
  #td-nav-wrapper > ul > .left {
    float: left;
  }
  #td-nav-wrapper img.logo {
    width: 32px;
    height: 32px;
    top: 9px;
  }
  #td-nav-wrapper img.profile {
    width: 38px;
    height: 38px;
    top: 5px;
  }
</style>