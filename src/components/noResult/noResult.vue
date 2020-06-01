<template>
  <div class="no-result">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .no-result {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    @include font-color(roboto bold, 28, #8c969d);
    background: #fff;
  }
</style>
