<template>
  <el-container class="home-container">
    <el-aside :width="isCollapse ? '64px' : '160px'">
      <el-menu background-color="#333744" text-color="#fff" :collapse="isCollapse" :unique-opened="true" router :default-active="activePath" :collapse-transition="false">
        <span class="logo-img">
          <img src="@/assets/logoB.png" alt="">
          <h3 v-show="!isCollapse">MINOR</h3>
        </span>
        <!-- 概览--二级 -->
        <el-menu-item v-for="das in menuslist.filter((sub) => sub.path === '/dashboardover')" :key="das.id" :index="das.path" class="dashboard" router @click="saveDashboard(das)">
          <i :class="das.icon"></i>
          <span slot="title">{{das.name}}</span>
        </el-menu-item>
        <!-- 一级菜单 -->
        <el-submenu v-for="item in menuslist.filter((sub) => sub.path !== '/dashboardover')" :key="item.id" :index="item.id === 1 ? '/dashboardover' : item.id + ''">
          <!-- 一级菜单模板区域 -->
          <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title">{{item.name}}</span>
          </template>

          <!-- 二级菜单 -->
          <el-menu-item :index="item1.path" v-for="item1 in item.childs" :key="item1.id" @click="savePath(item1,item)">
            <template slot="title">
              <i :class="item1.icon"></i>
              <span slot="title">{{item1.name}}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- 头部区域 -->
      <el-header class="headersty">
        <el-row>
          <el-col :span="8" class="header-left">
            <span :class="[isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold', 'spreader']" @click="collapseOrSpread"></span>
            <!-- 导航条-面包屑 -->
            <el-breadcrumb separator="/">
              <el-breadcrumb-item>{{crumbss.name}}</el-breadcrumb-item>
              <el-breadcrumb-item v-if="crumbss.childs">{{crumbss.childs.name}}</el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :span="8" class="header-right">
            <el-dropdown size="small" @command="logout">
              <span class="el-dropdown-link">
                <el-avatar shape="circle" size="small" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                <b>{{userName}}</b>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-switch-button" command="out">退出后台</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>

      </el-header>
      <!-- 主体内容区域 -->
      <el-main>
        <el-tabs v-model="addTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="pitchTabs">
          <el-tab-pane v-for="tabs in addTabs" :key="tabs.name" :label="tabs.title" :name="tabs.name">
          </el-tab-pane>
          <router-view></router-view>
        </el-tabs>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import _ from 'lodash'
