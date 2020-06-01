<template>
  <div class="login">
    <span class="close-icon" @click="back"></span>
    <h3 class="title">Hello.</h3>
    <p class="greetings">Nice To Meet You</p>
    <!--<div class="phone-box input-box">-->
    <!--<select class="area-box" v-model="selectedCode">-->
    <!--<option v-for="(item,index) in areaCode" :key="index" :value="item">+{{item}}</option>-->
    <!--</select>-->
    <!--<input type="number" placeholder="Please enter your phone number" v-model="number">-->
    <!--</div>-->
    <!--<div class="verification-box input-box">-->
    <!--<input type="text" v-model="code">-->
    <!--<my-button :width="228" :height="42" :fontSize="20" :disabled="sendDisabled" @clicked="send">-->
    <!--<span v-if="!sendDisabled">Send verification code</span>-->
    <!--<span v-if="sendDisabled">{{time}} s</span>-->
    <!--</my-button>-->
    <!--</div>-->

    <input type="text" class="test-number" placeholder="Please enter your username" v-model="number">
    <input type="text" class="test-code" placeholder="Please enter your password" v-model="code">

    <my-button :width="528" :height="72" :fontSize="36" :disabled="loginDisabled" @clicked="login">SAVE</my-button>

    <div class="social-media">
      <p class="title">Or sign up with social media</p>
      <third-login @loginOk="getUserInfo"></third-login>
      <!--<div class="icon-box">-->
      <!--<span class="icon icon-facebook"></span>-->
      <!--<router-link tag="span" to="https://luckycj.xyz/login/google-oauth2/" class="icon icon-google"></router-link>-->
      <!--<span class="icon icon-twitter"></span>-->
      <!--</div>-->
    </div>

  </div>
</template>

<script>
  import MyButton from '../../components/myButton/myButton'
  import ThirdLogin from '../../components/thirdLogin/thirdLogin'
  import {phoneCheck, setStorage} from '../../common/js/util'
  import {sendCode, login, getUserInfo} from '../../api/user'
  import {mapMutations} from 'vuex'

  export default {
    data() {
      return {
        areaCode: [93, 86], // 可选择的区号
        selectedCode: "", // 已选择的区号
        number: "", // 手机号
        code: "", // 验证码
        message: "", // 提示信息
        sendDisabled: false, // 判断发送验证码按钮是否禁止点击
        time: 60 // 倒计时
      }
    },
    computed: {
      // 判断登录按钮是否禁止点击
      loginDisabled() {
        return !(this.number && this.code)
      }
    },
    created() {
      this.path = this.$route.query.redirect // 设置重定向的 url
      this.selectedCode = this.areaCode[0] // 设置默认区号
    },
    methods: {
      ...mapMutations([
        'setUser'
      ]),
      back() {
        this.$router.back()
      },
      send() {
        if (!this.number || !phoneCheck(this.number)) {
          this.message = "Add a valid phone number"
          this.$toast({
            message: this.message
          })
          return
        }
        sendCode(this.number).then((res) => {
          console.log(res)
          this.is_exist = res.is_exist
          this._countDown()
        }).catch((err) => {
          console.log(err)
        })
      },
      login() {
        // 临时注释
        // if (!this.is_exist) {
        //   this.message = "Error entering captcha"
        //   this.$toast({
        //     message: this.message
        //   })
        //   return
        // }

        this.is_exist = 1 // test 临时添加

        login(this.number, this.code, this.is_exist).then((res) => {
          console.log(res)
          if (res.token) { // 若 token 存在，将其存入 localStorage
            setStorage('token', res.token)
            this.getUserInfo()
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 获取用户信息
      getUserInfo() {
        getUserInfo().then((res) => {
          console.log(res)
          this.setUser(res) // 将用户信息存入全局
          setStorage('user', res) // 将用户信息存入 localStorage
          this.$router.push({
            path: this.path // 跳转到登录之前页面
          })
        }).catch((err) => {
          console.log(err)
        })
      },
      _countDown() { // 60s倒计时
        this.sendDisabled = true // 发送验证码按钮不可点击
        this.timer = setInterval(() => {
          if ((this.time--) === 1) {
            clearInterval(this.timer)
            this.sendDisabled = false
            this.time = 60
          }
        }, 1000)
      }
    },
    components: {
      MyButton,
      ThirdLogin
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .login {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #fff;
    padding-top: pxToRem(208);

    .close-icon {
      position: absolute;
      left: pxToRem(48);
      top: pxToRem(80);
      @include wh(48, 48);
      background: url("./close.png") no-repeat center;
      background-size: pxToRem(48) pxToRem(48);
    }

    .title {
      @include font-color(roboto regular, 64, #303030);
      margin-bottom: pxToRem(8);
    }

    .greetings {
      @include font-color(roboto regular, 28, #cbcbcb);
      margin-bottom: pxToRem(96);
    }

    .input-box {
      display: flex;
      align-items: center;
      @include wh(528, 96);
      @include font-color(roboto regular, 28, #444);
      border-bottom: 1px solid #f1f1f1;
    }


    /*
    * test
    */
    .test-number, .test-code {
      @include wh(528, 96);
      @include font-color(roboto regular, 28, #444);
      padding-left: pxToRem(8);
      border-bottom: 1px solid #f1f1f1;

      &::-webkit-input-placeholder {
        color: #d4d4d4;
      }
    }

    /*
    * test
    */
    .test-code {
      margin-bottom: pxToRem(96);
    }


    .phone-box {
      .area-box {
        @include wh(90, 58);
        padding-left: pxToRem(8);
        border: none; // 去边框
        border-right: 1px solid #dcdcdc;
        -webkit-appearance: none; // 去默认的下拉三角
        background: url("./down.png") no-repeat pxToRem(65) center transparent; // 添加下拉三角图标
        background-size: pxToRem(17) pxToRem(17);
      }

      input {
        width: pxToRem(438);
        height: 100%;
        padding-left: pxToRem(8);
      }

      ::-webkit-input-placeholder {
        color: #d4d4d4;
      }
    }

    .verification-box {
      margin-bottom: pxToRem(96);

      input {
        width: pxToRem(300);
        height: 100%;
        padding-left: pxToRem(8);
      }
    }

    .social-media {
      margin-top: pxToRem(158);

      .title {
        @include font-color(roboto regular, 18, #b2b2b2);
        text-align: center;
        margin-bottom: pxToRem(48);
      }

      .icon-box {
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
    }

  }
</style>
