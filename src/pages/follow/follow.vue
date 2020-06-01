<template>
  <div class="follow">
    <my-header
      :showBack="true"
      :title="title"
      @clicked="back">
    </my-header>
    <div class="capsule-wrapper" v-for="(item,index) in userList" :key="index">
      <capsule :info="item" @refresh="refresh"></capsule>
    </div>
  </div>
</template>

<script>
  import MyHeader from '../../components/myHeader/myHeader'
  import Capsule from '../../components/capsule/capsule'
  import {getFollowList, getFansList, follow, cancelFollowing} from '../../api/picture'

  export default {
    created() {
      this.type = this.$route.query.type
      this.userId = this.$route.query.user_id
      if (this.type == 0) {
        this.title = 'Following'
        this.getFollowList(this.userId)
      }
      if (this.type == 1) {
        this.title = 'Follower'
        this.getFansList(this.userId)
      }
    },
    data() {
      return {
        title: "",
        userList: [] // 用户列表
      }
    },
    methods: {
      back() {
        this.$router.back()
      },
      // 刷新列表
      refresh() {
        if (this.type == 0) {
          this.getFollowList(this.userId)
        }
        if (this.type == 1) {
          this.getFansList(this.userId)
        }
      },
      // 获取关注的用户列表
      getFollowList(id) {
        getFollowList(id).then((res) => {
          this.userList = res.map((item) => {
            return {
              id: item.concerned_info.id,
              name: item.concerned_info.name,
              picture: item.concerned_info.picture,
              username: item.concerned_info.username,
              flag: item.concerned_info.flag,
              concernedId: item.concerned_info.concerned_id
            }
          })
        }).catch((err) => {
          console.log(err)
        })
      },
      // 获取粉丝列表
      getFansList(id) {
        getFansList(id).then((res) => {
          this.userList = res.map((item) => {
            return {
              id: item.fans_info.id,
              name: item.fans_info.name,
              picture: item.fans_info.picture,
              username: item.fans_info.username,
              flag: item.fans_info.flag,
              concernedId: item.fans_info.concerned_id
            }
          })
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    components: {
      MyHeader,
      Capsule
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .follow {
    padding-top: pxToRem(112);

    .capsule-wrapper {
      border-bottom: 1px solid #f1f1f1;
    }
  }
</style>
