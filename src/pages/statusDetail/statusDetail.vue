<template>
  <div class="status-detail">
    <my-header
      :showBack="true"
      title="Status"
      @clicked="back">
    </my-header>
    <card
      :info="detailInfo"
      :showBtn="showBtn"
      :showDelete="showDelete">
    </card>
  </div>
</template>

<script>
  import MyHeader from '../../components/myHeader/myHeader'
  import Card from '../../components/card/card'
  import {mapGetters} from 'vuex'
  import {getStorage} from '../../common/js/util'
  import {getStatusDetail} from '../../api/picture'

  export default {
    data() {
      return {
        detailInfo: {}, // 详情信息
        showBtn: true, // 是否显示关注按钮，如果是自己的动态详情则不显示
        showDelete: false // 是否显示删除按钮，如果是自己的动态详情则显示
      }
    },
    created() {
      let articleId = this.$route.params.id
      this.getStatusDetail(articleId)
    },
    computed: {
      ...mapGetters([
        'user'
      ])
    },
    methods: {
      back() {
        this.$router.back()
      },
      // 获取状态详情
      getStatusDetail(id) {
        getStatusDetail(id).then((res) => {
          if (this.user && this.user.id === res.author_id || getStorage('user') && getStorage('user').id === res.author_id) { // 判断该动态是否是自己的
            this.showBtn = false
            this.showDelete = true
          }
          this.detailInfo = res
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    components: {
      MyHeader,
      Card
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .status-detail {
    padding-top: pxToRem(112);
  }
</style>
