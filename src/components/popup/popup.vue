<template>
  <transition :name="mode===1?'fade':mode===2?'slide-bottom':'slide-right'">
    <div class="popup"
         :class="mode===1||mode===2?'mask':''"
         v-if="show"
         @click="close">
      <div class="box" :class="'box-'+mode">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      mode: {
        type: Number,
        default: 1
      },
      show: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      close() {
        this.$emit('close')
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .fade-enter-active, .fade-leave-active {
    transition: opacity .2s ease;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .slide-bottom-enter-active, .slide-bottom-leave-active {
    transition: all .2s ease;
  }

  .slide-bottom-enter, .slide-bottom-leave-to {
    .box {
      transform: translateY(100%);
    }
  }

  .slide-right-enter-active, .slide-right-leave-active {
    transition: all .2s ease;
  }

  .slide-right-enter, .slide-right-leave-to {
    .box {
      transform: translateX(100%);
    }
  }

  .popup {
    z-index: 10;
    @include allcover;

    .box {
      position: absolute;
      transition: all .2s ease;
    }

    .box-1 {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      @include wh(620, 270);
      border-radius: pxToRem(4);
      background: #fff;
    }

    .box-2 {
      bottom: 0;
      left: 0;
      width: 100%;
      border-radius: pxToRem(12) pxToRem(12) 0 0;
      background: #fff;
    }

    .box-3 {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #fff;
    }
  }

  .popup.mask {
    background: rgba(0, 0, 0, 0.35);
  }
</style>
