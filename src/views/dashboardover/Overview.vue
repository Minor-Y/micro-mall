<template>
  <div>
    <!-- 时间筛选卡片 -->
    <el-card>
      <span>时间筛选:</span>
      <el-date-picker v-model="datePickerValue" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" size="mini" @change="selectTime">
      </el-date-picker>
    </el-card>
    <!-- 整体数据卡片 -->
    <el-card>
      <span class="blue_vertical"></span>
      <span>整体数据</span>
      <el-divider></el-divider>
      <div>
        <el-row>
          <el-col :span="4" v-for="overall in overallData" :key="overall.title" style="padding: 20px 10px;">
            <div class="overall">
              <p>{{overall.title}}</p>
              <p class="num">{{overall.num}}</p>
              <p>环比: <i :class="overall.icon" :style="overall.icon === 'el-icon-caret-top' ?  'color: #67c23a;' : 'color: #ed1515;'"></i></p>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- 趋势分析 -->
    <el-card>
      <span class="blue_vertical"></span>
      <span>趋势分析</span>
      <el-divider></el-divider>
      <div class="trend_chart" ref="trendChart"></div>
    </el-card>
    <!-- 客户 -->
    <el-card>
      <span class="blue_vertical"></span>
      <span>客户</span>
      <el-divider></el-divider>
      <div>
        <el-row>
          <el-col :span="12" v-for="client in clientData" :key="client.title" style="padding: 20px 10px;">
            <div class="overall">
              <p>{{client.title}}</p>
              <p class="num">{{client.num}}</p>
              <p>环比: <i :class="client.icon" :style="client.icon === 'el-icon-caret-top' ?  'color: #67c23a;' : 'color: #ed1515;'"></i></p>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 客户图表 -->
      <div class="client">
        <el-row :gutter="20">
          <el-col :span="12">
            <p>支付会员人数分布</p>
            <div class="client_chart" ref="clientChart1"></div>
          </el-col>
          <el-col :span="12">
            <p>支付方式分布</p>
            <div class="client_chart" ref="clientChart2"></div>
          </el-col>
          <el-col :span="12">
            <p>支付新老人数分布</p>
            <div class="client_chart" ref="clientChart3"></div>
          </el-col>
          <el-col :span="12">
            <p>支付新老应收金额分布</p>
            <div class="client_chart" ref="clientChart4"></div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
      //  整体数据
      overallData: [
        {
          title: '实收金额',
          num: 3200,
          icon: 'el-icon-caret-top',
        },
        {
          title: '浏览量',
          num: 40,
          icon: 'el-icon-caret-top',
        },
        {
          title: '访客量',
          num: 24,
          icon: 'el-icon-caret-bottom',
        },
        {
          title: '访问支付转化率',
          num: '120%',
          icon: 'el-icon-caret-top',
        },
        {
          title: '客单价',
          num: 200,
          icon: 'el-icon-caret-bottom',
        },
        {
          title: '支付单数',
          num: 60,
          icon: 'el-icon-caret-top',
        },
        {
          title: '支付人数',
          num: 23,
          icon: 'el-icon-caret-top',
        },
        {
          title: '新客支付',
          num: 1200,
          icon: 'el-icon-caret-bottom',
        },
        {
          title: '老客支付',
          num: 2000,
          icon: 'el-icon-caret-top',
        },
        {
          title: '新增客户',
          num: 20,
          icon: 'el-icon-caret-top',
        },
        {
          title: '新客成交数',
          num: 3,
          icon: 'el-icon-caret-bottom',
        },
        {
          title: '老客成交数',
          num: 12,
          icon: 'el-icon-caret-top',
        },
      ],
      //  趋势分析数据
      trendData: [
        '2022-06-01',
        '2022-06-02',
        '2022-06-03',
        '2022-06-04',
        '2022-06-05',
        '2022-06-06',
        '2022-06-07',
        '2022-06-08',
      ],
      trendNumData: [600, 400, 320, 600, 1230, 2160, 1150, 2000],
      trendEchart: {},
      clientEchartOne: {},
      clientEchartTwo: {},
      clientEchartThree: {},
      clientEchartFour: {},
      //  客户数据
      clientData: [
        {
          title: '新增客户数',
          num: 32,
          icon: 'el-icon-caret-top',
        },
        {
          title: '新增会员数',
          num: 5,
          icon: 'el-icon-caret-top',
        },
      ],
    }
  },
  methods: {
    // 趋势分析图表
    showTend() {
      this.trendEchart = this.$echarts.init(this.$refs.trendChart)
      const colors = ['#3388ff']
      this.trendEchart.setOption({
        // tooltip用来控制是否显示提示框，以及坐标线
        tooltip: {
          trigger: 'axis', // axis为轴线方式显示提示
          axisPointer: {
            type: 'cross',
            lineStyle: {
              // 设置线条样式为实线
              width: 1,
              type: 'solid',
            },
          },
        },
        color: colors,
        grid: {
          left: '5%',
          right: '5%',
          top: '14%',
          bottom: '10%',
        },
        xAxis: {
          type: 'category',
          data: this.trendData,
          boundaryGap: false,
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
            },
          },
        },
        series: [
          {
            data: this.trendNumData,
            name: '实收金额',
            type: 'line',
            smooth: true,
            showSymbol: false,
            lineStyle: {
              color: '#4aa9e5',
            },
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(51, 136, 255,0.8)',
                },
                {
                  offset: 1,
                  color: 'rgba(51, 136, 255,0.3)',
                },
              ]),
            },
          },
        ],
      })
    },
    selectTime(val) {
      console.log(val)
    },
    // 客户图表
    showClient() {
      //  支付会员人数图表
      this.clientEchartOne = this.$echarts.init(this.$refs.clientChart1)
      this.clientEchartOne.setOption({
        tooltip: {
          trigger: 'item',
        },
        legend: {
          right: '2%',
          bottom: '2%',
          orient: 'vertical',
          textStyle: {
            color: '#8a93a7',
          },
        },
        series: [
          {
            name: '支付会员数',
            type: 'pie',
            radius: ['60%', '90%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'outside',
              color: '#8a93a7',
            },
            labelLine: {
              show: true,
              length: 12,
              length2: 15,
              smooth: 0.5,
            },
            data: [
              { value: 10, name: '支付会员数' },
              { value: 15, name: '支付非会员数' },
            ],
          },
        ],
      })
      //  支付方式分布图表
      this.clientEchartTwo = this.$echarts.init(this.$refs.clientChart2)
      this.clientEchartTwo.setOption({
        tooltip: {
          trigger: 'item',
        },
        legend: {
          right: '2%',
          bottom: '2%',
          orient: 'vertical',
          textStyle: {
            color: '#8a93a7',
          },
        },
        series: [
          {
            name: '支付方式分布',
            type: 'pie',
            radius: ['60%', '90%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'outside',
              color: '#8a93a7',
            },
            labelLine: {
              show: true,
              length: 12,
              length2: 15,
              smooth: 0.5,
            },
            data: [
              { value: 1012, name: '支付宝' },
              { value: 1523, name: '微信' },
              { value: 659, name: '现金' },
            ],
          },
        ],
      })
      //  支付新老人数分布图表
      this.clientEchartThree = this.$echarts.init(this.$refs.clientChart3)
      this.clientEchartThree.setOption({
        tooltip: {
          trigger: 'item',
        },
        legend: {
          right: '2%',
          bottom: '2%',
          orient: 'vertical',
          textStyle: {
            color: '#8a93a7',
          },
        },
        series: [
          {
            name: '支付新老人数',
            type: 'pie',
            radius: ['60%', '90%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'outside',
              color: '#8a93a7',
            },
            labelLine: {
              show: true,
              length: 12,
              length2: 15,
              smooth: 0.5,
            },
            data: [
              { value: 23, name: '复购客户数' },
              { value: 12, name: '首购客户数' },
            ],
          },
        ],
      })
      //  支付新老应收金额分布图表
      this.clientEchartFour = this.$echarts.init(this.$refs.clientChart4)
      this.clientEchartFour.setOption({
        tooltip: {
          trigger: 'item',
        },
        legend: {
          right: '2%',
          bottom: '2%',
          orient: 'vertical',
          textStyle: {
            color: '#8a93a7',
          },
        },
        series: [
          {
            name: '支付新老应收金额',
            type: 'pie',
            radius: ['60%', '90%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'outside',
              color: '#8a93a7',
            },
            labelLine: {
              show: true,
              length: 12,
              length2: 15,
              smooth: 0.5,
            },
            data: [
              { value: 2300, name: '复购应收金额' },
              { value: 1523, name: '首购应收金额' },
            ],
          },
        ],
      })
    },
  },
  mounted() {
    this.showTend()
    this.showClient()
    // 监听resize，当浏览器窗口高度宽度发生变化时触发图表宽高随之改变
    window.addEventListener('resize', () => {
      this.trendEchart.resize()
      this.clientEchartOne.resize()
      this.clientEchartTwo.resize()
      this.clientEchartThree.resize()
      this.clientEchartFour.resize()
    })
  },
}
</script>

<style lang="less" scoped>
// 蓝色竖线
.blue_vertical {
  border-right: 3px solid;
  border-color: #409eff;
  height: 20px;
}
.el-card {
  text-align: left;
  margin-bottom: 10px;
  box-shadow: none;
  span {
    margin-right: 6px;
    font-size: 14px;
    font-weight: bold;
  }
}
.el-divider--horizontal {
  margin: 12px 0 6px 0;
}
.overall {
  font-size: 12px;
  color: #8a93a7;
  .num {
    font-size: 16px;
    color: #000;
    margin: 16px 0;
    font-weight: bold;
  }
}
.trend_chart {
  height: 370px;
  width: 100%;
}
.client_chart {
  height: 260px;
  width: 100%;
}
.client {
  margin-top: 16px;
  p {
    font-size: 13px;
    height: 50px;
    display: flex;
    align-items: center;
    border-top: 1px solid #e5e9f2;
  }
}
</style>