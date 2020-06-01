<template>
  <div class="cell" @click="clicked">
    <span class="cell-title">{{title}}</span>
    <input type="text" class="cell-des" disabled :placeholder="placeholder" v-model="des">
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: ""
      },
      des: {
        type: String,
        default: ""
      },
      placeholder: {
        type: String,
        default: ""
      }
    },
    methods: {
      clicked() {
        this.$emit('clicked')
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .cell {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: pxToRem(96);
    padding: 0 pxToRem(24);

    .cell-title, .cell-des {
      display: flex;
      align-items: center;
      height: 100%;
    }

    .cell-title {
      @include font-color(roboto regular, 28, #333);
    }

    .cell-des {
      text-align: right;
      @include font-color(roboto regular, 28, #7f7f7f);
      padding-right: pxToRem(40);
      background: url("./arrow.png") no-repeat right center;
      background-size: pxToRem(24) pxToRem(24);
    }
  }
</style>
