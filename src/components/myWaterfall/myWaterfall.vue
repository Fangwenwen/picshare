<template>
  <div class="my-waterfall">
    <waterfall :dataList="dataList" @scrollReachBottom="getDataList" @imgError="imgError" ref="waterfall">
      <template v-slot="{pinInfo,index}">
        <div class="info" @click.stop.prevent>
          <router-link class="item" tag="div" :to="'/personal/'+pinInfo.authorId">
            <img :src="pinInfo.head" alt="" class="userhead">
            <span class="username">{{pinInfo.author}}</span>
          </router-link>
          <div class="item"
               @click="pinInfo.isCollection?cancelCollection(pinInfo.id,index):collection(pinInfo.id,index)">
            <span class="collect-icon" :class="pinInfo.isCollection?'active':''"></span>
            <span class="collect-num">{{pinInfo.collectionNum}}</span>
          </div>
        </div>
      </template>
    </waterfall>
  </div>
</template>

<script>
  import Waterfall from '../waterfall/waterfall'
  import {verify} from '../../common/js/util'
  import {collection, cancelCollection} from '../../api/picture'

  export default {
    props: {
      dataList: {
        type: Array,
        default: []
      },
      isRemove: { // 取消收藏时，是否删除该条数据，默认不删除
        type: Boolean,
        default: false
      }
    },
    methods: {
      getDataList() {
        this.$emit('getDataList')
      },
      imgError(imgItem) {
        console.log('图片加载错误', imgItem)
      },
      // 收藏某条动态
      collection(id, index) {
        verify(this.$route.fullPath, () => {
          collection(id).then((res) => {
            console.log(res)
            this.$toast({
              message: '收藏成功'
            })
            console.log(this.dataList[index])
            this.dataList[index].isCollection = true
            this.dataList[index].collectionNum++
            this.$refs.waterfall._preloaded()
          }).catch((err) => {
            console.log(err)
          })
        })
      },
      // 取消收藏某条动态
      cancelCollection(id, index) {
        cancelCollection(id).then((res) => {
          this.$toast({
            message: '取消收藏'
          })
          if (this.isRemove) {
            this.dataList.splice(index, 1)
            this.$emit('refresh') // 更新动态数、收藏数并且列表总数减一
            return
          }
          this.dataList[index].isCollection = false
          this.dataList[index].collectionNum--
          this.$refs.waterfall._preloaded()
        }).catch((err) => {
          console.log(err)
        })
      },
      // 数据全部加载完毕
      waterfallOver() {
        this.$refs.waterfall._over()
      }
    },
    components: {
      Waterfall
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .my-waterfall {
    width: 100%;

    .info {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: pxToRem(58);

      .item {
        display: flex;
        align-items: center;
        height: 100%;

        &:first-child {
          .userhead {
            @include wh(42, 42);
            border-radius: 50%;
            object-fit: cover; // 图片在保持其宽高比的同时填充元素的整个内容框。如果对象的宽高比与内容框不相匹配，该对象将被剪裁以适应内容框
            margin-right: pxToRem(8);
          }

          .username {
            @include font-color(roboto regular, 20, #444);
          }
        }

        &:last-child {
          .collect-icon {
            @include wh(24, 24);
            background: url("./collect-icon.png") no-repeat center;
            background-size: pxToRem(24) pxToRem(24);
            margin-right: pxToRem(8);
          }

          .collect-icon.active {
            background-image: url("./collected-icon.png");
          }

          .collect-num {
            @include font-color(roboto regular, 20, #b2b2b2);
          }
        }
      }
    }
  }
</style>
