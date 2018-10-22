<template>
  <div class="loading-wrapper">
    <div class="loading-item" v-for="(item, idx) in itemList" :key="idx" :style="{transform: 'rotate(' + (45 * idx) + 'deg) translateX(30%)', transformOrigin: '0 50%'}"></div>
  </div>
</template>

<style scoped>
.loading-wrapper{
  width: 100%;
  height: 100%;
  position: relative;
}
.loading-item{
  width: 30%;
  height: 8%;
  /* border-radius: 50% 4% 50% 4%/50% 50% 4% 50%; */
  border-top-left-radius: 15% 50%;
  border-top-right-radius: 15% 50%;
  background: red;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -4%;
}
</style>

<script>
export default {
  data () {
    return {
      itemList: [1, 2, 3, 4, 5, 6, 7, 8]
    }
  }
}
</script>
