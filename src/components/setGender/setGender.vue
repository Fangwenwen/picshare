<template>
  <div class="set-gender">
    <cell title="Gender" placeholder="secret" :des="value" @clicked="show=true"></cell>
    <popup :mode="1" :show="show" @close="show=false">
      <div class="gender-list">
        <div class="gender-item">
          <input type="radio" value="male" @change="select" class="blank">
          Male
        </div>
        <div class="gender-item">
          <input type="radio" value="female" @change="select" class="blank">
          Female
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
  import Cell from '../cell/cell'
  import Popup from '../popup/popup'

  export default {
    model: {
      event: "change"
    },
    props: {
      value: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        show: false
      }
    },
    methods: {
      select($event) {
        console.log($event.target.value)
        this.$emit('change', $event.target.value)
      }
    },
    components: {
      Cell,
      Popup
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .set-gender {

    .gender-list {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;

      .gender-item {
        position: relative;
        flex: 1;
        display: flex;
        align-items: center;
        padding-left: pxToRem(48);
        @include font-color(roboto regular, 32, #4b4b4b);

        .blank {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
        }
      }
    }
  }
</style>
