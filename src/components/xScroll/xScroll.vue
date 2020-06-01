<template>
  <div class="x-scroll">
    <ul class="list" ref="oUl">
      <li class="item" v-for="(item,index) in list" :key="index">
        <router-link :to="'/personal/'+item.id" class="alink">
          <img :src="item.picture" alt="" class="head">
        </router-link>
        <span class="username">{{item.name || item.username}}</span>
        <my-button
          :width="100" :height="40" :fontSize="24"
          v-if="!item.isConcerned"
          @clicked="follow(item.id,index)">
          Follow
        </my-button>
        <my-button
          :width="130" :height="40" :fontSize="24" :light="true"
          v-else
          @clicked="cancelFollowing(item.concernedId,index)">
          Following
        </my-button>
      </li>
    </ul>
  </div>
</template>

<script>
  import MyButton from '../myButton/myButton'
  import {follow, cancelFollowing} from '../../api/picture'

  const liWidth = 130,
    gapWidth = 30,
    marginRight = 24

  export default {
    props: {
      list: {
        type: Array,
        default: []
      }
    },
    mounted() {
      let ulWidth = this.list.length * liWidth + (this.list.length - 1) * gapWidth + marginRight
      this.$nextTick(() => {
        this.$refs.oUl.style.width = ulWidth / 100 + 'rem'
      })
    },
    methods: {
      // 关注
      follow(id, index) {
        follow(id).then((res) => {
          this.list[index].isConcerned = true // 将该用户设置为已关注
          this.list[index].concernedId = res.id // 设置该用户的关注id
          this.$toast({
            message: '关注成功'
          })
          this.$emit('refresh')
        }).catch((err) => {
          console.log(err)
        })
      },
      // 取消关注
      cancelFollowing(id, index) {
        cancelFollowing(id).then((res) => {
          this.list[index].isConcerned = false // 将该用户设置为未关注
          this.$toast({
            message: '取消关注'
          })
          this.$emit('refresh')
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    components: {
      MyButton
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .x-scroll {
    width: 100%;
    padding: pxToRem(24) 0 pxToRem(24) pxToRem(24);
    border-bottom: 1px solid #f1f1f1;
    overflow-x: auto; // 实现横向滚动

    &::-webkit-scrollbar {
      display: none; // 隐藏滚动条
    }

    .list {
      display: flex;

      .item {
        display: flex;
        align-items: center;
        flex-direction: column;
        width: pxToRem(130);
        margin-right: pxToRem(30);

        .alink {
          display: flex;
          @include wh(100, 100);
          margin-bottom: pxToRem(6);

          .head {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover; // 图片在保持其宽高比的同时填充元素的整个内容框。如果对象的宽高比与内容框不相匹配，该对象将被剪裁以适应内容框
          }
        }

        .username {
          width: 100%;
          @include overflow-ellipsis;
          @include font-color(roboto regular, 20, #303030);
          text-align: center;
          margin-bottom: pxToRem(8);
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
</style>
