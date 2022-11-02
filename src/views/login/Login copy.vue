<template>
  <div class="login">

    <img src="@/assets/JBLOGO.png" alt="">
    <el-card v-if="register === 'login'">
      <el-row class="topcut">
        <el-col :span="7" @click.native="showPassword">密码登录</el-col>
        <el-col :span="1">|</el-col>
        <el-col :span="16" @click.native="showVerify">验证码登录</el-col>
      </el-row>

      <!-- 密码登录区域 -->
      <el-form :model="passForm" v-if="loginShow === 'pass'" :key="1" :rules="passRules" ref="passRuleForm">
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="passForm.mobile" placeholder="注册时填写的手机号"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input v-model="passForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-row class="remember_forget">
          <el-col :span="12" class="left">
            <el-checkbox label="记住我"></el-checkbox>
          </el-col>
          <el-col :span="12" class="right">
            <el-link :underline="false" target="_blank" @click="showReset">忘记密码？</el-link>
          </el-col>
        </el-row>
        <el-button type="primary" @click="loginPassword">登录</el-button>
      </el-form>

      <!-- 验证码登录区域 -->
      <el-form :model="verifyForm" v-else-if="loginShow === 'verify'" :key="2" :rules="verifyRules" ref="verifyRuleForm">
        <el-form-item label="手机号码" prop="vermobile">
          <el-input v-model="verifyForm.vermobile" placeholder="注册时填写的手机号"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="vercode">
          <el-input v-model="verifyForm.vercode" placeholder="请填写验证码"></el-input>
          <a href="" class="getcode">获取验证码</a>
        </el-form-item>
        <el-row class="remember_forget">
          <el-col :span="12" class="left">
            <el-checkbox label="记住我"></el-checkbox>
          </el-col>
        </el-row>
        <el-button type="primary" @click="loginVerify">登录</el-button>
      </el-form>
    </el-card>
    <!-- 密码重置区 -->
    <el-card v-else-if="register === 'reset'">
      <el-row class="topcut">
        <el-col :span="24" class="resetpass">密码重置</el-col>
      </el-row>
      <!-- 密码重置区 -->
      <el-form :model="resetPassword" :rules="resetRules" :key="3">
        <!-- 密码登录区域 -->
        <el-form-item label="手机号码" prop="resmobile">
          <el-input v-model="resetPassword.resmobile" placeholder="注册时填写的手机号"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="rescode">
          <el-input v-model="resetPassword.rescode" placeholder="请填写短信验证码"></el-input>
          <a href="" class="getcode">获取验证码</a>
        </el-form-item>
        <el-form-item label="设置密码" prop="respassword">
          <el-input v-model="resetPassword.respassword" placeholder="6-12位必须包含数字和字母"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="24" class="left">
            <span>已有账号</span>
            <el-link :underline="false" type="primary" target="_blank" @click="showLogin">登录</el-link>
          </el-col>
        </el-row>
        <el-button type="primary">确认修改</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      resetPass: 'reset',
      passForm: {
        mobile: '',
        password: '',
      },
      verifyForm: {
        vermobile: '',
        vercode: '',
      },
      resetPassword: {
        resmobile: '',
        rescode: '',
        respassword: '',
      },
      loginShow: 'pass',
      register: 'login',
      passRules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入11位手机号', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '请输入6 - 12位密码', trigger: 'blur' },
        ],
      },
      verifyRules: {
        vermobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入11位手机号', trigger: 'blur' },
        ],
        vercode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 6, max: 6, message: '请输入6位数字验证码', trigger: 'blur' },
        ],
      },
      resetRules: {
        resmobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入11位手机号', trigger: 'blur' },
        ],
        rescode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 6, max: 6, message: '请输入6位数字验证码', trigger: 'blur' },
        ],
        respassword: [
          { required: true, message: '请输入需要设置的密码', trigger: 'blur' },
          { min: 6, max: 12, message: '请输入6 - 12位密码,包含数字和字母', trigger: 'blur' },
        ],
      }
    }
  },
  methods: {
    showPassword() {
      console.log(this)
      // this.$refs.verifyRuleForm.resetFields()

      this.loginShow = 'pass'
    },
    showVerify() {
      this.loginShow = 'verify'
      // this.$refs.passRuleForm.resetFields()
    },
    showReset() {
      this.register = 'reset'
    },
    showLogin() {
      this.register = 'login'
    },
    // 确认按钮-密码登录验证
    loginPassword() {
      this.$refs.passRuleForm.validate(async (valid) => {
        if (!valid) return this.$message.error('请填写完整内容')
        const { data: res } = await this.$axios.post('login')
        if (res.meta.status !== 200)
          return this.$message.error('登录失败,请输入正确的手机号或密码')
        this.$message.success('登录成功')
        this.$router.push('home')
      })
    },
    // 验证码登录
    loginVerify() {
      this.$refs.verifyRuleForm.validate(async (valid) => {
        if (!valid) return this.$message.error('请填写完整内容')
        const { data: res } = await this.$axios.post('login-ver')
        if (res.meta.status !== 200)
          return this.$message.error('登录失败,请输入正确的手机号或密码')
        this.$message.success('登录成功')
        this.$router.push('home')
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  background-color: #f1f0f4;
  display: flex;
  justify-content: center;
  align-items: center;
}
img {
  position: absolute;
  // 按X轴移动118px,Y轴284px
  transform: translate(-118px, -284px);
}
.el-card {
  width: 400px;
  height: 520px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 5px 10px 15px #e3e2e6;
  box-sizing: border-box;
  padding: 40px;
}
.topcut {
  margin-bottom: 28px;
  font-size: 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
}
::v-deep .el-card__body {
  padding: 0;
}
::v-deep .el-col-7 {
  display: flex;
  justify-content: flex-start;
  cursor: pointer;
}
::v-deep .el-col-1 {
  display: flex;
  justify-content: flex-start;
  margin: 0 4px;
  opacity: 0.2;
}
::v-deep .el-col-16 {
  display: flex;
  justify-content: flex-start;
  cursor: pointer;
}
.resetpass {
  display: flex;
  justify-content: flex-start;
}
.el-form-item {
  margin-bottom: 28px;
}
.remember_forget {
  margin-top: 16px;
  margin-bottom: 45px;
}
::v-deep .el-tabs__nav-wrap::after {
  width: 0;
  height: 0;
}
::v-deep .el-tabs__item {
  padding: 0 5px;
  font-size: 20px;
}
::v-deep .el-tabs__item:hover {
  color: #303133;
}
::v-deep #tab-code {
  opacity: 0.4;
}
::v-deep #tab-separator {
  opacity: 0.2;
}
::v-deep .is-active {
  color: #303133;
}
::v-deep .el-input__inner {
  // border: 1px dotted solid double dashed #DCDFE6;
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-bottom: 1px solid #dcdfe6;
  border-radius: 0px;
  padding: 0;
}
::v-deep .el-form-item__label {
  font-weight: bold;
  color: #000;
  line-height: 26px;
}
::v-deep .el-tabs__header {
  margin: 0 0 25px;
}
// 登录按钮
.el-button {
  width: 100%;
  margin-top: 50px;
  font-size: 16px;
}
.left {
  text-align: left;
  font-size: 14px;
  display: flex;
  line-height: 20px;
}
.right {
  text-align: right;
  font-size: 14px;
  line-height: 20px;
}
// 获取验证码
.getcode {
  color: #2589ff;
  position: absolute;
  right: 0px;
  text-decoration: none;
}
</style>