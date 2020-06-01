<template>
  <div class="third-login">
    <span class="icon icon-facebook" v-facebook-login="appId"></span>
    <span class="icon icon-google" v-google-login="clientId"></span>
    <span class="icon icon-twitter"></span>
  </div>
</template>

<script>
  import {convertToken} from '../../api/user'

  export default {
    data() {
      return {
        appId: "1780468005387218",
        clientId: "412438455470-bglpv11h7hmhad7rd55m2dmuk3dkp9i4.apps.googleusercontent.com"
      }
    },
    methods: {
      // facebook
      OnFacebookAuthSuccess(idToken) {
        console.log(idToken)
        // Receive the idToken and make your magic with the backend
        convertToken('facebook', idToken).then((res) => {
          console.log(res)
          if (res.token) { // 若 token 存在，将其存入 localStorage
            localStorage.setItem('token', res.token)
            this.$emit('loginOk')
          }
        }, (err) => {
          console.log(err)
        })
      },
      OnFacebookAuthFail(error) {
        console.log(error)
      },
      // google
      OnGoogleAuthSuccess(idToken) {
        console.log(idToken)
        // Receive the idToken and make your magic with the backend
        convertToken('google-oauth2', idToken).then((res) => {
          console.log(res)
          if (res.token) { // 若 token 存在，将其存入 localStorage
            localStorage.setItem('token', res.token)
            this.$emit('loginOk')
          }
        }, (err) => {
          console.log(err)
        })
      },
      OnGoogleAuthFail(error) {
        console.log(error)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .third-login {
    display: flex;
    justify-content: space-between;
    @include wh(340, 64);

    .icon {
      @include wh(64, 64);
      background-size: pxToRem(64) pxToRem(64);
    }

    .icon-facebook {
      background-image: url("./icon-facebook.png");
    }

    .icon-google {
      background-image: url("./icon-google.png");
    }

    .icon-twitter {
      background-image: url("./icon-twitter.png");
    }
  }
</style>
