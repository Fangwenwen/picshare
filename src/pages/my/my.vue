<template>
  <div class="my">
    <my-header :showBack="false" title="Me" :showSetting="true"></my-header>
    <personal-details :userInfo="userInfo" :following="following" :followers="followers"></personal-details>
    <tab-bar :tabList="tabList"></tab-bar>
    <router-view @refresh="getUserStatistic"></router-view>
    <nav-bar></nav-bar>
  </div>
</template>

<script>
  import MyHeader from '../../components/myHeader/myHeader' // 头部
  import PersonalDetails from '../../components/personalDetails/personalDetails' // 用户信息
  import TabBar from '../../components/tabBar/tabBar' // tab 页
  import NavBar from '../../components/navBar/navBar' // 底部导航
  import {mapGetters, mapMutations} from 'vuex'
  import {getUserInfo, getUserStatistic} from '../../api/user'
  import {setStorage, getStorage} from '../../common/js/util'

  export default {
    data() {
      return {
        userInfo: {}, // 用户信息
        following: 0,
        followers: 0,
        tabList: [
          {
            title: "STATUS",
            path: "/my/status",
            num: 0
          },
          {
            title: "COLLECTION",
            path: "/my/collection",
            num: 0
          }
        ]
      }
    },
    computed: {
      ...mapGetters([
        'user'
      ])
    },
    created() {
      this.getUserStatistic()
      if (this.user.username || getStorage('user')) { // 如果全局中或者localStorage中存在用户信息，则不需要再次请求获取用户信息的接口
        this.userInfo = this.user.username ? this.user : getStorage('user')
        return
      }
      this.getUserInfo()
    },
    methods: {
      ...mapMutations([
        'setUser'
      ]),
      // 获取用户信息
      getUserInfo() {
        getUserInfo().then((res) => {
          this.userInfo = res
          this.setUser(res) // 将用户信息存入全局
          setStorage('user', res) // 将用户信息存入 localStorage
        }).catch((err) => {
          console.log(err)
        })
      },
      // 获取登录用户的关注数、粉丝数、动态数、收藏数
      getUserStatistic() {
        getUserStatistic().then((res) => {
          this.following = res[0].follow_num
          this.followers = res[0].fans_num
          this.tabList[0].num = res[0].article_num
          this.tabList[1].num = res[0].collection_num
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    components: {
      MyHeader,
      PersonalDetails,
      TabBar,
      NavBar
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .my {
    width: 100%;
    padding-top: pxToRem(112);
  }
</style>
