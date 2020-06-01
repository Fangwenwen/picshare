<template>
  <div class="nav-bar">
    <router-link class="item item-home" to="/home" tag="div">
      <span class="icon"></span>
      <span class="text">Home</span>
    </router-link>
    <router-link class="item item-my" to="/my" tag="div">
      <span class="icon"></span>
      <span class="text">Profile</span>
    </router-link>
  </div>
</template>

<script>
  export default {}
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .nav-bar {
    z-index: 9;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: pxToRem(96);
    background: #fafafa;

    .item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;

      .icon {
        @include wh(48, 48);
        background-repeat: no-repeat;
        background-position: center;
        background-size: pxToRem(48) pxToRem(48);
        margin-bottom: pxToRem(5);
      }

      .text {
        @include font-color(roboto regular, 20, #303030)
      }

      &:first-child {
        .icon {
          background-image: url("./home.png");
        }
      }

      &:last-child {
        .icon {
          background-image: url("./profile.png");
        }
      }
    }

    .item-home.active {
      .icon {
        background-image: url("./home-active.png");
      }
    }

    .item-my.active {
      .icon {
        background-image: url("./profile-active.png");
      }
    }
  }
</style>
