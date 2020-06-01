<template>
  <div class="waterfall" ref="waterfall">
    <div class="pin"
         :style="{width:pinWidth_new+'px'}"
         v-for="(item,index) in dataList_new"
         :key="index">
      <router-link class="alink" :to="'/detail/'+item.id">
        <img class="pin-img"
             :style="{width:pinWidth_new+'px',height:item.pinHeight_new+'px'}"
             :src="item[srcKey]"
             alt="">
        <slot :pinInfo="item" :index="index"></slot>
      </router-link>
    </div>
    <div class="loading" :style="{top:loadingTop+'px'}" v-if="showLoading">
      <img src="./loading.gif" alt="">
    </div>
  </div>
</template>

<script>

  // 获取窗口高度
  const windowH = window.innerHeight,
    loadingHeight = 24

  export default {
    props: {
      // 区块左右间隔的距离
      gapWidth: {
        type: Number,
        default: 16
      },
      // 区块上下间隔的距离
      gapHeight: {
        type: Number,
        default: 28
      },
      // 区块的宽度
      pinWidth: {
        type: Number,
        default: 324
      },
      // 瀑布流的最大列数
      maxCol: {
        type: Number,
        default: 5
      },
      reachBottomDis: {
        type: Number,
        default: 0
      },
      // 需要渲染的数据列表
      dataList: {
        type: Array,
        default: []
      },
      // 需要渲染的数据的图片地址
      srcKey: {
        type: String,
        default: 'src'
      }
    },
    data() {
      return {
        showLoading: true, // 显示等待图片加载的动画
        loadingTop: 0, // 等待图片加载的动画的top值
        isMobile: !!navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i), // 初始化移动端
        dataList_new: [] // 图片预加载完成，插入新的字段 pinHeight_new 后，才开始渲染瀑布流
      }
    },
    computed: {
      // 区块的宽：若为 pc 端，则区块宽度为父组件传入宽度；若为移动端，则瀑布流默认为2列，区块宽度需重新计算
      pinWidth_new() {
        return this.isMobile ? (this.$refs.waterfall.clientWidth - this.gapWidth) / this.col : this.pinWidth
      }
    },
    created() {
      this.col = 2 // 若为移动端，则瀑布流默认为2列
      this.loadedCount = 0 // 已加载的图片数量
      this.currentIndex = 0 // 开始要排列的区块索引,首次为第一列第一个区块，后续加载则为已经排列区块的下一个索引
      this.load = true // 保证满足一次触底条件，只加载一次数据，只当新的图片完成预加载后才可继续记载新的数据
    },
    mounted() {
      // 图片预加载
      this._preload()
      // 监听预加载完成事件
      this.$on('preloaded', this._preloaded)
      // 开启浏览器滚动监听
      window.addEventListener('scroll', this._scroll)
    },
    watch: {
      dataList(newVal, oldVal) {
        console.log(newVal, oldVal)
        if (newVal.length < this.dataList_new.length) { // 当新的瀑布流条数小于前一次瀑布流条数时(如删除一条数据)，需全部重新加载
          this._reset()
        }
        this._preload()
      }
    },
    methods: {
      // 图片资源预加载
      _preload() {
        this.dataList.forEach((item, index) => {
          if (index < this.loadedCount) return // 只对新加载图片进行预加载

          this.showLoading = true // 开启等待图片加载的动画

          // 有图片时
          const _img = new Image()
          _img.src = item[this.srcKey]

          // 图片加载成功
          _img.onload = _img.onerror = (e) => {
            // console.log('图片加载成功')
            this.loadedCount++
            // console.log(_img.width, _img.height)
            // 计算瀑布流中区块的高
            this.dataList[index].pinHeight_new = e.type === 'load' ? this.pinWidth_new / (_img.width / _img.height) : this.pinWidth_new
            if (e.type === 'error') {
              this.dataList[index].error = true
              this.$emit('imgError', this.dataList[index])
            }
            if (this.loadedCount === this.dataList.length) { // 满足此条件，图片资源才全部加载完成
              this.$emit('preloaded') // 触发预加载完成事件
              this.showLoading = false // 关闭等待图片加载的动画
            }
          }
        })
      },
      // 预加载完成事件
      _preloaded() {
        this.dataList_new = this.dataList.slice()
        this.$nextTick(() => {
          this.pins = this.$refs.waterfall.children // 获取所有的区块
          console.log(this.pins)
          this._setPosition() // 设置每个区块位置
        })
      },
      // 区块位置设置
      _setPosition() {
        if (!this.pins) return
        let top, // 区块的 top
          left, // 区块的 left
          _height // 区块的 height
        if (this.currentIndex === 0) this._colHeightArr = [] // 表示每列总高度的数组
        for (let i = this.currentIndex; i < this.pins.length; i++) {
          // 区块的高度 + 区块上下间距
          _height = this.pins[i].offsetHeight + this.gapHeight // offsetHeight:包括 padding、border、滚动条，不包括 margin

          if (i < this.col) {
            this._colHeightArr.push(_height)
            top = 0
            left = i * (this.pinWidth_new + this.gapWidth)
          } else {
            let _minHeight = Math.min.apply(null, this._colHeightArr) // 获取最低高度
            let _minIndex = this._colHeightArr.indexOf(_minHeight) // 获取最低高度的列的索引
            top = _minHeight
            left = _minIndex * (this.pinWidth_new + this.gapWidth)
            this._colHeightArr[_minIndex] = _minHeight + _height // 更新该索引的列的高度
          }
          this.pins[i].style.top = `${top}px`
          this.pins[i].style.left = `${left}px`
        }

        // 设置瀑布流的高度
        let _maxHeight = Math.max.apply(null, this._colHeightArr) // 获取最高高度
        this.loadingTop = _maxHeight - this.gapHeight // 设置等待图片加载的动画的位置
        this.$refs.waterfall.style.height = _maxHeight - this.gapHeight + loadingHeight + 'px' // 设置整个瀑布流的高度

        this.currentIndex = this.pins.length // 位置设置完成后，新增图片再从该索引开始预加载和排列
        this.load = true // 当新的图片插入到文档中排好序后，才可继续加载新的数据
      },
      // 滚动监听事件
      _scroll() {
        if (!this.load) return // 判断是否可以加载新的数据
        const _minHeight = Math.min.apply(null, this._colHeightArr)
        // window.pageYOffset:浏览器滚动高度
        if (_minHeight - this.reachBottomDis < window.pageYOffset + windowH) {
          this.load = false // 变成不加载
          this.$emit('scrollReachBottom') // 触发滚动触底事件
        }
      },
      // 数据加载完毕，无新的数据
      _over() {
        window.removeEventListener('scroll', this._scroll) // 关闭浏览器滚动监听
      },
      // 重置
      _reset() {
        this.dataList_new = [] // 渲染的数据置空
        this.currentIndex = 0 // 开始要排列的区块索引置0
        this.loadedCount = 0 // 已加载的图片数量置0
        this.load = true // 可以加载新的数据
        window.addEventListener('scroll', this._scroll)
      },
      // 响应式
      _response() {
        window.addEventListener('resize', () => {

        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .waterfall {
    position: relative;
    width: 100%;

    .pin {
      position: absolute;
      display: flex;
      /*box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.04);*/

      .alink {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;

        .pin-img {
          border: 1px solid #fafafa;
          border-radius: 6px;
        }
      }
    }

    .loading {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      width: 24px;
      height: 24px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
