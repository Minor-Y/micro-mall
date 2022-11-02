<template>
  <div>
    <div class="tab">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="账号管理" name="first">
          <el-card>
            <div class="account-card">
              <!-- 左边 -->
              <div>
                <el-button type="primary" size="mini" class="margin-r-10" @click="showAddAccount">添加账号</el-button>
                <el-select v-model="accountQuery.value" placeholder="请选择" size="mini">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <!-- 右边 -->
              <div class="right">
                <el-input placeholder="请输入搜索内容" v-model="searchValue" class="input-with-select" size="mini">
                  <el-select v-model="searchSelect" slot="prepend" placeholder="请选择" size="mini">
                    <el-option label="手机号" value="1"></el-option>
                    <el-option label="用户名" value="2"></el-option>
                  </el-select>
                  <el-button slot="append" icon="el-icon-search" size="mini"></el-button>
                </el-input>
              </div>
            </div>
            <!-- 表格内容区 -->
            <div>
              <el-table :data="accountDate" style="width: 100%">
                <el-table-column prop="username" label="用户名" width="180"></el-table-column>
                <el-table-column prop="role" label="角色" width="180"></el-table-column>
                <el-table-column prop="mobile" label="手机号"></el-table-column>
                <el-table-column label="性别">
                  <template slot-scope="scope">
                    <el-tag :type="scope.row.sex === '男' ? '' : 'danger'">{{scope.row.sex}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="状态">
                  <template slot-scope="scope">
                    <div class="status">
                      <span class="status_circle" :style="{'background-color': scope.row.status === 1 ? '#52c41a' : '#c5c5c5'}"></span>
                      <span>{{scope.row.status === 1 ? '开启' : '关闭'}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="创建时间">
                  <template slot-scope="scope">
                    {{scope.row.createtime | transformTime}}
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="primary" @click="showAccountEdit(scope.row)" size="mini" style="margin-right: 10px;">编辑</el-button>
                    <el-popconfirm confirm-button-text='确认' cancel-button-text='取消' icon="el-icon-info" icon-color="red" title="确定删除该账号吗？不可恢复！！" @confirm="removeAccount(scope.row)">
                      <el-button slot="reference" type="danger" size="mini">删除</el-button>
                    </el-popconfirm>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 分页 -->
            <div class="pagination">
              <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="accountQuery.pagenum" :page-sizes="[10, 20, 30, 40, 60]" :page-size="accountQuery.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
              </el-pagination>
            </div>
          </el-card>
        </el-tab-pane>
        <!-- 角色管理页 -->
        <el-tab-pane label="角色管理" name="second">
          <el-card>
            <div class="add_role">
              <el-button size="mini" type="primary" @click="addRole">添加角色</el-button>
            </div>
            <!-- 角色列表展示 -->
            <div>
              <el-table :data="roleData" style="width: 100%">
                <el-table-column label="角色名" prop="rolename"></el-table-column>
                <el-table-column label="使用账号数量" prop="accRoleNum"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" style="margin-right: 10px;" @click="showDrawer(scope.row)">编辑</el-button>
                    <el-popconfirm confirm-button-text='确认' cancel-button-text='取消' icon="el-icon-info" icon-color="red" title="确定删除该角色吗？不可恢复！！">
                      <el-button slot="reference" type="danger" size="mini">删除</el-button>
                    </el-popconfirm>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 角色管理编辑抽屉 -->
    <MinorDrawer :drawerFlagD.sync="roleEditList.drawer" :size="roleEditList.size" :title="roleEditList.title">
      <div slot="contents">
        <el-form ref="roleForm" :model="rolePermission" label-width="80px">
          <el-form-item label="角色名称">
            <el-input v-model="rolePermission.roleName"></el-input>
          </el-form-item>
          <el-form-item label="添加权限">
            <el-tree :data="rolePermissionList" ref="roleRef" :props="roleProps" node-key="id" show-checkbox @check-change="handleCheckChange">
            </el-tree>
          </el-form-item>
        </el-form>
      </div>
      <div slot="button">
        <el-button size="mini" @click="closeDrawer">取消</el-button>
        <el-button type="primary" size="mini" @click="commitRoleEdit">确定</el-button>
      </div>
    </MinorDrawer>
    <!-- 角色添加抽屉 -->
    <MinorDrawer :drawerFlagD.sync="addEditList.drawer" :size="addEditList.size" :title="addEditList.title">
      <div slot="contents">
        <el-form ref="roleForm" :model="addRolePermission" label-width="80px">
          <el-form-item label="角色名称">
            <el-input v-model="addRolePermission.roleName"></el-input>
          </el-form-item>
          <el-form-item label="添加权限">
            <el-tree :data="rolePermissionList" ref="addRoleRef" :props="roleProps" node-key="id" show-checkbox @check-change="addRoleChange">
            </el-tree>
          </el-form-item>
        </el-form>
      </div>
      <div slot="button">
        <el-button size="mini" @click="closeDrawer">取消</el-button>
        <el-button type="primary" size="mini" @click="addRoles">确定</el-button>
      </div>
    </MinorDrawer>
    <!-- 账号编辑抽屉 -->
    <el-drawer title="账号编辑" :visible.sync="drawer" :before-close="drawerClose" size="560px">
      <div class="editInfoHeader">
        <el-avatar shape="square" :size="64" :src="editData.avatar_url"></el-avatar>
        <div class="userid">
          <span>用户 ID: {{editData.userid}}</span>
          <span>创建时间: {{editData.createtime | transformTime}}</span>
        </div>
      </div>
      <div class="editContent">
        <el-form ref="form" :model="editData" label-width="80px" class="editForm">
          <el-row>
            <el-col :span="12">
              <el-form-item label="用户名:">
                <el-input v-model="editData.username" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号:">
                <el-input v-model="editData.mobile" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="性别:">
                <el-select v-model="editData.sex" placeholder="请选择性别" size="small">
                  <el-option label="男" value="男"></el-option>
                  <el-option label="女" value="女"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态:">
                <el-select v-model="editData.status" placeholder="请选择状态" size="small">
                  <el-option label="开启" value="开启"></el-option>
                  <el-option label="禁用" value="禁用"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="角色:">
                <el-select v-model="editData.role" placeholder="请选择角色" size="small">
                  <el-option v-for="role in roleData" :key="role.id" :label="role.rolename" :value="role.rolename"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="个人简介:">
                <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="editData.introduction">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 提交按钮 -->
        <div class="editButton">
          <el-button size="small" @click="closeEdit">取消</el-button>
          <el-button type="primary" @click="commitEdit" size="small">提交</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 账号添加抽屉 -->
    <el-drawer title="添加账号" :visible.sync="addDrawer" :before-close="addDrawerClose" size="560px">
      <div class="editContent" style="margin-top: 14px;">
        <el-form ref="form" :model="addData" label-width="80px" class="editForm">
          <el-row>
            <el-col :span="12">
              <el-form-item label="用户名:">
                <el-input v-model="addData.username" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号:">
                <el-input v-model="addData.mobile" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="性别:">
                <el-select v-model="addData.sex" placeholder="请选择性别" size="small">
                  <el-option label="男" value="男"></el-option>
                  <el-option label="女" value="女"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态:">
                <el-select v-model="addData.status" placeholder="请选择状态" size="small">
                  <el-option label="开启" value="开启"></el-option>
                  <el-option label="禁用" value="禁用"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="角色:">
                <el-select v-model="addData.role" placeholder="请选择角色" size="small">
                  <el-option v-for="role in roleData" :key="role.id" :label="role.rolename" :value="role.rolename"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="个人简介:">
                <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="addData.introduction">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 提交按钮 -->
        <div class="editButton">
          <el-button size="small" @click="addDrawerClose">取消</el-button>
          <el-button type="primary" @click="commitAddAccount" size="small">提交</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import api from '../../../api/index'
import _ from 'lodash'
import MinorDrawer from '../../components/M-Drawer.vue'
import { saveProcesslog } from '../../plugins/processlog'
export default {
  data() {
    return {
      activeName: 'first',
      searchValue: '',
      searchSelect: '1',
      options: [],
      accountQuery: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        value: '全部角色',
      },
      accountDate: [],
      total: 0,
      drawer: false,
      addDrawer: false,
      addData: {
        // 存放添加账号的信息
        mobile: '',
        role: '',
        sex: '',
        status: '',
        username: '',
        introduction: '',
      },
      editData: [],
      roleData: [],
      roleEditList: {
        // 角色编辑抽屉设置项
        drawer: false,
        size: '560px',
        title: '角色编辑',
      },
      addEditList: {
        // 添加角色抽屉设置项
        drawer: false,
        size: '560px',
        title: '角色添加',
      },
      rolePermission: {
        id: '',
        beforRoleName: '',
        roleName: '',
        roleKeys: [],
      },
      addRolePermission: {
        roleName: '',
        roleKeys: [],
      },
      rolePermissionList: [],
      roleProps: {
        children: 'childs',
        label: 'name',
      },
      processlogList: {  // 操作日志信息
        operate_account: '',
        operate_module: '',
        operate_time: '',
        operate_ip: '',
        operate_content: '',
      },
    }
  },
  components: {
    MinorDrawer: MinorDrawer,
  },
  created() {
    this.getAccountList()
    this.getMenuList()
    this.getRoleList()
  },
  methods: {
    handleClick(e) {
    },
    handleSizeChange(size) {
      this.accountQuery.pagesize = size
      this.getAccountList()
    },
    handleCurrentChange(num) {
      this.accountQuery.pagenum = num
      this.getAccountList()
    },
    // 获取账号列表
    async getAccountList() {
      const { data: res } = await this.$axios.get(`${api.localUrl}/accounts`, {
        params: this.accountQuery,
      })
      if (res.status !== 200)
        return this.$message.error('获取账号列表失败，请刷新重试')
      this.accountDate = res.data
      this.total = res.total
      let userId = window.sessionStorage.getItem('userid')
    },
    // 获取菜单项
    async getMenuList() {
      const result = await this.$axios.get(`${api.localUrl}/menus`)
      this.rolePermissionList = result.data.data
    },
    // 获取角色列表
    async getRoleList() {
      const { data: res } = await this.$axios.get(`${api.localUrl}/role`)
      if (res.status !== 200)
        return this.$message.error('获取角色列表失败，请刷新重试')
      this.roleData = res.data
      res.data.forEach((item) => {
        this.options.push({
          value: item.id,
          label: item.rolename,
        })
      })
    },
    // 显示抽屉
    async showAccountEdit(acc) {
      this.editData = _.cloneDeep(acc)
      if (this.editData.status === 1) {
        this.editData.status = '开启'
      } else {
        this.editData.status = '禁用'
      }
      const { data: res } = await this.$axios.get(`${api.localUrl}/role`)
      if (res.status !== 200)
        return this.$message.error('获取角色列表失败，请刷新重试')
      this.roleData = res.data
      this.drawer = true
    },
    // 抽屉关闭前的动作
    drawerClose() {
      this.drawer = false
    },
    // 提交账号编辑
    async commitEdit() {
      const res = await this.$axios.put(
        `${api.localUrl}/accounts/${this.editData.userid}`,
        {
          mobile: this.editData.mobile,
          role: this.editData.role,
          sex: this.editData.sex,
          status: this.editData.status,
          username: this.editData.username,
          introduction: this.editData.introduction,
        }
      )
      if (res.status !== 200)
        return this.$message.error('更改账号状态失败，请刷新重试')
      // 保存操作记录
      const accModule = '账号管理'
      const accContent = `修改了用户"${this.editData.username}"的账号信息`
      saveProcesslog(accModule, accContent)
      this.drawer = false
      this.getAccountList()
    },
    // 关闭抽屉
    closeEdit() {
      this.drawer = false
    },
    // 打开添加角色抽屉
    addRole() {
      this.getMenuList()
      this.addEditList.drawer = true
    },
    // 打开添加账号抽屉
    showAddAccount() {
      this.addDrawer = true
    },
    // 添加账号抽屉关闭前的动作
    addDrawerClose() {
      this.addDrawer = false
      this.addData = {}
    },
    // 提交添加账号请求
    async commitAddAccount() {
      const res = await this.$axios.post(
        `${api.localUrl}/accounts`,
        {
          mobile: this.addData.mobile,
          role: this.addData.role,
          sex: this.addData.sex,
          status: this.addData.status,
          username: this.addData.username,
          introduction: this.addData.introduction,
        }
      )
      if (res.status !== 200)
        return this.$message.error('添加账号失败，请刷新重试')
      const addModule = '账号管理'
      const addContent = `添加了账号"${this.addData.username}"`
      saveProcesslog(addModule, addContent)
      this.addDrawer = false
      this.getAccountList()
    },
    // 删除账号
    async removeAccount(id) {
      const {data: res} = await this.$axios.delete(`${api.localUrl}/accounts/${id.userid}`)
      if(res.status !== 200) this.$message.error('删除账号失败，请刷新重试')
      const reModule = '账号管理'
      const reContent = `删除了账号"${id.username}"`
      saveProcesslog(reModule, reContent)
      this.getAccountList()
    },
    showDrawer(re) {
      // 角色管理-打开抽屉
      this.roleEditList.drawer = true
      this.rolePermission.id = re.id
      this.rolePermission.roleName = re.rolename
      this.rolePermission.beforRoleName = re.rolename

      this.$nextTick(() => {
        this.$refs.roleRef.setCheckedKeys(re.menus.split(','))
      })
    },
    closeDrawer() {
      // 角色管理-关闭抽屉
      this.roleEditList.drawer = false
    },
    // 角色节点选中状态发生变化时的回调
    handleCheckChange(a, b, c) {
      this.rolePermission.roleKeys = this.$refs.roleRef.getCheckedKeys(true)
    },
    addRoleChange() {
      this.addRolePermission.roleKeys =
        this.$refs.addRoleRef.getCheckedKeys(true)
    },
    // 提交角色权限编辑
    async commitRoleEdit() {
      const { data: res } = await this.$axios.put(`${api.localUrl}/role`, {
        id: this.rolePermission.id,
        roleName: this.rolePermission.roleName,
        roleKeys: this.rolePermission.roleKeys,
        beforRoleName: this.rolePermission.beforRoleName,
      })
      if (res.status !== 201)
        return this.$message.error('更改角色失败，请刷新重试')
      const roleModule = '角色管理'
      const roleContent = `修改了角色"${this.rolePermission.roleName}"的权限`
      saveProcesslog(roleModule, roleContent)
      this.roleEditList.drawer = false
      this.getRoleList()
      this.$message.success('更改角色权限成功')
    },
    // 添加角色
    async addRoles() {
      const { data: res } = await this.$axios.post(`${api.localUrl}/role`, {
        roleName: this.addRolePermission.roleName,
        roleKeys: this.addRolePermission.roleKeys,
      })
      if (res.status !== 200)
        return this.$message.error('更改角色失败，请刷新重试')
      const addRoleModule = '角色管理'
      const addRoleContent = `添加了角色"${this.addRolePermission.roleName}"`
      saveProcesslog(addRoleModule, addRoleContent)
      this.addEditList.drawer = false
      this.addRolePermission.roleName = ''
      this.addRolePermission.roleKeys = []
      this.getRoleList()
      this.$message.success('添加角色成功')
    },
  },
}
</script>

<style lang="less" scoped>
.margin-r-10 {
  margin-right: 10px;
}
.tab {
  ::v-deep .el-tabs__item {
    padding: 0;
    width: 66px;
    display: flex;
    justify-content: center;
  }
  ::v-deep .el-card__body {
  }
  .right {
    .el-select {
      width: 90px;
    }
  }
}
.account-card {
  display: flex;
  justify-content: space-between;
  margin-bottom: 18px;
}
.pagination {
  margin-top: 16px;
  text-align: left;
}

::v-deep .el-drawer__header {
  margin-bottom: 0;
  padding: 20px 20px;
  border-bottom: 1px solid #e8eaec;
}
::v-deep .el-drawer__body {
  // padding: 0 20px;
}
.editInfoHeader {
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #e8eaec;
  padding: 20px 0;
  margin-bottom: 20px;
  .userid {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    margin-left: 80px;
    font-size: 14px;
  }
}
.el-form-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 20px;
  ::v-deep .el-form-item__content {
    margin-left: 0 !important;
    width: 100%;
  }
  ::v-deep .el-form-item__label {
    text-align: left;
    line-height: 24px;
  }
  .el-select {
    width: 100%;
  }
  ::v-deep .el-input__inner {
    padding: 0 6px;
  }
  ::v-deep .el-textarea__inner {
    padding: 5px 6px;
  }
}
.status {
  display: flex;
  align-items: center;
  .status_circle {
    width: 6px;
    height: 6px;
    display: inline-block;
    border-radius: 20px;
    margin-right: 4px;
  }
}
.editContent {
  display: flex;
  flex-direction: column;
  height: calc(100% - 126px);
  .editForm {
    flex: 1;
    padding-bottom: 62px;
  }
  .editButton {
    position: absolute;
    width: 100%;
    bottom: 0;
    border-top: 1px solid #e8e8e8;
    text-align: right;
    padding: 10px;
    box-sizing: border-box;
    background-color: #fff;
  }
}

.add_role {
  text-align: left;
  margin-bottom: 18px;
}
</style>