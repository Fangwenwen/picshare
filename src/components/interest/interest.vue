<template>
  <div class="interest" ref="interest">
    <x-scroll
      :list="recommendUser"
      v-if="recommendUser.length>0"
      @refresh="refresh">
    </x-scroll>
    <card
      v-for="(item,index) in concernedList"
      :key="index"
      :info="item"
      :showBtn="false">
    </card>
  </div>
</template>

<script>
  import XScroll from '../xScroll/xScroll'
  import Card from '../card/card'
  import {mapGetters} from 'vuex'
  import {getStorage} from '../../common/js/util'
  import {getRecommendUser, getConcernedList} from '../../api/picture'

  // 获取窗口高度
  const windowH = window.innerHeight

  export default {
    data() {
      return {
        recommendUser: [], // 推荐关注的用户
        concernedList: [], // 关注人的动态列表
        totalCount: 0, // 总条数
        pageSize: 10, // 每页显示的条数
        currentPage: 1 // 当前页
      }
    },
    computed: {
      ...mapGetters([
        'user'
      ])
    },
    created() {
      this.userId = this.user.id || getStorage('user') ? this.user.id || getStorage('user').id : 0
      this.getRecommendUser(this.userId)
      this.getConcernedList()
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
      // 更新关注人的动态列表
      refresh() {
        this.concernedList = [] // 先清空关注人的动态列表
        this.getConcernedList()
      },
      // 获取推荐关注的用户列表
      getRecommendUser(id) {
        getRecommendUser(id).then((res) => {
          this.recommendUser = res.map((item) => {
            return {
              id: item.user_info[0].id,
              username: item.user_info[0].username,
              name: item.user_info[0].name,
              picture: item.user_info[0].picture,
              isConcerned: false // 是否关注
            }
          })
        }).catch((err) => {
          console.log(err)
        })
      },
      // 获取关注人的动态列表
      getConcernedList() {
        getConcernedList(this.pageSize, this.currentPage).then((res) => {
          this.load = true // 加载
          this.totalCount = res.count // 总条数
          if (this.totalCount <= this.pageSize) {
            this.concernedList = res.results
          } else {
            this.concernedList = this.concernedList.concat(res.results)
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 滚动事件
      _scroll() {
        if (!this.load) return // 判断是否可以加载新的数据
        if (this.$refs.interest.clientHeight < window.pageYOffset + windowH) {
          if (this.totalCount <= this.pageSize * this.currentPage) {
            return // 数据全部加载完毕
          }
          this.currentPage++
          this.getConcernedList()
          this.load = false // 不加载
        }
      }
    },
    components: {
      XScroll,
      Card
    }
  }
</script>

<style scoped lang="scss">

</style>
