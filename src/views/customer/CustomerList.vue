<template>
  <div>
    <el-card>
      <div class="order-top">
        <div>
          <el-select v-model="customerQuery.value" placeholder="请选择" size="small" @change="getType">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-input placeholder="请输入搜索关键词" v-model="customerQuery.query" size="small" clearable @clear="getCustomerList">
          </el-input>
          <el-button type="primary" size="small" icon="el-icon-search" @click="getCustomerList">搜索</el-button>
        </div>
        <el-button type="primary" size="small" @click="showAddCustomer">添加客户</el-button>
      </div>
      <!-- table区域 -->
      <el-table :data="customerList" @select="getSele">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="customerName" label="客户名称"></el-table-column>
        <el-table-column label="成为客户时间">
          <template slot-scope="scope">
            {{scope.row.becomeTime | transformTime}}
          </template>
        </el-table-column>
        <el-table-column label="最近消费时间">
          <template slot-scope="scope">
            {{scope.row.consumeTime | transformTime}}
          </template>
        </el-table-column>
        <el-table-column prop="customerBalance" label="客户余额"></el-table-column>
        <el-table-column prop="consumeNum" label="消费次数"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button class="button-w" type="primary" @click="showCustomerDialog(scope.row)" size="mini">详情</el-button>
            <el-popconfirm confirm-button-text='确认' cancel-button-text='取消' icon="el-icon-info" icon-color="red" title="确定删除该客户吗？" @confirm="removeCustomer(scope.row)">
              <el-button slot="reference" type="danger" size="mini">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="customerQuery.pagenum" :page-sizes="[10, 20, 30, 40, 60]" :page-size="customerQuery.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加客户dialog -->
    <MinorDialog :visibleFlag.sync="add.visibleFlagAdd" :title="add.title" :width="add.width" :cradWidthHeight="add.cradWidthHeight" :showCard="add.showCard">
      <el-form slot="four" :model="addQuery" label-width="84px" size="mini" class="add-form" :rules="rules" ref="ruleFormCustomer">
        <el-form-item label="姓名:" prop="customerName">
          <el-input v-model="addQuery.customerName"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="mobile">
          <el-input v-model="addQuery.mobile"></el-input>
        </el-form-item>
        <el-form-item label="客户来源:" prop="channel">
          <el-select v-model="addQuery.channel" placeholder="请选择客户来源">
            <el-option label="小红书" value="小红书"></el-option>
            <el-option label="微信" value="微信"></el-option>
            <el-option label="H5" value="H5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker v-model="addQuery.birthday" type="datetime" placeholder="选择日期时间" value-format="timestamp">
          </el-date-picker>
        </el-form-item>
        <div class="add-button">
          <el-button size="small" @click="closeDialog">取消</el-button>
          <el-button type="primary" size="small" @click="AddCustomer">确认</el-button>
        </div>
      </el-form>
    </MinorDialog>
    <!-- 显示客户详情dialog -->
    <MinorDialog :visibleFlag.sync="details.visibleFlag" :title="details.title" :width="details.width" :cradWidthHeight="details.cradWidthHeight" :showCard="details.showCard" @clearConsumerInfo="clearConsumerInfo">
      <div slot="three" class="details-top">
        <el-image :src="url"></el-image>
        <el-row>
          <el-col :span="8">昵称: {{customerDetails.customerName}}</el-col>
          <el-col :span="8">客户编号:{{customerDetails.customerId}}</el-col>
          <el-col :span="8">成为客户时间: {{customerDetails.becomeTime | transformTime}}</el-col>
          <el-col :span="8">客户渠道: {{customerDetails.channel}}</el-col>
          <el-col :span="24" class="add-tag">
            <el-input size="mini" v-model="tagInputValue" v-if="tagInputVisible" @keyup.enter.native="(event)=>event.target.blur()" @blur="handleInputConfirm" ref="tagInput"></el-input>
            <el-button size="mini" v-else @click="showTagInput">打标签</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="four" class="details-tags">
        <span>标签: </span>
        <el-tag v-for="(tag, index) in tags" :key="index" closable size="mini" effect="plain" @close="removeTag(tag)">
          {{tag}}
        </el-tag>
      </div>
    </MinorDialog>
  </div>
</template>

