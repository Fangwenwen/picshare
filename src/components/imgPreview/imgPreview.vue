<template>
  <div class="img-preview" @click="close">
    <div class="img-wrapper" ref="wrapper">
      <ul class="img-list">
        <li class="img-item" v-for="(item,index) in imgList_new" :key="index">
          <img :src="item.src" alt="" :style="{height:item.height+'px'}">
        </li>
      </ul>
    </div>
    <div class="operate">
      <span class="text">{{currentIndex}}/{{totalCount}}</span>
      <span class="download" @click.stop="download"></span>
    </div>
  </div>
</template>

<script>
  import {BetterScroll} from 'cube-ui'
  import {getFilenameByUrl, downloadImg} from '../../common/js/util'

  const screenW = window.innerWidth

  export default {
    props: {
      imgList: { // 图片列表
        type: Array,
        default: []
      },
      initialIndex: { // 想预览的图片 index
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        currentIndex: 1, // 当前图片
        imgList_new: [] // 图片预加载完成，插入新的字段 height 后，才开始渲染
      }
    },
    computed: {
      totalCount() {
        return this.imgList.length
      }
    },
    created() {
      this.ua = window.navigator.userAgent.toLowerCase() // 获取用户手机设备
      this.loadedCount = 0 // 已加载的图片数量
      this.currentIndex = this.initialIndex + 1
    },
    mounted() {
      // 图片预加载
      this._preload()
      // 监听预加载完成事件
      this.$on('preloaded', this._preloaded)
    },
    methods: {
      // 图片下载
      download() {
        if (/iphone|ipad|ipod/.test(this.ua)) {
          this.$toast({
            message: '长按图片保存'
          })
          return
        }
        if (/android/.test(this.ua)) {
          const path = this.imgList_new[this.currentIndex - 1].src
          const name = getFilenameByUrl(path)
          downloadImg(path, name)
        }
      },
      // 图片资源预加载
      _preload() {
        this.imgList.forEach((item, index) => {

          const _img = new Image()
          _img.src = item.src

          // 图片加载成功
          _img.onload = _img.onerror = (e) => {
            this.loadedCount++
            // 计算图片的高
            console.log(_img.width, _img.height)

            this.imgList[index].height = e.type === 'load' ? screenW / (_img.width / _img.height) : screenW

            if (e.type === 'error') {
              this.imgList[index].error = true
              this.$emit('imgError', this.imgList[index])
            }

            if (this.loadedCount === this.imgList.length) { // 满足此条件，图片资源才全部加载完成
              this.$emit('preloaded') // 触发预加载完成事件
            }
          }
        })
      },
      // 预加载完成事件
      _preloaded() {
        this.imgList_new = this.imgList
        this.$nextTick(() => {
          this._setSliderWidth()
          this._initSlider()
        })
      },
      // 设置图片列表和每张图片的宽度
      _setSliderWidth() {
        let oUl = this.$refs.wrapper.firstChild
        oUl.style.width = screenW * this.imgList.length + 'px'
        for (let i = 0; i < oUl.children.length; i++) {
          oUl.children[i].style.width = screenW + 'px'
        }
      },
      // 初始化 betterScroll
      _initSlider() {
        this.slider = new BetterScroll(this.$refs.wrapper, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: false,
            threshold: 0.3,
            speed: 400
          },
          preventDefaultException: {tagName: /^IMG$/} // 该字段表示 img 标签的默认行为不会被阻止
        })
        this._goToPage(this.initialIndex)
        this.slider.on('scrollEnd', this._onScrollEnd)
      },
      _goToPage(index) {
        this.slider && this.slider.goToPage(index, 0, 0)
      },
      _onScrollEnd() {
        let index = this.slider.getCurrentPage().pageX
        this.currentIndex = index + 1
      },
      // 关闭图片预览
      close() {
        this.$emit('close')
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .img-preview {
    z-index: 10;
    position: fixed;
    top: 0;
    left: 0;
    @include center;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);

    .img-wrapper {
      width: 100%;
      overflow: hidden;

      .img-list {
        display: flex;

        .img-item {
          flex: 1;
          display: flex;
          align-items: center;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .operate {
      position: absolute;
      left: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: pxToRem(96);
      padding: 0 pxToRem(24);

      .text {
        @include font-color(roboto regular, 28, #fff);
      }

      .download {
        @include wh(40, 40);
        background: url("./download.png") no-repeat center;
        background-size: pxToRem(40) pxToRem(40);
      }
    }
  }
</style>
