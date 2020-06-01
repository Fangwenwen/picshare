<template>
  <div class="recommend">
    <router-link class="search-wrapper" tag="div" to="/search">
      <search-box placeholder="Search for new topics"></search-box>
    </router-link>
    <div class="hot-search">
      <p class="hot-title">
        <span class="text">Hot search</span>
        <router-link tag="span" to="/topics" class="more">more</router-link>
      </p>
      <ul class="hot-list">
        <router-link class="hot-item" tag="li" v-for="item in hotTopicList" :to="'/topic-detail/'+item.key_words">
          {{item.key_words}}
        </router-link>
      </ul>
    </div>
    <div class="recommend-list">
      <p class="title">Picks</p>
      <my-waterfall
        :dataList="recommendList"
        @getDataList="getDataList"
        v-if="recommendList.length>0"
        ref="waterfall">
      </my-waterfall>
    </div>
  </div>
</template>

<script>
  import SearchBox from '../searchBox/searchBox'
  import MyWaterfall from '../myWaterfall/myWaterfall'
  import {getHotTopicList, getRecommendList} from '../../api/picture'

  export default {
    data() {
      return {
        hotTopicList: [], // 热门话题
        recommendList: [], // 用户动态的列表
        totalCount: 0, // 总条数
        pageSize: 10, // 每页显示的条数
        currentPage: 1 // 当前页
      }
    },
    created() {
      this.getHotTopicList()
      this.getRecommendList()
    },
    methods: {
      // 获取热门话题列表
      getHotTopicList() {
        getHotTopicList().then((res) => {
          this.hotTopicList = res
        }).catch((err) => {
          console.log(err)
        })
      },
      // 获取用户动态列表
      getRecommendList() {
        getRecommendList(this.pageSize, this.currentPage).then((res) => {
          this.totalCount = res.count
          let recommendList = res.results.map((item) => {
            return {
              authorId: item.author_id,
              author: item.name || item.author,
              head: item.logo,
              collectionNum: item.collection_num,
              isCollection: item.is_collection,
              src: item.picture_list[0],
              id: item.article_id // 此 id 为动态详情 id
            }
          })
          if (this.totalCount <= this.pageSize) {
            this.recommendList = recommendList
          } else {
            this.recommendList = this.recommendList.concat(recommendList)
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
        this.getRecommendList()
      }
    },
    components: {
      SearchBox,
      MyWaterfall
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .recommend {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding-top: pxToRem(48);

    .search-wrapper {
      @include wh(672, 60);
      margin-bottom: pxToRem(30);
    }

    .hot-search {
      width: 100%;
      padding: 0 pxToRem(24) pxToRem(48);
      margin-bottom: pxToRem(30);
      border-bottom: 1px solid #f1f1f1;

      .hot-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: pxToRem(20);

        .text {
          @include font-color(roboto medium, 32, #444);
        }

        .more {
          @include font-color(roboto regular, 24, #8e8e8e);
          padding-right: pxToRem(20);
          background: url("../../common/images/more.png") no-repeat right center;
          background-size: pxToRem(20) pxToRem(20);
        }
      }

      .hot-list {
        display: flex;
        flex-wrap: wrap;
        max-height: pxToRem(140);
        overflow: hidden;

        .hot-item {
          @include font-color(roboto regular, 24, #3b589a);
          height: pxToRem(60);
          line-height: pxToRem(60);
          padding: 0 pxToRem(32);
          border: 1px solid #efefef;
          border-radius: pxToRem(60);
          margin: 0 pxToRem(20) pxToRem(20) 0;
        }
      }
    }

    .recommend-list {
      width: 100%;
      padding: 0 pxToRem(24);

      .title {
        @include font-color(roboto medium, 32, #444);
        margin-bottom: pxToRem(20);
      }
    }
  }
</style>
