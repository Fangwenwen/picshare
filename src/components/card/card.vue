<template>
  <div class="card">
    <div class="title">
      <router-link class="alink" :to="'/personal/'+info.author_id">
        <img :src="info.logo" alt="" class="head">
      </router-link>
      <div class="info">
        <p class="username">{{info.name||info.author}}</p>
        <p class="date">{{date}}</p>
      </div>
      <div class="btn-wrapper" v-if="showBtn">
        <my-button
          :width="169" :height="50" :fontSize="28" :light="true"
          v-if="info.is_concerned"
          @clicked="cancelFollowing">
          Following
        </my-button>
        <my-button
          :width="130" :height="50" :fontSize="28"
          v-else
          @clicked="follow">
          Follow
        </my-button>
      </div>
    </div>
    <div class="content">
      <span class="tag">#{{tag}}#</span>
      <p class="text">{{info.detail}}</p>
      <div class="img-box">
        <img :src="item" alt=""
             class="img-item"
             :class="info.picture_list.length===1?'single':'multiple'"
             v-for="(item,index) in info.picture_list"
             :key="index"
             @click="preview(index)">
      </div>
      <span class="views">{{info.click_num}} views</span>
    </div>
    <div class="operate">
      <a class="item" href="javascript:;" @click="openWhatsApp">
        <span class="icon"></span>
        <span class="text">{{shareNum}}</span>
      </a>
      <div class="item" @click="info.is_collection?cancelCollection(info.article_id):collection(info.article_id)">
        <span class="icon" :class="info.is_collection?'active':''"></span>
        <span class="text">{{info.collection_num}}</span>
      </div>
      <div class="item">
        <share
          :showDelete="showDelete"
          :articleId="info.article_id"
          @deleteSuccess="deleteSuccess">
        </share>
      </div>
    </div>
    <img-preview
      :imgList="imgList"
      :initialIndex="initialIndex"
      @close="close"
      v-if="imgList.length>0">
    </img-preview>
  </div>
</template>

