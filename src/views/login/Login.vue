<template>
  <div class="login">
    <div class="login-box">
      <div class="login_logo">
        <img src="@/assets/JBLOGO.png" alt="">
      </div>

      <el-card v-if="register === 'login'">
        <el-row class="topcut">
          <el-col :span="7" @click.native="showPassword">密码登录</el-col>
          <!-- <el-col :span="1">|</el-col>
          <el-col :span="16" @click.native="showVerify">验证码登录</el-col> -->
        </el-row>

        <!-- 密码登录区域 -->
        <el-form :model="passForm" v-if="register === 'login'" :key="1" :rules="passRules" ref="passRuleForm">
          <el-form-item label="账号" prop="username">
            <el-input v-model="passForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="登录密码" prop="password">
            <el-input v-model="passForm.password" placeholder="请输入密码" show-password></el-input>
          </el-form-item>
          <el-row class="remember_forget">
            <el-col :span="12" class="left">
              <!-- <el-checkbox label="记住我"></el-checkbox> -->
              <el-link :underline="false" target="_blank" @click="showRegister">注册</el-link>
            </el-col>
            <el-col :span="12" class="right">
              <el-link :underline="false" target="_blank" @click="showReset">忘记密码？</el-link>
            </el-col>
          </el-row>
          <el-button type="primary" @click="loginPassword">登录</el-button>
        </el-form>

        <!-- 验证码登录区域 -->
        <!-- <el-form :model="verifyForm" v-else-if="loginShow === 'verify'" :key="2" :rules="verifyRules" ref="verifyRuleForm">
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
        </el-form> -->
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
      <!-- 注册区 -->
      <el-card v-else-if="register === 'register'" class="change_height">
        <el-row class="topcut">
          <el-col :span="24" class="resetpass">注册</el-col>
        </el-row>
        <!-- 注册区 -->
        <el-form :model="registerPage" :rules="registerRules" :key="3">
          <!-- 注册区域 -->
          <el-form-item label="账户名" prop="regname">
            <el-input v-model="registerPage.regname" placeholder="请输入账户名"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="regmobile">
            <el-input v-model="registerPage.regmobile" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="regcode">
            <el-input v-model="registerPage.regcode" placeholder="请填写短信验证码"></el-input>
            <a href="" class="getcode">获取验证码</a>
          </el-form-item>
          <el-form-item label="设置密码" prop="regpassword">
            <el-input v-model="registerPage.regpassword" placeholder="6-12位必须包含数字和字母"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="24" class="left">
              <span>已有账号</span>
              <el-link :underline="false" type="primary" target="_blank" @click="showLogin">登录</el-link>
            </el-col>
          </el-row>
          <el-button type="primary">注册</el-button>
        </el-form>
      </el-card>
    </div>
    <p>Copyright © 2022-2022 www.minorhan.com <a href="https://beian.miit.gov.cn/" target="_blank">浙ICP备2022023097号-1</a></p>
  </div>
</template>

<script>
import axios from 'axios'
import api from '../../../api/index'
import { mapMutations, mapState } from 'vuex'
import { saveProcesslog } from '../../plugins/processlog'
export default {
  data() {
    return {
      resetPass: 'reset',
      passForm: {
        username: 'admin',
        password: '123456',
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
      registerPage: {
        regname: '',
        regmobile: '',
        regcode: '',
        regpassword: '',
      },
      loginShow: 'pass',
      register: 'login',
      passRules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
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
          {
            min: 6,
            max: 12,
            message: '请输入6 - 12位密码,包含数字和字母',
            trigger: 'blur',
          },
        ],
      },
      registerRules: {
        regname: [{ required: true, message: '请输入账号名', trigger: 'blur' }],
        regmobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入11位手机号', trigger: 'blur' },
        ],
        regcode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 6, max: 6, message: '请输入6位数字验证码', trigger: 'blur' },
        ],
        regpassword: [
          { required: true, message: '请输入需要设置的密码', trigger: 'blur' },
          {
            min: 6,
            max: 12,
            message: '请输入6 - 12位密码,包含数字和字母',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  computed: {
    ...mapState(['userId', 'menuRouterList']),
  },
  methods: {
    ...mapMutations(['setUserId', 'getUserId', 'setRouter']),
    showPassword() {
      this.loginShow = 'pass'
    },
    showRegister() {
      this.register = 'register'
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
        if (!valid) return this.$message.error('请检查账号密码是否填写正确')
        const { data: res } = await axios.post(
          `${api.localUrl}/login`,
          this.passForm
        )
        if (res.status !== 200)
          return this.$message.error('登录失败,请输入正确的账号或密码')
        // 保存token到session中
        window.sessionStorage.setItem(
          'token',
          `Bearer ${res.data.authorization}`
        )
        window.sessionStorage.setItem('username', res.data.username) //保存用户名到session
        window.sessionStorage.setItem('tokenStart', new Date().getTime())
        this.setUserId(res.data.userid) // 保存用户id到vuex中

        this.getUserId()
        const { data: ress } = await axios.get(`${api.localUrl}/menus`, {
          params: { userid: this.userId },
        })
        if (ress.status !== 200) return this.$message.error('获取菜单失败')
        // 保存登录操作
        const loginModule = '账号登录'
        const loginContent = `账号"${res.data.username}"登录了系统`
        saveProcesslog(loginModule, loginContent)
        this.setRouter(ress.data) // 保存用户角色权限到vuex中

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
  min-height: 802px;
  background-image: url(../../assets/blue.png);
  background-size: cover;
  .login-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    .login_logo {
      position: relative;
      width: 100%;
      display: flex;
      justify-content: center;
      top: 16%;
    }
  }
  p {
    height: 24px;
    margin-top: -32px;
    color: #ffffff;
    font-size: 12px;
    a {
      color: #ffffff;
      text-decoration: none;
    }
  }
}
.el-card {
  width: 400px;
  height: 520px;
  background-color: #fff;
  border-radius: 8px;
  position: relative;
  top: 16%;
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
.change_height {
  height: 626px;
}
</style>