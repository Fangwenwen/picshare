<template>
  <div class="users" ref="users">
    <my-header
      :showBack="true"
      @clicked="back">
    </my-header>
    <div class="user-wrapper">
      <div class="title">
        <span class="text">User</span>
      </div>
      <div class="user-list">
        <capsule v-for="(item,index) in userList" :key="index" :info="item"></capsule>
      </div>
    </div>
  </div>
</template>

<script>
  import MyHeader from '../../components/myHeader/myHeader'
  import Capsule from '../../components/capsule/capsule'
  import {searchUser} from "../../api/picture"

  // 获取窗口高度
  const windowH = window.innerHeight

  export default {
    data() {
      return {
        userList: [], // 用户列表
        totalCount: 0, // 总条数
        pageSize: 10, // 每页显示的条数
        currentPage: 1 // 当前页
      }
    },
    created() {
      this.value = this.$route.query.q
      this.getUserList()
    },
    mounted() {
      // 开启浏览器滚动监听
      window.addEventListener('scroll', this._scroll)
    },
    destroyed() {
      // 关闭浏览器滚动监听
      window.removeEventListener('scroll', this._scroll)
    },
    methods: {
      back() {
        this.$router.back()
      },
      // 获取动态列表
      getUserList() {
        searchUser(this.value, this.pageSize, this.currentPage).then((res) => {
          this.load = true // 加载
          this.totalCount = res.count
          let userList = res.results.map((item) => {
            return {
              id: item.id,
              name: item.name,
              picture: item.picture,
              username: item.username,
              flag: item.is_concerned,
              followers: item.statistic.fans_num,
              concernedId: item.concerned_id
            }
          })
          if (this.totalCount <= this.pageSize) {
            this.userList = userList
          } else {
            this.userList = this.userList.concat(userList)
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 滚动事件
      _scroll() {
        if (!this.load) return // 判断是否可以加载新的数据
        if (this.$refs.users.clientHeight <= window.pageYOffset + windowH) { // window.pageYOffset:浏览器滚动高度
          if (this.totalCount <= this.pageSize * this.currentPage) {
            return // 数据全部加载完毕
          }
          this.currentPage++
          this.getUserList()
          this.load = false // 不加载
        }
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

  .users {
    padding-top: pxToRem(112);

    .user-wrapper {
      padding-top: pxToRem(24);

      .title {
        display: flex;
        align-items: center;
        padding: 0 pxToRem(24);

        .text {
          @include font-color(roboto medium, 32, #444);
        }
      }
    }
  }
</style>
