<template>
  <div class="setting">
    <my-header
      :showBack="true"
      title="Settings"
      :showSetting="false"
      @clicked="back">
    </my-header>
    <div class="cell-box">
      <cell title="Language"></cell>
      <cell title="Feedback"></cell>
      <cell title="Privacy Policy"></cell>
    </div>
    <my-button
      :width="528" :height="72" :fontSize="36"
      @clicked="logOut">
      Log Out
    </my-button>
  </div>
</template>

<script>
  import MyHeader from '../../components/myHeader/myHeader'
  import Cell from '../../components/cell/cell'
  import MyButton from '../../components/myButton/myButton'
  import {clearStorage} from '../../common/js/util'

  export default {
    methods: {
      back() {
        this.$router.back()
      },
      // 退出登录
      logOut() {
        clearStorage()
        this.$router.push({
          path: '/' // 返回首页
        })
      }
    },
    components: {
      MyHeader,
      Cell,
      MyButton
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .setting {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding-top: pxToRem(112);

    .cell-box {
      width: 100%;
      margin-bottom: pxToRem(96);
    }
  }
</style>
