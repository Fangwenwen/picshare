<template>
  <div class="add-topic" @click="cancel">
    <div class="topic-box" @click.stop>
      <input type="text" class="text" placeholder="Add new topic" v-model="topic">
      <div class="btn-box">
        <span class="cancel" @click="cancel">CANCEL</span>
        <span class="save" @click="save">SAVE</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        topic: "" // 话题
      }
    },
    methods: {
      cancel() {
        this.$emit('cancel')
      },
      // 选择话题
      save() {
        if (this.topic) {
          this.$emit('save', this.topic)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .add-topic {
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

    .topic-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      @include wh(560, 252);
      padding-top: pxToRem(64);
      border-radius: pxToRem(10);
      background: #fff;

      .text {
        @include font-color(roboto regular, 28, #587ba1);
        @include wh(432, 70);
        text-align: center;
        border-radius: pxToRem(10);
        background: #f3f3f3;
        margin-bottom: pxToRem(32);
      }

      ::-webkit-input-placeholder {
        color: #a9a9a9;
      }

      .btn-box {
        display: flex;
        @include wh(432, 70);

        span {
          flex: 1;
          @include font-color(roboto regular, 28, #a9a9a9);
          text-align: center;
          line-height: pxToRem(70);
        }

        .save {
          color: #8ae1d9;
        }
      }
    }
  }
</style>
