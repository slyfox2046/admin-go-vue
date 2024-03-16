<template>
  <div class="login-container">
    <div class="login-form">
      <el-form ref="loginFormRef" :model="loginForm">
        <div class="title">通用后台管理系统</div>

        <el-form-item label="" prop="username">
          <el-input v-model="loginForm.username" placeholder="用户名" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="密码" prefix-icon="el-icon-key"></el-input>
        </el-form-item>
        <el-form-item label="" prop="image">
          <el-input v-model="loginForm.image" style="width: 240px; float: left" maxlength="6" placeholder="验证码" prefix-icon="el-icon-view"></el-input>
          <el-image class="captchaImg" style="width: 150px; float: right; cursor: pointer" @click="getCaptcha" :src="image" />
        </el-form-item>
        <el-form-item>
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-button type="primary" style="width: 100%; font-size: large" @click="loginBtn">登录</el-button>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-button type="info" style="width: 100%; font-size: large" @click="resetLoginForm">重置</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        iamge: '',
        key: '',
      },
      image: '',
      rules: {
        username: [
          {
            required: true,
            message: '请输入账号',
            trigger: 'blur',
          },
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        image: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
      },
    }
  },
  mounted() {
    this.getCaptcha()
  },
  methods: {
    async getCaptcha() {
      // 生成新的验证码图片链接
      const { data: res } = await this.$api.captcha()
      console.log('获取验证码res数据:', res)

      this.image = res.data.image
      this.loginForm.idKey = res.data.idKey
    },
    loginBtn() {
      // 在这里处理登录逻辑，包括验证验证码等
      console.log('登录信息:', this.loginForm)
      this.$refs.loginFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$api.login(this.loginForm)
          console.log('获取登录的res数据:', res)
          this.$message.success('登录成功')
          //
          this.$store.commit('saveSysAdmin', res.data.sysAdmin)
          this.$store.commit('saveToken', res.data.token)
          this.$store.commit('saveLeftMenuList', res.data.leftMenuList)
          this.$store.commit('savePermissionList', res.data.permissionList)
          //
          await this.$router.push('/home')
        } else {
          return false
        }
      })
    },
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
  },
}
</script>

<style lang="less" scoped>
.login-container {
  background-image: url('../assets/image/image2.png');
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-form {
  width: 400px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  .title {
    font-size: 23px;
    line-height: 1.5;
    text-align: center;
    margin-bottom: 20px;
    font-weight: bold;
    // font-style:italic;
  }
  .captchaImg {
    height: 38px;
    width: 100%;
    border: 1px solid #e6e6e6;
    margin-left: 8px;
  }
}
</style>
