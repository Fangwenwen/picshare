<template>
  <div class="search-box" :class="left?'left':''">
    <span class="search" @click="search"></span>
    <form class="form-box" action="javascript:void(0);" @submit="search">
      <input type="text" :placeholder="placeholder" v-model="value" ref="input">
    </form>
  </div>
</template>

<script>
  export default {
    props: {
      left: { // 控制搜索图标放置的位置
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: 'Search'
      }
    },
    data() {
      return {
        value: '' // 搜索词
      }
    },
    methods: {
      // 搜索
      search() {
        if (this.value === '') return
        this.$refs.input.blur() // 使 input 失去焦点,键盘隐藏
        this.$router.push({ // 路由添加搜索的 query
          query: {
            q: this.value
          }
        })
        this.$emit('search', this.value)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .search-box {
    @include center;
    width: 100%;
    height: 100%;
    background: #f3f3f3;
    border-radius: pxToRem(6);

    .search {
      width: pxToRem(64);
      height: 100%;
      background: url("./search-icon.png") no-repeat pxToRem(24) center;
      background-size: pxToRem(32) pxToRem(32);
    }

    .form-box {
      display: flex;
      height: 100%;

      input {
        @include font-color(roboto regular, 28, #303030);
        width: 100%;
        height: 100%;
        background: #f3f3f3;
      }

      ::-webkit-input-placeholder {
        color: rgba(0, 0, 0, 0.3);
      }
    }
  }

  .search-box.left {
    justify-content: flex-start;

    .form-box {
      flex-grow: 1;
    }
  }
</style>
