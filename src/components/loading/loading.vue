<template>
  <div class="loading" v-if="visible">
    <svg viewBox="25 25 50 50" class="circular">
      <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
    </svg>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        visible: false
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .loading {
    z-index: 10;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.35);

    .circular {
      height: pxToRem(60);
      width: pxToRem(60);
      animation: loading-rotate 2s linear infinite;

      .path {
        animation: loading-dash 1.5s ease-in-out infinite;
        stroke-dasharray: 90, 150;
        stroke-dashoffset: 0;
        stroke-width: 2;
        stroke: #409eff;
        stroke-linecap: round;
      }
    }
  }

  @keyframes loading-rotate {
    to {
      transform: rotate(1turn)
    }
  }

  @keyframes loading-dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: pxToRem(-40)
    }
    to {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: pxToRem(-120)
    }
  }
</style>