<script>
  import MyButton from '../myButton/myButton'
  import Share from '../share/share'
  import ImgPreview from '../imgPreview/imgPreview'
  import {follow, cancelFollowing, collection, cancelCollection} from '../../api/picture'
  import {verify} from '../../common/js/util'

  export default {
    props: {
      info: {
        type: Object,
        default: {}
      },
      showBtn: { // 是否显示关注或取消关注按钮
        type: Boolean,
        default: true
      },
      showDelete: { // 是否显示删除按钮
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        imgList: [], // 需要预览的图片列表
        initialIndex: 0, // 想预览的图片 index
        shareNum: 0 // 分享的次数
      }
    },
    computed: {
      date() {
        return this.info.add_time && this.info.add_time.substring(0, 10)
      },
      tag() {
        return this.info.tag_list && this.info.tag_list[0]
      },
      href() { // 需要分享的链接
        return `https://luckycj.xyz/test/index.html#/detail/${this.info.article_id}`
      }
    },
    created() {
      this.ua = window.navigator.userAgent.toLowerCase() // 获取用户手机设备
    },
    methods: {
      // 图片预览
      preview(index) {
        this.imgList = this.info.picture_list.map((item) => {
          return {
            src: item
          }
        })
        this.initialIndex = index
      },
      // 关闭图片预览
      close() {
        this.imgList = []
      },
      // 关注
      follow() {
        verify(this.$route.fullPath, () => {
          follow(this.info.author_id).then((res) => {
            this.info.is_concerned = true // 将该用户设置为已关注
            this.info.concerned_id = res.id // 设置该用户的关注id
            this.$toast({
              message: '关注成功'
            })
          }).catch((err) => {
            console.log(err)
          })
        })
      },
      // 取消关注
      cancelFollowing() {
        cancelFollowing(this.info.concerned_id).then((res) => {
          this.info.is_concerned = false // 将该用户设置为未关注
          this.$toast({
            message: '取消关注'
          })
        }).catch((err) => {
          console.log(err)
        })
      },
      // 收藏某条动态
      collection(id) {
        verify(this.$route.fullPath, () => {
          collection(id).then((res) => {
            this.$toast({
              message: '收藏成功'
            })
            this.info.is_collection = true
            this.info.collection_num++
            this.$emit('refresh') // 更新动态数、收藏数
          }).catch((err) => {
            console.log(err)
          })
        })
      },
      // 取消收藏某条动态
      cancelCollection(id) {
        cancelCollection(id).then((res) => {
          this.$toast({
            message: '取消收藏'
          })
          this.info.is_collection = false
          this.info.collection_num--
          this.$emit('refresh') // 更新动态数、收藏数
        }).catch((err) => {
          console.log(err)
        })
      },
      // 动态删除成功事件
      deleteSuccess(id) {
        this.$emit('deleteSuccess', id)
        this.$emit('refresh') // 更新动态数、收藏数
      },
      // 打开 whatsapp
      openWhatsApp() {
        window.location.href = 'whatsapp://send?text=' + this.href
        setTimeout(() => {
          if (/iphone|ipad|ipod/.test(this.ua)) {
            window.location.href = 'itms-appss://itunes.apple.com/cn/app/whatsapp-messenger/id310633997?l=en&mt=8&ign-refClientId=3z3Gnn26zFPXz4yezC1szRPGliiJJ'
            return
          }
          if (/android/.test(this.ua)) {
            window.location.href = 'https://play.google.com/store/apps/details?id=com.whatsapp'
          }
        }, 2000)
      }
    },
    components: {
      MyButton,
      Share,
      ImgPreview
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .card {
    width: 100%;
    padding: pxToRem(24) pxToRem(24) 0;
    background: #fff;
    margin-bottom: pxToRem(20);

    &:last-child {
      margin-bottom: 0;
    }

    .title {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      margin-bottom: pxToRem(20);

      .alink {
        display: flex;
        @include wh(78, 78);
        margin-right: pxToRem(20);

        .head {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover; // 图片在保持其宽高比的同时填充元素的整个内容框。如果对象的宽高比与内容框不相匹配，该对象将被剪裁以适应内容框
        }
      }

      .info {
        width: pxToRem(390);

        .username {
          width: 100%;
          @include overflow-ellipsis;
          @include font-color(roboto regular, 32, #444);
          margin-bottom: pxToRem(10);
        }

        .date {
          @include font-color(roboto regular, 20, #696969);
        }
      }

      .btn-wrapper {
        position: absolute;
        right: 0;
      }
    }

    .content {
      display: flex;
      flex-direction: column;
      width: 100%;
      margin-bottom: pxToRem(20);

      .tag, .text {
        @include font-color(roboto regular, 28, #444);
      }

      .tag {
        color: #3b589a;
      }

      .text {
        margin-bottom: pxToRem(20);
      }

      .img-box {
        display: flex;
        flex-wrap: wrap;

        .img-item {
          object-fit: cover; // 图片在保持其宽高比的同时填充元素的整个内容框。如果对象的宽高比与内容框不相匹配，该对象将被剪裁以适应内容框
        }

        .single {
          @include wh(334, 445);
          margin-bottom: pxToRem(8);
        }

        .multiple {
          @include wh(220, 220);
          margin: 0 pxToRem(6) pxToRem(8) 0;

          &:nth-child(3n) {
            margin-right: 0;
          }
        }
      }

      .views {
        @include font-color(roboto regular, 20, #b1b1b1);
      }

    }

    .operate {
      position: relative;
      display: flex;
      width: 100%;
      height: pxToRem(70);
      padding: 0 pxToRem(24);

      .item {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;

        .icon {
          @include wh(44, 44);
          background-repeat: no-repeat;
          background-position: center;
          background-size: pxToRem(44) pxToRem(44);
          margin-right: pxToRem(8);
        }

        .text {
          @include font-color(roboto medium, 22, #7e7e7e);
        }

        &:first-child {
          margin-right: pxToRem(80);

          .icon {
            background-image: url("./whatsapp-icon.png");
          }
        }

        &:nth-child(2) {
          .icon {
            background-image: url("./collect-icon.png");
          }

          .icon.active {
            background-image: url("./collected-icon.png");
          }
        }

        &:last-child {
          position: absolute;
          top: 0;
          right: pxToRem(24);
        }
      }
    }
  }
</style>
