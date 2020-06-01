<template>
  <div class="tab-bar">
    <router-link class="tab" tag="div" v-for="(item,index) in tabList" :key="index" :to="item.path">
      <span class="title">{{item.title}}</span>
      <span class="num">{{item.num}}</span>
    </router-link>
  </div>
</template>

<script>
  export default {
    props: {
      tabList: {
        type: Array,
        default: []
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .tab-bar {
    display: flex;
    width: 100%;
    height: pxToRem(96);
    padding: 0 pxToRem(24);
    background: #fff;
    border-bottom: 1px solid #f1f1f1;

    .tab {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      border-bottom: pxToRem(6) solid transparent;

      .title {
        @include font-color(roboto regular, 32, #9c9c9c);
        margin-right: pxToRem(4);
      }

      .num {
        @include font-color(roboto regular, 20, #a0a0a0);
      }
    }

    .tab.active {
      .title {
        color: #444;
      }

      border-color: #8ae1d9;
    }
  }
</style>