import axios from 'axios'
import api from '../../../api/index'
import { mapState, mapMutations, mapGetters } from 'vuex'
import Dash from '@/views/dashboardover/Dashboardover.vue'
export default {
  data() {
    return {
      transitionName: '',
      menuslist: [],
      isCollapse: false,
      elicon: {
        101: 'el-icon-data-analysis', //首页概览
        112: 'el-icon-goods', //商品
        113: 'el-icon-shopping-bag-2', //商品列表
        123: 'el-icon-document-remove', //订单
        124: 'el-icon-tickets', //订单列表
        134: 'el-icon-user', //客户
        135: 'el-icon-user-solid', //客户列表
        136: 'el-icon-collection-tag', //客户标签
        145: 'el-icon-data-line', //数据
        146: 'el-icon-pie-chart', //数据概览
        147: 'el-icon-c-scale-to-original', //客流分析
        156: 'el-icon-setting', //设置
        157: 'el-icon-s-home', //店铺信息
        158: 'el-icon-s-custom', //账号权限
        159: 'el-icon-document', //操作日志
      },
      activePath: '/dashboardover',
      addTabsValue: '/dashboardover',
      addTabs: [{ name: '/dashboardover', title: '概览' }],
      tabTitle: '',
      crumbss: {
        name: '概览',
        path: 'dashboardover',
        childs: {},
      },
      // 存放session面包屑
      sessionCrumbs: [
        { firstName: '概览', lastName: '', path: '/dashboardover' },
      ],
      userName: '',
    }
  },
  computed: {
    ...mapState(['userId', 'menuRouterList']),
    ...mapGetters(['getMenuRouter']),
  },
  created() {
    this.getMenusList()
    this.activePath = window.sessionStorage.getItem('activePath')
    // 初始时从sessionStorage里取出刷新页面前已存储的展示的tab页信息
    const sessionTab = JSON.parse(window.sessionStorage.getItem('addTabs'))
    if (sessionTab) {
      this.sessionCrumbs = sessionTab.crumbs
      if (
        sessionTab.addTabs.length !== 0 &&
        sessionTab.addTabsPath.length !== 0
      ) {
        // 循环保存tab标签页信息
        for (let i = 0; i < sessionTab.addTabs.length; i++) {
          this.addTabs.push({
            name: sessionTab.addTabs[i].name,
            title: sessionTab.addTabs[i].title,
          })
        }
        // 设置当前活动页path地址
        this.activePath = sessionTab.currActiveTabs
        this.addTabsValue = sessionTab.currActiveTabs
        this.$router.push({ path: this.addTabsValue })
      } else {
        this.activePath = '/dashboardover'
      }
    }
    // 取页面刷新前激活页path对应面包屑信息数组里path的元素下标
    let index = this.sessionCrumbs.findIndex((item) => {
      return this.addTabsValue === item.lastPath
    })
    // 将sessionStorage中保存的面包屑信息取出
    if (index > 0) {
      this.crumbss.name = this.sessionCrumbs[index].firstName
      this.crumbss.childs.name = this.sessionCrumbs[index].lastName
    } else {
      index = 0
      this.crumbss.name = this.sessionCrumbs[index].firstName
      this.crumbss.childs.name = this.sessionCrumbs[index].lastName
    }
  },
  methods: {
    ...mapMutations(['getUserId', 'setRouter', 'getMenuRouterList']),
    getMenusList() {
      this.getMenuRouterList()
      this.menuslist = this.menuRouterList
      this.userName = window.sessionStorage.getItem('username')
    },
    // 展开或者折叠侧边栏
    collapseOrSpread() {
      this.isCollapse = !this.isCollapse
    },
    saveDashboard(das) {
      this.addTabsValue = das.path
      window.sessionStorage.setItem('activePath', this.addTabsValue)
    },
    savePath(paths, crumbs) {
      // 面包屑跟随改变
      const crumbsInfo = _.cloneDeep(crumbs) // 深拷贝，避免后续修改操作影响menu
      // 根据当前对应点击的菜单,保存面包屑一二级信息
      this.crumbss.name = crumbsInfo.name
      this.crumbss.path = crumbsInfo.path
      this.crumbss.childs.name = paths.name
      // 将当前激活tab页的name(path地址)保存到sessionStorage里
      this.addTabsValue = paths.path
      window.sessionStorage.setItem('activePath', this.addTabsValue)
      this.activePath = paths.path
      //   存储需要生成的tabs的title信息
      this.tabTitle = paths.name
      // 存储面包屑所需信息
      let firstName = crumbs.name
      let lastName = paths.name
      let lastPath = paths.path
      // 不保存重复的路径名称
      for (let i = 0; i < this.sessionCrumbs.length; i++) {
        if (paths.name === this.sessionCrumbs[i].lastName) {
          lastName = ''
          break
        }
      }
      if (lastName === '') return

      this.sessionCrumbs.push({ firstName, lastName, lastPath })
    },
    // 选中tabs事件
    pitchTabs(pitch) {
      this.addTabsValue = pitch.name
      this.activePath = pitch.name
      window.sessionStorage.setItem('activePath', pitch.name)
      this.$router.push({ path: this.addTabsValue })

      let index = this.sessionCrumbs.findIndex((item) => {
        return item.lastName === pitch.label
      })
      if (index > 0) {
        this.crumbss.name = this.sessionCrumbs[index].firstName
        this.crumbss.childs.name = this.sessionCrumbs[index].lastName
      } else {
        index = 0
        this.crumbss.name = this.sessionCrumbs[index].firstName
        this.crumbss.childs.name = this.sessionCrumbs[index].lastName
      }
    },
    // 移除tabs
    removeTab(removes) {
      if (removes === '/home' || removes === '/dashboardover') return
      let tabs = this.addTabs
      let activeName = this.addTabsValue
      // 处理当前激活tab页移除事件
      if (activeName === removes) {
        tabs.forEach((tab, index) => {
          if (tab.name === removes) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }
      this.addTabsValue = activeName
      this.activePath = activeName
      //   处理移除其他tab页面，使用filter方法返回符合条件的所有元素的新数组
      this.addTabs = tabs.filter((tab) => tab.name !== removes)
      this.$router.push({ path: this.addTabsValue })
    },
    // 退出登录
    logout(command) {
      if (command === 'out') window.sessionStorage.clear()
      this.$router.push('/login')
      this.$message.success('退出登录成功')
    },
  },
  watch: {
    $route(to, from) {
      //设置一个变量flag，用来判断点击的menu对应的tab页面是否已打开
      var flag = false
      //遍历已打开tab的数组，判断点击的menu的tab是否已打开
      for (let i = 0; i < this.addTabs.length; i++) {
        if (to.path === this.addTabs[i].name) {
          //如果发现点击的menu对应tab已打开，那么激活该tab
          this.addTabsValue = this.addTabs[i].name
          //将变量flag设为true
          flag = true
          //跳出
          break
        }
      }
      // !flag取反为true，执行if语句
      if (!flag) {
        let name = to.path
        let title = this.tabTitle
        //将需要添加的tab信息push进tabs数组里
        this.addTabs.push({ name, title })
        //将点击的menu，对应的路由地址传给tabs
        this.addTabsValue = name
      }

      if (to.meta.index > from.meta.index) {
        this.transitionName = 'slide-left'
      } else {
        this.transitionName = 'slide-right'
      }
    },
  },
  mounted() {
    // 将已经打开tab页面信息存储到sessionStorage里
    window.addEventListener('beforeunload', (e) => {
      sessionStorage.setItem(
        'addTabs',
        JSON.stringify({
          addTabs: this.addTabs.filter((item) => item.name != '/dashboardover'),
          addTabsPath: this.addTabs.filter(
            (item) => item.name !== '/dashboardover'
          ),
          currActiveTabs: this.addTabsValue,
          crumbs: this.sessionCrumbs,
        })
      )
    })
  },
}
</script>

<style lang="less" scoped>
.home-container {
  margin: 0;
  padding: 0;
  height: 100%;
}
.el-menu {
  border-right: none;
}
.sidenav {
  width: 100%;
}
::v-deep .el-submenu__title {
  display: flex;
  align-items: center;
}
.logo-img {
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    height: 40px;
    margin: 0 4px 0 0;
  }
  h3 {
    color: #eee;
    font-size: 20px;
    padding: 0;
    margin: 0;
    // height: 40px;
  }
}
.dashboard {
  display: flex;
  align-items: center;
  i {
    transform: translateY(-2px);
  }
}
.el-aside {
  background-color: #323744;
}
.el-submenu [class^='el-icon-'] {
  transform: translateY(-2px);
}
.el-header {
  height: 50px !important;
  border-bottom: 1px solid #eee;
  padding: 0 10px;
}
.el-main {
  padding: 2px 6px 2px 6px;
  height: 100%;
  width: 100%;
  background: #fafafa;
}
.el-row {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .el-col {
    display: flex;
    align-items: center;
    height: 100%;
  }
}
.spreader {
  height: 100%;
  font-size: 18px;
  display: flex;
  align-items: center;
  padding: 0 12px 0 2px;
  cursor: pointer;
}
.el-breadcrumb {
  line-height: normal;
  display: flex;
  align-items: center;
}
.el-row::after,
.el-row::before {
  content: none;
}
::v-deep .el-avatar--small {
  width: 24px;
  height: 24px;
}
.header-right {
  justify-content: flex-end;
  .el-dropdown-link {
    display: flex;
    align-items: center;
    height: 49px;
    span {
      margin-right: 4px;
    }
    b {
      font-size: 15px;
    }
  }
}
::v-deep .el-tabs__header {
  margin: 0 0 5px;
}
::v-deep .el-tabs__nav {
  height: 33px;
  display: flex;
  align-items: center;
  margin-bottom: 3px;
  border-bottom: 1px solid #e4e7ed !important;
  border-radius: 4px !important;
  background: #ffffff;
  .is-active {
    border-bottom-color: #e4e7ed !important;
  }
  .el-tabs__item {
    font-size: 14px;
    font-weight: 400;
    line-height: normal;
    height: 33px;
    display: flex;
    align-items: center;
  }
}
::v-deep .el-submenu .el-menu-item {
  min-width: 160px;
}
</style>