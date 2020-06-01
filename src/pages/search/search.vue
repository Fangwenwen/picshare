<template>
  <div class="search" ref="search">
    <div class="header">
      <div class="search-wrapper">
        <search-box placeholder="Search topics" :left="true" @search="search"></search-box>
      </div>
      <span class="btn" @click="back">Cancel</span>
    </div>
    <div class="user-wrapper" v-if="userList.length>0">
      <div class="title">
        <span class="text">User</span>
        <router-link tag="span" class="more" :to="'/users?q='+value">more</router-link>
      </div>
      <div class="user-list">
        <capsule v-for="(item,index) in userList" :key="index" :info="item"></capsule>
      </div>
    </div>
    <div class="article-list" v-if="statusList.length>0">
      <card
        v-for="(item,index) in statusList"
        :key="index"
        :info="item"
        :showBtn="false">
      </card>
    </div>
    <no-result v-if="value&&userList.length===0&&statusList.length===0">暂无搜索结果</no-result>
  </div>
</template>

<script>
  import SearchBox from '../../components/searchBox/searchBox'
  import Capsule from '../../components/capsule/capsule'
  import Card from '../../components/card/card'
  import NoResult from '../../components/noResult/noResult'
  import {searchUser, searchStatus} from "../../api/picture"

  // 获取窗口高度
  const windowH = window.innerHeight

  export default {
    data() {
      return {
        value: '', // 搜索词
        userList: [], // 用户列表
        statusList: [], // 动态列表
        totalCount: 0, // 动态总条数
        pageSize: 10, // 每页显示的动态条数
        currentPage: 1 // 当前页
      }
    },
    created() {
      this.value = this.$route.query.q // 如果有 query 则查询用户、动态列表
      if (this.value) {
        this.getUserList()
        this.getStatusList()
      }
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
        this.$router.push({
          path: '/home/recommend'
        })
      },
      // 搜索
      search(val) {
        this.value = val // 搜索词
        this.getUserList()
        this.getStatusList()
      },
      // 获取用户列表
      getUserList() {
        searchUser(this.value, 3, 1).then((res) => {
          this.userList = res.results.map((item) => {
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
        }).catch((err) => {
          console.log(err)
        })
      },
      // 获取动态列表
      getStatusList() {
        searchStatus(this.value, this.pageSize, this.currentPage).then((res) => {
          this.load = true // 加载
          if (this.totalCount <= this.pageSize) {
            this.statusList = res.results
          } else {
            this.statusList = this.statusList.concat(res.results)
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 滚动事件
      _scroll() {
        if (!this.load) return // 判断是否可以加载新的数据
        if (this.$refs.search.clientHeight - 10 < window.pageYOffset + windowH) { // window.pageYOffset:浏览器滚动高度
          if (this.totalCount <= this.pageSize * this.currentPage) {
            return // 数据全部加载完毕
          }
          this.currentPage++
          this.getStatusList()
          this.load = false // 不加载
        }
      }
    },
    components: {
      SearchBox,
      Capsule,
      Card,
      NoResult
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .search {
    padding-top: pxToRem(112);
    background: #f9f9f9;

    .header {
      z-index: 9;
      position: fixed;
      top: 0;
      left: 0;
      @include center;
      width: 100%;
      height: pxToRem(112);
      background: #fff;
      border-bottom: 1px solid #f1f1f1;

      .search-wrapper {
        @include wh(550, 60);
        margin-right: pxToRem(36);
      }

      .btn {
        @include font-color(roboto regular, 28, rgba(0, 0, 0, 0.5));
      }
    }

    .user-wrapper {
      padding-top: pxToRem(24);
      background: #fff;
      margin-bottom: pxToRem(20);

      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 pxToRem(24);

        .text {
          @include font-color(roboto medium, 32, #444);
        }

        .more {
          @include font-color(roboto regular, 24, #444);
          padding-right: pxToRem(20);
          background: url("../../common/images/more.png") no-repeat right center;
          background-size: pxToRem(20) pxToRem(20);
        }
      }
    }

    .article-list {
      background: #fff;
    }
  }
</style>
