<template>
  <div class="set-username">
    <cell title="Username" placeholder="Set your user name" :des="value" @clicked="show=true"></cell>
    <popup :mode="3" :show="show">
      <div class="wrapper">
        <my-header :showBack="true" title="Change your username" @clicked="close"></my-header>
        <div class="username-box">
          <span class="des">My username</span>
          <div class="input-box">
            <input type="text" v-model="username">
            <span class="clear-icon" @click="clear"></span>
          </div>
        </div>
        <div class="num">{{num}}/20</div>
        <my-button :width="528" :height="72" :fontSize="36" @clicked="confirm">SAVE</my-button>
      </div>
    </popup>
  </div>
</template>

<script>
  import Cell from '../cell/cell'
  import Popup from '../popup/popup'
  import MyHeader from '../myHeader/myHeader'
  import MyButton from '../myButton/myButton'

  export default {
    props: {
      value: {
        type: String,
        default: ""
      }
    },
    created() {
      this.username = this.value // 初始化要修改的用户名
    },
    data() {
      return {
        show: false,
        username: "" // 修改的用户名
      }
    },
    computed: {
      // 字数
      num() {
        return this.username ? this.username.length : 0
      }
    },
    watch: {
      username(newVal, oldVal) {
        if (newVal.length > 20) {
          this.username = oldVal
        }
      }
    },
    methods: {
      // 关闭用户名修改页
      close() {
        this.show = false
      },
      // 重置要修改的用户名为空
      clear() {
        this.username = ""
      },
      // 确定修改
      confirm() {
        this.$emit('input', this.username)
        this.show = false
      }
    },
    components: {
      Cell,
      Popup,
      MyHeader,
      MyButton
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .set-username {

    .wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: pxToRem(160);

      .username-box {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: pxToRem(130);
        padding: 0 pxToRem(24);
        margin-bottom: pxToRem(24);

        .des, .input-box {
          flex: 1;
          display: flex;
          align-items: center;
        }

        .des {
          @include font-color(roboto regular, 28, #b2b2b2);
        }

        .input-box {
          @include font-color(roboto regular, 24, #4c4c4c);
          border-bottom: 1px solid #f1f1f1;

          input {
            width: pxToRem(417);
            height: 100%;
            margin-right: pxToRem(219);
          }

          .clear-icon {
            @include wh(36, 36);
            background: url("./clear.png") no-repeat center;
            background-size: pxToRem(36) pxToRem(36);
          }
        }
      }

      .num {
        width: 100%;
        @include font-color(roboto regular, 24, #b2b2b2);
        padding-left: pxToRem(24);
        margin-bottom: pxToRem(96);
      }
    }
  }
</style>
