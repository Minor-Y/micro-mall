<template>
  <div>
    <div class="tab">
      <el-tabs v-model="logActiveName">
        <el-tab-pane label="操作记录" name="first">
          <el-card>
            <div class="account-card">
              <!-- 左边 -->
              <span style="font-size: 14px; margin-right: 6px;">时间筛选: </span>
              <el-date-picker v-model="datePickerValue" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" size="mini" @change="logTime" value-format="timestamp">
              </el-date-picker>
              <el-button size="mini" type="primary" @click="searchLog">搜索</el-button>
              <!-- 右边 -->
            </div>
            <!-- 表格内容区 -->
            <div>
              <el-table :data="logDate" style="width: 100%">
                <el-table-column prop="operate_account" label="用户名" width="420"></el-table-column>
                <el-table-column prop="operate_module" label="操作模块" width="380"></el-table-column>
                <el-table-column prop="operate_time" label="操作时间">
                  <template slot-scope="scope">
                    {{scope.row.operate_time | transformTime}}
                  </template>
                </el-table-column>
                <el-table-column prop="operate_ip" label="IP"></el-table-column>
                <el-table-column prop="operate_content" label="操作内容"></el-table-column>
              </el-table>
            </div>
            <!-- 分页 -->
            <div class="pagination">
              <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="logQuery.pagenum" :page-sizes="[10, 20, 30, 40, 60]" :page-size="logQuery.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
              </el-pagination>
            </div>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import api from '../../../api/index'
export default {
  data() {
    return {
      logActiveName: 'first',
      logDate: [],
      logQuery: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      datePickerValue: '',
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            },
          },
        ],
      },
    }
  },
  created() {
    this.getProcessLog()
  },
  methods: {
    // 当前页展示数量回调
    handleSizeChange(size) {
      this.logQuery.pagesize = size
      this.getProcessLog()
    },
    // 当前页码回调
    handleCurrentChange(num) {
      this.logQuery.pagenum = num
      this.getProcessLog()
    },
    // 获取操作记录
    async getProcessLog() {
      const { data: res } = await this.$axios.get(
        `${api.localUrl}/getProcessLog`,
        {
          params: this.logQuery,
        }
      )
      if (res.status !== 200)
        return this.$message.error('获取操作日志失败，请刷新重试')
      this.logDate = res.data
      this.total = res.total
    },
    logTime(val) {
      if (val == null) {
        this.logQuery.query = ''
        this.getProcessLog()
      }
    },
    // 筛选操作记录
    searchLog() {
      this.logQuery.query = this.datePickerValue
      this.getProcessLog()
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
  align-items: center;
  margin-bottom: 18px;
  .el-button {
    margin-left: 18px;
  }
}
.pagination {
  margin-top: 16px;
  text-align: left;
}
</style>