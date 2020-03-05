<template>
  <div>
    <el-button type="info" @click="loginOut">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    loginOut() {
      window.sessionStorage.clear() //清楚token
      this.$router.push("/login") //返回到登录页面
    }
  }
}
</script>

<style lang="less" scoped></style>
