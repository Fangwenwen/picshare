<template>
  <div class="collection">
    <my-waterfall
      :dataList="collectionList"
      :isRemove="true"
      @getDataList="getDataList"
      @refresh="refresh"
      v-if="collectionList.length>0"
      ref="waterfall">
    </my-waterfall>
    <no-result v-if="collectionList.length===0">暂无收藏</no-result>
  </div>
</template>

<script>
  import MyWaterfall from '../myWaterfall/myWaterfall'
  import NoResult from '../noResult/noResult'
  import {getCollectionList} from '../../api/picture'

  export default {
    data() {
      return {
        collectionList: [], // 我的收藏列表
        totalCount: 0, // 总条数
        pageSize: 10, // 每页显示的条数
        currentPage: 1 // 当前页
      }
    },
    created() {
      this.getCollectionList()
    },
    methods: {
      refresh() { // 更新动态数、收藏数
        this.$emit('refresh')
        this.totalCount-- // 列表总数减一
      },
      // 获取我的收藏列表
      getCollectionList() {
        getCollectionList(this.pageSize, this.currentPage).then((res) => {
          this.totalCount = res.count
          let collectionList = res.results.map((item) => {
            return {
              authorId: item.article.author_id,
              author: item.article.name || item.article.author,
              head: item.article.logo,
              collectionNum: item.article.collection_num,
              isCollection: item.article.is_collection,
              src: item.article.picture_list[0],
              id: item.article.article_id // 此 id 为动态详情 id
            }
          })
          if (this.totalCount <= this.pageSize) {
            this.collectionList = collectionList
          } else {
            this.collectionList = this.collectionList.concat(collectionList)
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
        this.getCollectionList()
      }
    },
    components: {
      MyWaterfall,
      NoResult
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .collection {
    width: 100%;
    padding: pxToRem(48) pxToRem(24) pxToRem(96);
  }
</style>
