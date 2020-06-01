<template>
  <div class="capsule">
    <router-link class="alink" :to="'/personal/'+info.id">
      <img :src="info.picture" alt="" class="head">
    </router-link>
    <div class="info">
      <p class="username">{{info.name || info.username}}</p>
      <p class="followers" v-if="info.followers>=0">{{info.followers}} followers</p>
      <p class="userId" v-else>ID:{{info.id}}</p>
    </div>
    <div class="btn-wrapper" v-if="userId!==info.id">
      <my-button
        :width="188" :height="60" :fontSize="28" :light="true"
        v-if="info.flag"
        @clicked="cancelFollowing(info.concernedId)">
        Following
      </my-button>
      <my-button
        :width="188" :height="60" :fontSize="28"
        v-else
        @clicked="follow(info.id)">
        Follow
      </my-button>
    </div>
  </div>
</template>

<script>
  import MyButton from '../myButton/myButton'
  import {mapGetters} from 'vuex'
  import {getStorage, verify} from '../../common/js/util'
  import {follow, cancelFollowing} from '../../api/picture'

  export default {
    props: {
      info: {
        type: Object,
        default: {}
      }
    },
    computed: {
      ...mapGetters([
        'user'
      ]),
      userId() {
        return this.user.id || getStorage('user') ? this.user.id || getStorage('user').id : -1
      }
    },
    methods: {
      // 关注
      follow(id) {
        verify(this.$route.fullPath, () => {
          follow(id).then((res) => {
            this.$toast({
              message: '关注成功'
            })
            this.info.flag = true
            this.$emit('refresh')
          }).catch((err) => {
            console.log(err)
          })
        })
      },
      // 取消关注
      cancelFollowing(id) {
        cancelFollowing(id).then((res) => {
          this.$toast({
            message: '取消关注'
          })
          this.info.flag = false
          this.$emit('refresh')
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    components: {
      MyButton
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .capsule {
    display: flex;
    align-items: center;
    width: 100%;
    height: pxToRem(145);
    padding: pxToRem(24);

    .alink {
      display: flex;
      @include wh(96, 96);
      margin-right: pxToRem(24);

      .head {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover; // 图片在保持其宽高比的同时填充元素的整个内容框。如果对象的宽高比与内容框不相匹配，该对象将被剪裁以适应内容框
      }
    }

    .info {
      width: pxToRem(300);
      margin-right: pxToRem(64);

      .username {
        width: 100%;
        @include overflow-ellipsis;
        @include font-color(roboto medium, 32, #444);
        margin-bottom: pxToRem(8);
      }

      .followers, .userId {
        @include font-color(roboto regular, 24, #7c7c7c);
      }
    }
  }
</style>