<script>
import MinorDialog from '../../components/M-Dialog.vue'
import api from '../../../api/index'
import _ from 'lodash'
import {saveProcesslog} from '../../plugins/processlog'
export default {
  components: {
    MinorDialog: MinorDialog,
  },
  data() {
    return {
      add: {
        visibleFlagAdd: false,
        title: '添加客户',
        width: '460px',
        cradWidthHeight: 'width: 100%;',
        showCard: {
          one: false,
          two: false,
          three: false,
          four: true,
        },
      },
      details: {
        visibleFlag: false,
        title: '客户详情',
        width: '70%',
        cradWidthHeight: 'width: 100%;',
        showCard: {
          one: false,
          two: false,
          three: true,
          four: true,
        },
      },
      options: [
        {
          value: 'mobile',
          label: '手机号',
        },
        {
          value: 'customerName',
          label: '客户名',
        },
      ],
      customerQuery: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        value: 'mobile',
      },
      customerList: [],
      total: 0,
      addQuery: {
        customerName: '',
        mobile: '',
        birthday: '',
        channel: '',
        becomeTime: '',
      },
      rules: {
        customerName: [
          { required: true, message: '请输入客户姓名', trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入客户手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入11位手机号', trigger: 'blur' },
        ],
        channel: [
          { required: true, message: '请选择客户来源', trigger: 'change' },
        ],
        birthday: [
          {
            type: 'date',
            required: true,
            message: '请选择客户生日',
            trigger: 'blur',
          },
        ],
      },
      url: 'https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83erS60B294sfRw7UGn7GKSnYkmUDhjO2BkVWrwDlicbpqgdwibC5DrSYLjechT03FzYC9cDBwiarDcQaw/132',
      customerDetails: [],
      tags: [],
      tagInputVisible: false,
      tagInputValue: '',
    }
  },

  created() {
    this.getCustomerList()
  },
  methods: {
    closeDialog() {
      this.add.visibleFlagAdd = false
      this.$refs.ruleFormCustomer.resetFields()
    },
    showDialog() {
      this.visibleFlag = true
    },
    getType(val) {
      this.customerQuery.value = val
    },
    // 获取客户列表
    async getCustomerList() {
      const { data: res } = await this.$axios.get(
        `${api.localUrl}/customerlist`,
        {
          params: this.customerQuery,
        }
      )
      if (res.status !== 200) return this.$message.error('请求失败,请刷新重试')
      this.customerList = res.data
      this.total = res.total
    },
    showCustomerDialog(customer) {
      this.details.visibleFlag = true
      this.customerDetails = customer
      if (customer.tag) {
        this.tags = customer.tag.split(',')
      } else {
        this.tags = []
      }
    },
    handleSizeChange(size) {
      this.customerQuery.pagesize = size
      this.getCustomerList()
    },
    handleCurrentChange(curr) {
      this.customerQuery.pagenum = curr
      this.getCustomerList()
    },
    getSele(val) {
    },
    // 显示添加客户对话框
    showAddCustomer() {
      this.add.visibleFlagAdd = true
    },
    // 添加客户
    AddCustomer() {
      this.$refs.ruleFormCustomer.validate(async (vaild) => {
        if (!vaild) return this.$message.error('请完善表单内容')
        let becomeTime = new Date().getTime()
        this.addQuery.becomeTime = becomeTime.toString().slice(0, 10)
        const { data: res } = await this.$axios.post(
          `${api.localUrl}/customerlist`,
          this.addQuery
        )
        if (res.status !== 200) return this.$message.error('添加失败')
        // 添加操作日志
        const addCModule = '客户列表'
        const addCContent = `添加了客户"${this.addQuery.customerName}"`
        saveProcesslog(addCModule, addCContent)
        this.$message.success('添加成功')
        this.add.visibleFlagAdd = false
        this.getCustomerList()
        // 清除表格填写内容
        this.$refs.ruleFormCustomer.resetFields()
      })
    },
    // 删除客户
    async removeCustomer(id) {
      const { data: res } = await this.$axios.delete(
        `${api.localUrl}/customerlist/${id.customerId}`
      )
      if (res.status !== 200) return this.$message.error('删除失败')
      const addCModule = '客户列表'
      const addCContent = `删除了客户"${id.customerName}"`
      saveProcesslog(addCModule, addCContent)
      this.getCustomerList()
    },
    clearConsumerInfo(val) {
      this.customerDetails = val
      this.tags = val
      this.getCustomerList()
    },
    // 显示tag添加输入框
    showTagInput() {
      this.tagInputVisible = true
      this.$nextTick(() => {
        this.$refs.tagInput.focus()
      })
    },
    async handleInputConfirm() {
      this.tagInputVisible = false
      if (this.tagInputValue === '' || this.tagInputValue === null) return
      let tagg = _.cloneDeep(this.tags)
      if (tagg === '' && tagg === null) {
        tagg = []
      }
      tagg.push(this.tagInputValue)
      tagg = tagg.toString()
      const { data: res } = await this.$axios.put(
        `${api.localUrl}/customerlist/${this.customerDetails.customerId}`,
        { tag: tagg }
      )
      if (res.status !== 200) return this.$message.error('添加tag失败，请重试')
      this.tags.push(this.tagInputValue)
      this.tagInputValue = ''
    },
    // 删除客户标签
    async removeTag(tag) {
      let tags = this.tags.filter((item) => {
        return item !== tag
      })
      tags = tags.toString()
      const { data: res } = await this.$axios.put(
        `${api.localUrl}/customerlist/${this.customerDetails.customerId}`,
        { tag: tags }
      )
      if (res.status !== 200) return this.$message.error('删除tag失败，请重试')
      this.tags = tags.split(',')
    },
  },
}
</script>

<style lang="less" scoped>
.order-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 18px;
  .el-select {
    width: 120px;
    margin-right: 8px;
  }
  .el-input {
    width: 284px;
    margin-right: 4px;
  }
}
.el-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-start;
}
.button-w {
  margin-right: 6px;
}
::v-deep .el-popconfirm__main {
  margin-bottom: 6px;
}
::v-deep .detail-top {
  margin-bottom: 0 !important;
}
.add-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  ::v-deep .el-input {
    width: 240px;
  }
  .add-button {
    margin-top: 10px;
  }
}
.details-top {
  display: flex;
  height: 120px;
  .el-row {
    width: 100%;
    margin-top: 10px;
    .add-tag {
      margin-top: 10px;
      .el-input {
        width: 68px;
      }
    }
    .el-button {
      color: #4a99ff;
      border: 1px solid #4a99ff;
    }
    .el-col {
      height: 30px;
      text-align: left;
    }
  }
}
.el-image {
  width: 120px;
  height: 120px;
  border-radius: 6px;
  margin-right: 20px;
  flex-shrink: 0; // 防止图片被后面元素的flex布局挤压
}

.details-tags {
  text-align: left;
}
.el-tag {
  margin: 0 5px 0 5px;
}
</style>