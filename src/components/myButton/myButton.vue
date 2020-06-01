<template>
  <div class="my-button"
       :class="{'disabled':disabled,'light':light}"
       :style="{width:_width,height:_height,fontSize:_fontSize,borderRadius:_height}"
       @click="clicked">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      width: {
        type: Number,
        default: 228
      },
      height: {
        type: Number,
        default: 42
      },
      fontSize: {
        type: Number,
        default: 20
      },
      disabled: {
        type: Boolean,
        default: false
      },
      light: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      _width() {
        return `${this.width / 100}rem`
      },
      _height() {
        return `${this.height / 100}rem`
      },
      _fontSize() {
        return `${this.fontSize / 100}rem`
      }
    },
    methods: {
      clicked() {
        if (this.disabled) { // 按钮禁止点击
          return
        }
        console.log('被点击')
        this.$emit('clicked')
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .my-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: $color-bg-btn;
    font-family: roboto regular;
    color: $color-btn;
  }

  .my-button.disabled {
    background: $color-bg-disabled-btn;
  }

  .my-button.light {
    background: $color-bg-light-btn;
    color: $color-light-btn;
    border: pxToRem(2) solid $color-border-light-btn;
  }
</style>
