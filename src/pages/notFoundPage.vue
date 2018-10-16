<template>
  <div class="page">
    <img class="image" :src="$assetsPublicPath + '/cwebassets-pc/image/not_found.png'" />
    <div class="not-found-tip">该页面不存在哦～</div>
  </div>
</template>

<style scoped>
.page{
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.image{
  display: block;
  width: 240px;
  height: 240px;
  margin: 240px auto 0;
}
.not-found-tip{
  font-size: 32px;
  line-height: 46px;
  margin-top: 20px;
  color: #666;
  text-align: center;
}
</style>
