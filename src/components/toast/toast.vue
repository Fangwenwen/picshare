<template>
  <transition name="fade">
    <div class="toast" v-if="visible">
      {{message}}
    </div>
  </transition>
</template>

<script>
  export default {
    data() {
      return {
        visible: false, // 组件是否可见
        message: "", // 提示信息
        time: 1500 // 提示信息显示的时间
      }
    },
    mounted() {
      this.close()
    },
    methods: {
      close() {
        setTimeout(() => {
          this.visible = false
        }, this.time)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .toast {
    z-index: 10;
    position: fixed;
    bottom: pxToRem(200);
    left: 50%;
    transform: translateX(-50%);
    padding: pxToRem(6) pxToRem(16);
    border-radius: pxToRem(42);
    @include font-color(roboto regular, 20, #fff);
    background: #ccc;
  }
</style>
