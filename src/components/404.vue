<template>
  <div class="miss_page">
    <img src="@/assets/404.png" alt="">
    <span>啊哦,访问页面不存在~</span>
    <el-button type="primary" @click="goBackIndex">返回页面</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    goBackIndex() {
        this.$router.push('home')
    }
  },
}
</script>

<style lang="less" scoped>
.miss_page {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  img {
    width: 500px;
    height: 500px;
  }
  span {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 16px;
  }
}
</style>