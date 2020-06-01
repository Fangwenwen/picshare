<template>
  <div class="topic-detail">
    <my-header :showBack="true" :title="'#'+title" @clicked="back"></my-header>
    <div class="tab-bar">
      <div class="bar">
        <span class="text" :class="{'active':currentIndex===0}" @click="sort(0)">Popular</span>
      </div>
      <div class="bar">
        <div class="text" :class="{'active':currentIndex===1}" @click="sort(1)">Recent</div>
      </div>
    </div>
    <div class="status-list">
      <my-waterfall
        :dataList="statusList"
        @getDataList="getDataList"
        v-if="statusList.length>0"
        ref="waterfall">
      </my-waterfall>
    </div>
    <no-result v-if="statusList.length===0">暂无数据</no-result>
  </div>
</template>

<script>
  import MyHeader from '../../components/myHeader/myHeader' // 头部
  import MyWaterfall from '../../components/myWaterfall/myWaterfall' // 瀑布流
  import NoResult from '../../components/noResult/noResult'
  import {getStatusListByTopic} from '../../api/picture'

  export default {
    data() {
      return {
        title: "", // 话题标题
        currentIndex: 0, // 初始化为 Popular
        statusList: [], // 动态列表
        totalCount: 0, // 总条数
        pageSize: 10, // 每页显示的条数
        currentPage: 1 // 当前页
      }
    },
    computed: {
      order() { // 排序关键字
        return this.currentIndex === 0 ? 'popular' : this.currentIndex === 1 ? 'time' : ''
      }
    },
    created() {
      let topic = this.$route.params.topic
      this.title = topic
      this.getStatusList()
    },
    methods: {
      back() {
        this.$router.back()
      },
      // 排序
      sort(index) {
        this.currentIndex = index // 0 Popular  1 Recent
        this.currentPage = 1 // 重置当前页
        this.statusList = [] // 重置动态列表,使瀑布流重新渲染图片(my-waterfall组件隐藏)
        this.getStatusList()
      },
      // 根据话题获取动态列表
      getStatusList() {
        getStatusListByTopic(this.title, this.order, this.pageSize, this.currentPage).then((res) => {
          this.totalCount = res.count
          let statusList = res.results.map((item) => {
            return {
              authorId: item.article_info.author_id,
              author: item.article_info.name || item.article_info.author,
              head: item.article_info.logo,
              collectionNum: item.article_info.collection_num,
              isCollection: item.article_info.is_collection,
              src: item.article_info.picture_list[0],
              id: item.article_info.article_id // 此 id 为动态详情 id
            }
          })
          if (this.totalCount <= this.pageSize) {
            this.statusList = statusList
          } else {
            this.statusList = this.recommendList.concat(statusList)
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 瀑布流触底触发的事件
      getDataList() {
        if (this.totalCount <= this.pageSize * this.currentPage) {
          this.$refs.waterfall.waterfallOver() // 数据全部加载完毕
          return
        }
        this.currentPage++
        this.getStatusList()
      }
    },
    components: {
      MyHeader,
      MyWaterfall,
      NoResult
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .topic-detail {
    width: 100%;
    padding-top: pxToRem(112);

    .tab-bar {
      display: flex;
      width: 100%;
      height: pxToRem(88);
      margin: pxToRem(24) 0;

      .bar {
        flex: 1;
        @include center;
        height: 100%;

        .text {
          @include font-color(roboto medium, 32, #9c9c9c);
          height: 100%;
          line-height: pxToRem(88);
          padding: 0 pxToRem(20);
          border-bottom: pxToRem(6) solid transparent;
        }

        .text.active {
          color: #303030;
          border-bottom-color: #b8ece8;
        }
      }
    }

    .status-list {
      width: 100%;
      padding: 0 pxToRem(24);
    }
  }
</style>
