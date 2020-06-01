<template>
  <div class="personal-details">
    <img :src="userInfo.picture" alt="" class="head">
    <div class="details">
      <p class="username">{{userInfo.name || userInfo.username}}</p>
      <p class="userId">ID:{{userInfo.id}}</p>
      <router-link class="following" :to="'/follow?type=0&user_id='+userInfo.id" tag="p">
        Following：{{following}}
      </router-link>
      <router-link class="followers" :to="'/follow?type=1&user_id='+userInfo.id" tag="p">
        Followers：{{followers}}
      </router-link>
    </div>
    <router-link class="edit-icon" tag="span" to="/information" v-if="showEdit"></router-link>
    <div class="btn-wrapper" v-if="!showEdit&&showBtn">
      <my-button
        :width="169" :height="50" :fontSize="28" :light="true"
        v-if="userInfo.isConcerned"
        @clicked="cancelFollowing">
        Following
      </my-button>
      <my-button
        :width="130" :height="50" :fontSize="28"
        v-else
        @clicked="follow">
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
      userInfo: {
        type: Object
      },
      following: {
        type: Number,
        default: 0
      },
      followers: {
        type: Number,
        default: 0
      },
      showEdit: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      ...mapGetters([
        'user'
      ]),
      showBtn() {
        if (this.user && this.user.id === this.userInfo.id || getStorage('user') && getStorage('user').id === this.userInfo.id) {
          return false
        }
        return true
      }
    },
    methods: {
      // 关注
      follow() {
        verify(this.$route.fullPath, () => {
          follow(this.userInfo.id).then((res) => {
            // this.userInfo.isConcerned = true // 将该用户设置为已关注
            // this.userInfo.concernedId = res.id // 设置该用户的关注id
            this.$emit('refresh')
            this.$toast({
              message: '关注成功'
            })
          }).catch((err) => {
            console.log(err)
          })
        })
      },
      // 取消关注
      cancelFollowing() {
        cancelFollowing(this.userInfo.concernedId).then((res) => {
          // this.userInfo.isConcerned = false // 将该用户设置为未关注
          this.$emit('refresh')
          this.$toast({
            message: '取消关注'
          })
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

  .personal-details {
    position: relative;
    display: flex;
    align-items: center;
    padding: pxToRem(48) pxToRem(24);

    .head {
      @include wh(180, 180);
      border-radius: 50%;
      object-fit: cover; // 图片在保持其宽高比的同时填充元素的整个内容框。如果对象的宽高比与内容框不相匹配，该对象将被剪裁以适应内容框
      margin-right: pxToRem(24);
    }

    .details {
      .username {
        width: pxToRem(269);
        @include overflow-ellipsis;
        @include font-color(roboto regular, 36, #444);
      }

      .userId {
        @include font-color(roboto regular, 20, #9b9b9b);
        margin-bottom: pxToRem(28);
      }

      .following, .followers {
        @include font-color(roboto regular, 28, #444);
      }

      .following {
        margin-bottom: pxToRem(4);
      }
    }

    .edit-icon {
      position: absolute;
      top: pxToRem(48);
      right: pxToRem(48);
      @include wh(48, 48);
      background: url("./edit-icon.png") no-repeat center;
      background-size: pxToRem(48) pxToRem(48);
    }

    .btn-wrapper {
      position: absolute;
      top: pxToRem(48);
      right: pxToRem(24);
    }
  }
</style>
