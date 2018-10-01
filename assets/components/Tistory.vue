<template lang="pug">
  ul
    li(v-if="!$store.state.authorized")
      form(method="GET" action="https://www.tistory.com/oauth/authorize/")
        input(type="hidden" name="client_id" value=`${process.env.TISTORY_CLIENT_ID}`)
        input(type="hidden" name="redirect_uri" value=`${process.env.TISTORY_CALLBACK}`)
        input(type="hidden" name="response_type" value="token")
        button(type="submit") 로그인
    li(v-if="$store.state.authorized")
      a(href="#" @click="destroy"): img.user(:src="thumbnail")
</template>
<script>
  import tistory from 'tistory';
  import jsCookie from 'js-cookie';

  export default {
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
        thumbnail: new String()
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
            jsCookie.set('access_token', access_token, {
              /** https://www.tistory.com/guide/api/oauth */
              expires: new Date(new Date().getTime() + 60 * 60 * 1000)
            });
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