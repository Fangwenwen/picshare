<template>
  <div class="home">
    <div class="header-bar">
      <router-link class="bar" tag="div" to="/home/recommend">Popular</router-link>
      <router-link class="bar" tag="div" to="/home/interest">Follow</router-link>
      <div class="camera">
        <input type="file"
               accept="image/png, image/jpeg, image/jpg"
               multiple
               class="blank"
               ref="files"
               @change="selectImg"
               @click="verify">
      </div>
    </div>
    <router-view></router-view>
    <nav-bar></nav-bar>
  </div>
</template>

<script>
  import NavBar from '../../components/navBar/navBar' // 底部导航
  import {mapMutations} from 'vuex'
  import {verify} from '../../common/js/util'

  export default {
    methods: {
      ...mapMutations([
        'setFileList'
      ]),
      // 验证用户是否登录，未登录则跳转到登录页
      verify(e) {
        // 这里利用 e.preventDefault() 阻止 input 的默认行为：change 事件
        verify(this.$route.fullPath, () => {
        }, e)
      },
      // 图片选择事件
      selectImg() {
        let fileList = this.$refs.files.files
        if (fileList.length > 9) {
          this.$toast({
            message: 'You can only select 9 photos'
          })
          return
        }
        for (let i = 0; i < fileList.length; i++) {
          let size = Math.floor(fileList[i].size / 1024)
          if (size > 5 * 1024) {
            this.$toast({
              message: 'Please select photos within 5M'
            })
            return
          }
        }
        this.setFileList(Array.from(fileList))
        this.$router.push({
          path: '/publish'
        })
      }
    },
    components: {
      NavBar
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .home {
    padding-top: pxToRem(112);
    padding-bottom: pxToRem(96);

    .header-bar {
      z-index: 9;
      position: fixed;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: pxToRem(112);
      background: #fff;
      border-bottom: 1px solid #f1f1f1;

      .bar {
        @include font-color(roboto medium, 40, #7f7f7f);
        width: pxToRem(175);
        height: 100%;
        line-height: pxToRem(112);
        text-align: center;
        border-bottom: pxToRem(6) solid transparent;
      }

      .bar.active {
        color: #303030;
        border-bottom-color: #8AE1D9;
      }

      .camera {
        position: absolute;
        right: pxToRem(24);
        display: flex;
        @include wh(48, 48);
        background: url("./camera.png") no-repeat center;
        background-size: pxToRem(48) pxToRem(48);

        .blank {
          width: 100%;
          height: 100%;
          opacity: 0;
          font-size: pxToRem(0);
        }
      }
    }
  }
</style>
