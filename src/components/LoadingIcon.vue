<template>
  <div class="loading-wrapper" :style="{width: size ? (size + 'px') : '100%', paddingTop: size ? (size + 'px') : '100%', height: 0}">
    <div class="loading-item" v-for="(item, idx) in itemList" :key="idx" :style="{transform: 'rotate(' + (30 * idx) + 'deg) translateX(54%) scale(0.5, 0.5)', transformOrigin: '0 50%', animationDuration: (duration || 1.2) + 's', animationDelay: idx * ((duration || 1.2) / itemList.length) + 's'}"></div>
  </div>
</template>

<style scoped>
.loading-wrapper{
  position: relative;
}
.loading-item{
  width: 44%;
  height: 12%;
  /* border-radius: 50% 4% 50% 4%/50% 50% 4% 50%; */
  border-top-left-radius: 12% 40%;
  border-top-right-radius: 12% 40%;
  border-bottom-right-radius: 12% 40%;
  border-bottom-left-radius: 12% 40%;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -6%;
  animation: loading 1.2s infinite;
  background: #fff;
  /* transition: all 100ms; */
}
@keyframes loading {
  0%{
    background: #D2D2D2;
  }
  83.3% {
    background: #fff;
  }
  100%{
    background: #fff;
  }
}
</style>

<script>
export default {
  props: {
    size: {
      type: Number,
      required: false
    },
    duration: {
      type: Number,
      required: false
    },
    color: {
      type: Array,
      required: false
    }
  },
  data () {
    return {
      itemList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    }
  }
}
</script>
