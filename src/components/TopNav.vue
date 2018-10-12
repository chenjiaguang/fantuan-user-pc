<template>
  <div class="nav-wrapper">
    <div class="nav-fixer">
      <div class="nav-box">
        <img class="big-logo" :src="$assetsPublicPath + '/cwebassets-pc/image/van_logo.png'" />
        <img class="sub-logo" :src="$assetsPublicPath + '/cwebassets-pc/image/van_sub_logo.png'" />
        <div class="preview-btn">预览</div>
        <div class="publish-btn">发布</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-wrapper{
  width: 100%;
  height: 90px;
  position: relative;
}
.nav-fixer{
  width: 100%;
  height: 90px;
  position: fixed;
  left: 0;
  top: 0;
  background: #fff;
}
.nav-box{
  width: 1000px;
  height: 100%;
  display: flex;
  margin: 0 auto;
}
</style>
