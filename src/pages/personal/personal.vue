<template>
  <div class="personal" ref="personal">
    <my-header :showBack="true" @clicked="back"></my-header>
    <personal-details
      :userInfo="userInfo"
      :following="following"
      :followers="followers"
      :showEdit="false"
      @refresh="getOneUserInfo">
    </personal-details>
    <div class="tab">
      <span class="title">STATUS</span>
      <span class="num">{{articleNum}}</span>
    </div>
    <div class="article-list">
      <card v-for="(item,index) in articleList"
            :key="index"
            :info="item"
            :showBtn="false">
      </card>
    </div>
  </div>
</template>

<script>
  import MyHeader from '../../components/myHeader/myHeader' // 头部
  import PersonalDetails from '../../components/personalDetails/personalDetails' // 用户信息
  import Card from '../../components/card/card'
  import {getOneUserInfo} from '../../api/user'

  // 获取窗口高度
  const windowH = window.innerHeight

  export default {
    data() {
      return {
        userInfo: {}, // 用户信息
        following: 0, // 关注数
        followers: 0, // 粉丝数
        articleNum: 0, // 动态数
        articleList: [], // 动态列表
        totalCount: 0, // 总条数
        pageSize: 10, // 每页显示的条数
        currentPage: 1 // 当前页
      }
    },
    created() {
      this.user = this.$route.params.id
      this.getOneUserInfo()
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
      // 获取个人所有信息
      getOneUserInfo() {
        getOneUserInfo(this.user, this.pageSize, this.currentPage).then((res) => {
          this.userInfo = {
            id: res[0].id,
            username: res[0].username,
            name: res[0].name,
            picture: res[0].picture,
            isConcerned: res[0].is_concerned,
            concernedId: res[0].concerned_id
          }
          this.following = res[0].statistic.follow_num
          this.followers = res[0].statistic.fans_num
          this.articleNum = res[0].statistic.article_num

          this.load = true // 加载
          this.totalCount = res[0].article_info.count // 总条数
          let articleList = res[0].article_info.list
          if (this.totalCount <= this.pageSize) {
            this.articleList = articleList
          } else {
            this.articleList = this.articleList.concat(articleList)
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 滚动事件
      _scroll() {
        if (!this.load) return // 判断是否可以加载新的数据
        // window.pageYOffset:浏览器滚动高度
        if (this.$refs.personal.clientHeight - 10 < window.pageYOffset + windowH) {
          if (this.totalCount <= this.pageSize * this.currentPage) {
            return // 数据全部加载完毕
          }
          this.currentPage++
          this.getOneUserInfo()
          this.load = false // 不加载
        }
      }
    },
    components: {
      MyHeader,
      PersonalDetails,
      Card
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .personal {
    padding-top: pxToRem(112);

    .tab {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50%;
      height: pxToRem(96);
      margin-left: pxToRem(24);
      border-bottom: pxToRem(6) solid #8ae1d9;

      .title {
        @include font-color(roboto regular, 32, #444);
        margin-right: pxToRem(4);
      }

      .num {
        @include font-color(roboto regular, 20, #a0a0a0);
      }
    }

    .article-list {
      background: #f9f9f9;
    }
  }
</style>
