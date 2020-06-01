<template>
  <div class="status" ref="status">
    <div class="personal-list" v-if="personalList.length>0">
      <card v-for="(item,index) in personalList"
            :key="index"
            :info="item"
            :showBtn="false"
            :showDelete="true"
            @refresh="refresh"
            @deleteSuccess="deleteSuccess">
      </card>
    </div>
    <no-result v-if="personalList.length===0">暂无数据</no-result>
  </div>
</template>

<script>
  import Card from '../card/card'
  import NoResult from '../noResult/noResult'
  import {getPersonalList} from '../../api/picture'

  // 获取窗口高度
  const windowH = window.innerHeight

  export default {
    data() {
      return {
        personalList: [], // 个人动态列表
        totalCount: 0, // 总条数
        pageSize: 10, // 每页显示的条数
        currentPage: 1 // 当前页
      }
    },
    created() {
      this.getPersonalList()
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
      refresh() { // 更新动态数、收藏数
        this.$emit('refresh')
      },
      deleteSuccess(id) { // 动态删除成功事件
        let index = this.personalList.findIndex((item) => {
          return item.article_id === id
        })
        this.personalList.splice(index, 1) // 删除列表中的 index 项
        this.totalCount-- // 总条数减一
      },
      // 获取个人动态列表
      getPersonalList() {
        getPersonalList(this.pageSize, this.currentPage).then((res) => {
          this.load = true // 加载
          this.totalCount = res.count // 总条数
          if (this.totalCount <= this.pageSize) {
            this.personalList = res.results
          } else {
            this.personalList = this.personalList.concat(res.results)
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 滚动事件
      _scroll() {
        if (!this.load) return // 判断是否可以加载新的数据
        if (this.$refs.status.clientHeight < window.pageYOffset + windowH) { // window.pageYOffset:浏览器滚动高度
          if (this.totalCount <= this.pageSize * this.currentPage) {
            return // 数据全部加载完毕
          }
          this.currentPage++
          this.getPersonalList()
          this.load = false // 不加载
        }
      }
    },
    components: {
      Card,
      NoResult
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .status {
    width: 100%;
    padding-bottom: pxToRem(96);

    .personal-list {
      background: #f9f9f9;
    }
  }
</style>
