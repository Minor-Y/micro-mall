<template>
  <div>
    <el-card>
      <div class="order-top">
        <el-select v-model="value" placeholder="请选择" size="small" @change="getType">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-input placeholder="请输入搜索关键词" v-model="orderQuery.query" size="small" clearable @clear="getOrderList">
        </el-input>
        <el-button type="primary" size="small" icon="el-icon-search" @click="getOrderList">搜索</el-button>
      </div>
      <!-- table区域 -->
      <el-table :data="orderList">
        <el-table-column prop="goodsName" label="商品名称"></el-table-column>
        <el-table-column prop="orderNum" label="订单号" width="240"></el-table-column>
        <el-table-column prop="price" label="售价"></el-table-column>
        <el-table-column prop="count" label="数量"></el-table-column>
        <el-table-column prop="memberName" label="客户姓名"></el-table-column>
        <el-table-column prop="amount" label="支付金额"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="showOrderDialog(scope.row)">详情</el-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="orderQuery.pagenum" :page-sizes="[10, 20, 30, 40, 60]" :page-size="orderQuery.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 订单详情弹出框 -->
    <MinorDialog :visibleFlag.sync="visibleFlag" :title="title" :width="width" 
    :cradWidthHeight="cradWidthHeight" :showCard="showCard" @clearActivities="clearActivities" 
    @clearConsumerInfo="clearConsumerInfo">
      <div slot="one" class="left-align">
        <p class="font-weight-500">订单信息</p>
        <el-divider></el-divider>
        <el-row>
          <el-col :span="24" class="margintop-16">
            <span>订单编号:</span>
            <span>{{orderDetails.orderNum}}</span>
          </el-col>
          <el-col :span="24" class="margintop-16">
            <span>实付金额:</span>
            <span>{{orderDetails.amount}}</span>
          </el-col>
          <el-col :span="24" class="margintop-16">
            <span>支付方式:</span>
            <span>{{orderDetails.Payment}}</span>
          </el-col>
          <el-col :span="24" class="margintop-16">
            <span>买家备注:</span>
            <span>{{orderDetails.buyersNote}}</span>
          </el-col>
          <el-col :span="24" class="margintop-16">
            <span>卖家备注:</span>
            <span>{{orderDetails.sellerNote}}</span>
          </el-col>
        </el-row>
      </div>
      <div slot="two" class="left-align">
        <p class="font-weight-500">订单状态: {{orderDetails.isPay === 1 ? '已支付' : '未支付'}}</p>
        <el-divider></el-divider>
        <el-timeline>
          <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.timestamp" :type="activity.type">
            {{activity.content}}
          </el-timeline-item>
        </el-timeline>
      </div>
      <div slot="three" class="left-align">
        <p class="font-weight-500">配送信息</p>
        <el-divider></el-divider>
        <el-row>
          <el-col :span="12" class="margintop-16">
            <span>收货地址:</span>
            <span>{{orderDetails.receiverAddress}}</span>
          </el-col>
          <el-col :span="12" class="padding-left-23 margintop-16">
            <span>运费:</span>
            <span>{{orderDetails.freight}}</span>
          </el-col>
          <el-col :span="12" class="margintop-16">
            <span>物流公司:</span>
            <span>{{orderDetails.logisticsCompany}}</span>
          </el-col>
          <el-col :span="12" class="padding-left-23 margintop-16">
            <span>物流单号:</span>
            <span>{{orderDetails.logisticsSingle}}</span>
          </el-col>
        </el-row>
      </div>
      <div slot="four" class="left-align">
        <p class="font-weight-500">消费信息</p>
        <el-divider></el-divider>
        <el-table :data="consumerInfo">
          <el-table-column prop="goodsName" label="商品"></el-table-column>
          <el-table-column prop="price" label="单价"></el-table-column>
          <el-table-column prop="count" label="数量"></el-table-column>
          <el-table-column prop="freight" label="运费"></el-table-column>
        </el-table>
        <el-row class="consumer-Info">
          <el-col class="margintop-16">
            <span>小计:</span>
            <span>{{orderDetails.amount}}</span>
          </el-col>
          <el-col class="margintop-16">
            <span>运费:</span>
            <span>{{orderDetails.freight}}</span>
          </el-col>
          <el-col class="margintop-16">
            <span>{{orderDetails.isPay === 1 ? '付款: ' + orderDetails.Payment : '待支付:'}}</span>
            <span>{{orderDetails.amount + orderDetails.freight}}</span>
          </el-col>
          <el-col class="margintop-16">
            <span>合计收款:</span>
            <span>{{orderDetails.amount + orderDetails.freight}}</span>
          </el-col>
        </el-row>
      </div>
    </MinorDialog>
  </div>
