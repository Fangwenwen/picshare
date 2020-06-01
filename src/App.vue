<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  import {mobileAdaptation} from './common/js/config'

  export default {
    created() {
      mobileAdaptation()

      window.addEventListener('resize', () => {
        mobileAdaptation()
      })
    }
  }
</script>
