<template>
  <div class="my-header">
    <span class="icon back-icon" v-if="showBack" @click="clicked"></span>
    <span class="title" :class="!showBack?'center':''">{{title}}</span>
    <router-link class="icon setting-icon" tag="span" to="/setting" v-if="showSetting"></router-link>
    <div class="btn-wrapper" v-if="showBtn">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      showBack: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ""
      },
      showSetting: {
        type: Boolean,
        default: false
      },
      showBtn: {
        type: Boolean,
        default: false
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

  .my-header {
    z-index: 9;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: pxToRem(112);
    background: #fff;
    border-bottom: 1px solid #f1f1f1;

    .icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      @include wh(48, 48);
      background-repeat: no-repeat;
      background-position: center;
      background-size: pxToRem(48) pxToRem(48);
    }

    .back-icon {
      left: pxToRem(24);
      background-image: url("../../common/images/back-icon.png");
    }

    .setting-icon {
      right: pxToRem(24);
      background-image: url("./setting-icon.png");
    }

    .btn-wrapper {
      position: absolute;
      right: pxToRem(24);
      top: 50%;
      transform: translateY(-50%);
    }

    .title {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: pxToRem(132);
      @include font-color(roboto medium, 40, #303030);
    }

    .title.center {
      left: 50%;
      transform: translate(-50%, -50%);
    }

  }
</style>