</template>

<script>
import api from '../../../api/index'
import MinorDialog from '../../components/M-Dialog.vue'
import { transformTime } from '../../filters/index'
export default {
  components: {
    MinorDialog: MinorDialog,
  },
  data() {
    return {
      orderQuery: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        value: 'goodsName',
      },
      orderList: [],
      options: [
        {
          value: 'memberName',
          label: '客户姓名',
        },
        {
          value: 'orderNum',
          label: '订单号',
        },
        {
          value: 'goodsName',
          label: '商品名',
        },
      ],
      value: 'goodsName',
      total: 0,
      visibleFlag: false,
      title: '订单详情',
      width: '70%',
      cradWidthHeight: 'width: 100%; height:260px',
      showCard: {
        one: true,
        two: true,
        three: true,
        four: true
      },
      orderDetails: [],
      activities: [],
      consumerInfo: [],
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取订单列表
    async getOrderList() {
      const { data: res } = await this.$axios.get(`${api.localUrl}/order`, {
        params: this.orderQuery,
      })
      if (res.status !== 200) return this.$message.error('获取订单列表失败，请刷新重试')
      this.orderList = res.data
      this.total = res.total
    },
    handleSizeChange(size) {
      this.orderQuery.pagesize = size
      this.getOrderList()
    },
    handleCurrentChange(curr) {
      this.orderQuery.pagenum = curr
      this.getOrderList()
    },
    getType(val) {
      this.orderQuery.value = val
    },
    showOrderDialog(details) {
      this.visibleFlag = true
      this.orderDetails = details
      this.consumerInfo.push(details)
      if (details.orderTime) {
        if (details.payTime) {
          this.activities.push(
            {
              content: '下单时间',
              timestamp: transformTime(details.orderTime),
            },
            {
              content: '支付时间',
              timestamp: transformTime(details.payTime),
              type: 'primary',
            }
          )
        } else {
          this.activities.push({
            content: '下单时间',
            timestamp: transformTime(details.orderTime),
            type: 'primary',
          })
        }
      }
    },
    // 在关闭对话框的时候清空数组信息
    clearActivities(arr) {
      this.activities = arr
    },
    clearConsumerInfo(ar) {
      this.consumerInfo = ar
    },
  },
}
</script>

<style lang="less" scoped>
.left-align {
  text-align: left;
}
.padding-left-23 {
  padding-left: 23px;
}
.margintop-16 {
  margin-top: 16px;
}
.font-weight-500 {
  font-weight: 500;
}

.order-top {
  display: flex;
  justify-content: flex-start;
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
::v-deep .el-table th.el-table__cell {
  background-color: #f5f6f8;
}
::v-deep .el-divider--horizontal {
  height: 2px;
  margin: 16px 0 2px 0;
}
.el-row {
  .el-col {
    display: flex;
    align-items: center;
    span {
      margin-right: 12px;
    }
  }
}
.el-timeline {
  padding: 0;
  margin: 18px 0 0 0;
}
.consumer-Info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .el-col {
    justify-content: space-between;
    width: 260px;
  }
}
</style>