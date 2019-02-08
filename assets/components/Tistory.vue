<template lang="pug">
  ul
    li(v-if="!$store.state.authorized")
      form(method="GET" action="https://www.tistory.com/oauth/authorize/")
        input(type="hidden" name="client_id" value=`${process.env.TISTORY_CLIENT_ID}`)
        input(type="hidden" name="redirect_uri" value=`${process.env.TISTORY_CALLBACK}`)
        input(type="hidden" name="response_type" value="token")
        button(type="submit") 로그인
    li(v-if="$store.state.authorized")
      a(href="#"): img#user(:src="thumbnail")
</template>
<script>
  import Tistory from 'tistory';

  export default {
    mounted() {
      /** refrash, or new login */
      if(location.hash) {
        const self = this,
              access_token = location.hash
              .split('#access_token=')[1]
              .split('&')[0]
        ;
        if(access_token) {
          /** Getting Tistory Blog Info */
          Tistory.blog.info(access_token).then(({ data }) => {
            this.$store.state.authorized = true;
            self.thumbnail = data.tistory.item.blogs[0].profileThumbnailImageUrl;
          });
        }
      }
    },
    data() {
      return {
        thumbnail: new String()
      }
    }
  }
</script>

<style lang="stylus">
  #user
    border-radius 50%
    width 40x
    height 40px
</style>