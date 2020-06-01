<template>
  <div class="share">
    <span class="more-icon" @click="show=true"></span>
    <popup :mode="2" :show="show" @close="show=false">
      <div class="share-content" @click.stop>
        <ul class="share-list">
          <li class="item-1 item">
            <span class="icon" v-facebook-share="{appId:facebookAppId,href:href}"></span>
            <span class="text">Facebook</span>
          </li>
          <li class="item-2 item">
            <a class="alink" href="javascript:;" @click="openTwitter">
              <span class="icon"></span>
            </a>
            <span class="text">Twitter</span>
          </li>
          <li class="item-3 item">
            <a class="alink" :href="`fb-messenger://share/?link=${href}&app_id=${messageAppId}`">
              <span class="icon"></span>
            </a>
            <span class="text">Message</span>
          </li>
        </ul>
        <ul class="btn-list">
          <li class="item-delete item" v-if="showDelete" @click="deleteStatus">
            <span class="icon"></span>
            <span class="text">Delete</span>
          </li>
          <li class="item-1 item" v-else>
            <span class="icon"></span>
            <span class="text">Not<br/>Interested</span>
          </li>
          <li class="item-2 item">
            <span class="icon"></span>
            <span class="text">Report</span>
          </li>
        </ul>
        <span class="cancel" @click="show=false">Cancel</span>
      </div>
    </popup>
  </div>
</template>

<script>
  import Popup from '../popup/popup'
  import {deleteStatus} from '../../api/picture'

  export default {
    props: {
      showDelete: { // 是否显示删除按钮
        type: Boolean,
        default: false
      },
      articleId: { // 要删除的动态id
        type: Number,
        default: -1
      }
    },
    data() {
      return {
        show: false, // 控制更多操作是否显示
        facebookAppId: '', // facebook appid
        messageAppId: '' // message appid
      }
    },
    computed: {
      href() { // 需要分享的链接
        return `https://luckycj.xyz/test/index.html#/detail/${this.articleId}`
      }
    },
    created() {
      this.ua = window.navigator.userAgent.toLowerCase() // 获取用户手机设备
    },
    methods: {
      // 删除动态
      deleteStatus() {
        deleteStatus(this.articleId).then((res) => {
          this.show = false
          this.$emit('deleteSuccess', this.articleId)
        }).catch((err) => {
          console.log(err)
        })
      },
      // 打开 twitter
      openTwitter() {
        window.location.href = 'twitter://post?message=' + this.href
        setTimeout(() => {
          if (/iphone|ipad|ipod/.test(this.ua)) {
            window.location.href = 'itms-appss://itunes.apple.com/cn/app/twitter/id333903271?l=en&mt=8&ign-refClientId=3z3Gnn26zFPXz4yezC1szRPGliiJJ'
            return
          }
          if (/android/.test(this.ua)) {
            window.location.href = 'https://play.google.com/store/apps/details?id=com.twitter.android'
          }
        }, 2000)
      },
      // facebook分享成功回调
      shareSuccess(res) {
        console.log(res)
      },
      // facebook分享失败回调
      shareFail(err) {
        console.log(err)
      }
    },
    components: {
      Popup
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .share {
    display: flex;
    @include wh(44, 44);

    .more-icon {
      width: 100%;
      height: 100%;
      background: url("./share-icon.png") no-repeat center;
      background-size: pxToRem(44) pxToRem(44);
    }

    .share-content {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;

      .share-list, .btn-list {
        display: flex;
        width: 100%;
        padding: pxToRem(48);
        border-bottom: 1px solid #f1f1f1;

        .item {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: pxToRem(115);
          margin-right: pxToRem(45);

          .icon {
            @include wh(96, 96);
            background-repeat: no-repeat;
            background-position: center;
            background-size: pxToRem(96) pxToRem(96);
            margin-bottom: pxToRem(10);
          }

          .text {
            @include font-color(roboto regular, 24, #7e7e7e);
            text-align: center;
          }
        }
      }

      .share-list {
        .item {
          .alink {
            display: flex;
            @include wh(96, 96);
            margin-bottom: pxToRem(10);

            .icon {
              margin-bottom: 0;
            }
          }
        }

        .item-1 {
          .icon {
            background-image: url("./facebook-icon.png");
          }
        }

        .item-2 {
          .icon {
            background-image: url("./twitter-icon.png");
          }
        }

        .item-3 {
          .icon {
            background-image: url("./message-icon.png");
          }
        }
      }

      .btn-list {
        .item-1 {
          .icon {
            background-image: url("./not-interest-icon.png");
          }
        }

        .item-delete {
          .icon {
            background-image: url("./delete-icon.png");
          }
        }

        .item-2 {
          .icon {
            background-image: url("./report-icon.png");
          }
        }
      }

      .cancel {
        width: 100%;
        height: pxToRem(100);
        @include font-color(roboto medium, 32, #7e7e7e);
        text-align: center;
        line-height: pxToRem(100);
      }
    }
  }
</style>
