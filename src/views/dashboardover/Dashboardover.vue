<template>
  <div>
    <el-row>
      <el-col class="dash-left">
        <!-- 欢迎和天气卡片 -->

        <el-card shadow="never" class="dash-hello">
          <el-skeleton :loading="loading" :rows="4" animated />
          <el-col class="dash-welcome">
            <span>{{isHour}},欢迎~</span>
          </el-col>
          <el-col class="dash-weather">
            <el-col class="dash-icon">
              <el-avatar shape="circle" size="large" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            </el-col>
            <el-col class="dash-weather-info">
              <h1>开始您一天的工作吧！</h1>
              <span>今日{{weatherIn.text}}, {{sportText}}</span>
            </el-col>
          </el-col>
        </el-card>
        <!-- 常用功能 -->
        <el-card class="common-fun">
          <ul>
            <li v-for="(common, index) in commonFun" :key="index">
              <p><i :class="common.icon" :style="{color: common.color}"></i></p>
              <p>{{common.title}}</p>
            </li>
          </ul>
        </el-card>
      </el-col>
      <el-col class="dash-right">
        <!-- 公告卡片 -->
        <el-card shadow="never" class="dash-notice">
          <el-col class="notice-title">
            公告
            <a href="">更多</a>
          </el-col>
          <el-col class="notice-content">
            <ul>
              <li v-for="(item,index) in notice" :key="index">
                <a href="">{{item.title}}
                  <span>{{item.date}}</span>
                </a>
              </li>
            </ul>
          </el-col>
        </el-card>
      </el-col>
    </el-row>
    <!-- 实时数据区域 -->
    <el-card class="realdata">
      <span class="title_bold">实时数据<a>数据更新于:{{nowDate}}</a></span>
      <ul>
        <li v-for="(real,index) in realDate" :key="index">
          <p>
            <i :class="[real.icon, 'iconfont']"></i>
          </p>
          <p class="realdata-right">
            <span class="realdata-num">{{real.num}}</span>
            <span>{{real.title}}</span>
          </p>
        </li>
      </ul>
    </el-card>
    <!-- 图表 -->
    <div class="chart">
      <el-card class="target_schedule">
        <span class="title_bold">交易数据</span>
        <div class="schedule_loop">
          <el-progress class="circle2" type="circle" :percentage="percentages" :stroke-width="12" :show-text="false"></el-progress>
          <div class="schedule_text">
            <div>{{percentages}}%</div>
            <span>线上成单</span>
          </div>
        </div>
        <!-- 分割线 -->
        <el-divider></el-divider>
        <div class="schedule_data">
          <div class="schedule_text1">
            <div>{{percentages}}%</div>
            <span>线下成单</span>
          </div>
          <div class="schedule_text1">
            <div>{{percentages}}%</div>
            <span>其他</span>
          </div>
        </div>
        <div class="schedule_bottom">
          <div class="schedule_bottom_list" v-for="deal in dealData" :key="deal.title">
            <p class="list_icon"><i :class="deal.icon"></i></p>
            <p class="num">{{deal.num}}</p>
            <p class="text">{{deal.title}}</p>
          </div>
        </div>
      </el-card>
      <!-- 数据曲线图 -->
      <el-card class="tend-chart">
        <span class="title_bold">实收金额趋势图</span>
        <div class="tend-map" ref="chart"></div>
      </el-card>
    </div>
    <!-- 自定义svg数据进度圆环 -->
    <svg width="100%" height="100%">
      <defs>
        <linearGradient id="write" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#0299E2" stop-opacity="0.8"></stop>
          <stop offset="100%" style="stop-color:#02E4DC" stop-opacity="1"></stop>
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>

<script>
import api from '../../../api/index'
export default {
  data() {
    return {
      pparams: {
        location: '',
        key: 'b039d29332b3477c84c6131e424510ec',
      },
      weatherIn: [],
      isHour: '',
      sportText: '',
      notice: [
        {
          title: '服务费lacdsqq"限免公告",请关注！！哈哈哈',
          date: '7/01',
        },
        {
          title: '团购活动多重升级ddd,全力嘎嘎嘎支持抗疫',
          date: '7/06',
        },
        {
          title: '小程序链接生成与使用规则调整公告',
          date: '7/21',
        },
        {
          title: '6.18活动工具订单,免费使用6个月起~~',
          date: '8/01',
        },
        {
          title: '新增多人拼团功能,助力营销提升LO哦咯',
          date: '8/05',
        },
        {
          title: '新增多人拼团功能,助力营销提升desh达达',
          date: '8/05',
        },
      ],
      commonFun: [
        {
          title: '商品',
          icon: 'el-icon-goods',
          color: '#2376B7',
        },
        {
          title: '订单',
          icon: 'el-icon-document-remove',
          color: '#1BA784',
        },
        {
          title: '客户',
          icon: 'el-icon-user',
          color: '#FFD111',
        },
        {
          title: '数据',
          icon: 'el-icon-data-line',
          color: '#F86B1D',
        },
        {
          title: '标签',
          icon: 'el-icon-collection-tag',
          color: '#1661AB',
        },
        {
          title: '消息',
          icon: 'el-icon-bell',
          color: '#93B5CF',
        },
      ],
      nowDate: '',
      realDate: [
        {
          title: '实收金额',
          num: '2156',
          icon: 'icon-weibiaoti-2-19',
        },
        {
          title: '支付单数',
          num: '23',
          icon: 'icon-weibiaoti-2-14',
        },
        {
          title: '浏览量',
          num: '1234',
          icon: 'icon-weibiaoti-2-21',
        },
        {
          title: '新增客户数',
          num: '36',
          icon: 'icon-weibiaoti-2-05',
        },
        {
          title: '支付人数',
          num: '23',
          icon: 'icon-weibiaoti-2-08',
        },
      ],
      dealData: [
        {
          title: '线上(单)',
          num: '82',
          icon: 'el-icon-upload2',
        },
        {
          title: '线下(单)',
          num: '32',
          icon: 'el-icon-download',
        },
        {
          title: '其他(单)',
          num: '10',
          icon: 'el-icon-help',
        },
      ],
      loading: true,
      tendEchart: {},
      percentages: 74, // 线上成单百分比
    }
  },
  created() {},
  methods: {
    async getWeather() {
      // 获取城市名称
      const { data: getCity } = await this.$axios.get(
        `${api.localUrl}/pconlineIp`, {params: returnCitySN}
      )
      if (getCity.status !== 200) return this.$message.error('获取信息失败')
      this.pparams.location = '杭州'
      // 获取当前城市天气信息及生活指数
      const { data: weatherInfos } = await this.$axios.get(
        `${api.localUrl}/weatherInfo`,
        { params: { location: this.pparams.location } }
      )
      if (weatherInfos.status !== 200)
        return this.$message.error('获取天气信息失败')
      this.weatherIn = weatherInfos.data.info
      this.sportText = weatherInfos.data.sportText
      // 判断当前时间
      let hour = this.weatherIn.obsTime.substring(11, 13)
      if (hour > 12) {
        this.isHour = '下午好'
      } else {
        this.isHour = '上午好'
      }
      this.loading = false
    },
    // 图表
    showTend() {
      this.tendEchart = this.$echarts.init(this.$refs.chart)
      const colors = ['#4aa9e5', '#0ce2dd']
      this.tendEchart.setOption({
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
          data: ['04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
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
            data: [602, 506, 650, 785, 690, 900],
            name: '今日实收金额',
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
                  color: 'rgba(74,169,229,0.8)',
                },
                {
                  offset: 1,
                  color: 'rgba(74,169,229,0.3)',
                },
              ]),
            },
          },
          {
            data: [650, 400, 600, 700, 880, 750],
            name: '昨日实收金额',
            type: 'line',
            smooth: true,
            showSymbol: false,
            lineStyle: {
              color: '#0ce2dd',
            },
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(12,226,221,0.8)',
                },
                {
                  offset: 1,
                  color: 'rgba(12,226,221,0.3)',
                },
              ]),
            },
          },
        ],
      })
    },
  },
  mounted() {
    this.showTend()
    this.getWeather()
    // 获取数据更新时间
    const dates = new Date()
    const year = dates.getFullYear().toString()
    let mon = dates.getMonth() + 1
    mon = mon.toString()
    const day = dates.getDate().toString()
    this.nowDate = `${year}-${mon.length === 1 ? mon.padStart(2, '0') : mon}-${
      day.length === 1 ? day.padStart(2, '0') : day
    }`
    // --------
    let _this = this
    // window.onresize 事件获取浏览器大小改变的事件，然后调用 echartsInstance.resize 改变图表的大小。
    window.onresize = function () {
      _this.tendEchart.resize()
    }
  },
}
</script>

<style lang="less" scoped>
// 设置10px字体大小
.shrink() {
  font-size: 10px;
  -webkit-transform: scale(0.9);
  display: inline-block;
}
.title_bold {
  font-size: 16px !important;
  font-weight: 600;
}
p {
  margin: 0;
}
.el-row {
  display: flex;
  margin-top: 4px;
}
.el-card {
  box-shadow: 0 0 4px 0 rgb(200 200 200 / 50%);
  border: none;
  margin: 0px 2px 12px 2px;
}
.dash-left {
  flex: 1;
  height: 100%;
}
.dash-right {
  width: 280px;
  height: 100%;
  margin-left: 12px;
  .dash-notice {
    height: 250px;
    // 公告头部
    .notice-title {
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 14px;
      a {
        display: block;
        float: right;
        text-decoration: none;
        color: #000;
        opacity: 0.3;
        font-size: 12px;
      }
    }
  }
  //   公告内容
  .notice-content {
    ul {
      padding: 0;
      margin: 0;
      li {
        list-style-type: none;
        height: 33px;
      }
    }
    a {
      position: relative;
      display: block;
      text-decoration: none;
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #000;
      opacity: 0.7;
      padding-right: 40px;
      span {
        position: absolute;
        right: 0;
        font-weight: 500;
      }
    }
  }
}
.dash-hello {
  height: 152px;
  .dash-welcome {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 18px;
  }
  .dash-weather {
    display: flex;
    align-items: center;
    .dash-icon {
      width: 76px;
      height: 76px;
      margin-right: 14px;
    }
    .el-avatar {
      width: 100%;
      height: 100%;
    }
    .dash-weather-info {
      h1 {
        margin: 0 0 10px 0;
      }
      span {
        font-size: 14px;
      }
    }
  }
}

::v-deep .el-card__body {
  padding: 15px;
  height: 100%;
  box-sizing: border-box;
  text-align: left;
}
// 常用功能
.common-fun {
  height: 86px;
  ul {
    margin: 4px 0 0 0;
    padding: 0;
    display: flex;
    justify-content: space-between;
    li {
      list-style-type: none;
      text-align: center;
      width: 100px;
      cursor: pointer;
      p {
        margin: 0 0 4px 0;
        font-size: 14px;
        i {
          font-size: 24px;
        }
      }
    }
  }
}
// 实时数据
.realdata {
  height: 160px;
  span {
    font-size: 14px;
    a {
      .shrink();
      color: #000;
      opacity: 0.6;
    }
  }
  ul {
    display: flex;
    justify-content: space-between;
    padding: 0 12px 0 12px;
    margin: 24px 0 10px 0;
    li {
      display: flex;
      align-items: center;
      list-style-type: none;
      //   margin: 0 12px;
      .realdata-right {
        margin-left: 4px;
      }
      i {
        font-size: 74px;
      }
      .realdata-num {
        display: flex;
        flex-direction: column;
        margin-bottom: 6px;
        font-size: 20px;
        font-weight: 700;
      }
    }
  }
}
.chart {
  display: flex;
  // 目标进度
  .target_schedule {
    height: 430px;
    width: 400px;
    margin-right: 12px;
  }
  .schedule_loop {
    text-align: center;
    margin: 22px 0 10px 0;
    position: relative;
    .schedule_text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      div {
        font-size: 20px;
        font-weight: 600;
      }
      span {
        font-size: 14px;
        color: #000;
        opacity: 0.5;
      }
    }
  }
  .schedule_data {
    display: flex;
    justify-content: space-between;
    padding: 0 50px;
    margin: 16px 0 0 0;
    .schedule_text1 {
      display: flex;
      flex-direction: column;
      align-items: center;
      div {
        font-size: 20px;
        font-weight: 600;
      }
      span {
        font-size: 14px;
        color: #000;
        opacity: 0.5;
      }
    }
  }
  .schedule_bottom {
    margin-top: 26px;
    display: flex;
    justify-content: space-between;
    padding: 0 16px;
    .schedule_bottom_list {
      display: flex;
      flex-direction: column;
      align-items: center;
      .list_icon {
        border-radius: 8px;
        background-color: #9bdbff4a;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        i {
          font-weight: bold;
          font-size: 22px;
          color: #43b4e4;
        }
      }
      .num {
        font-size: 18px;
        font-weight: 600;
        margin: 10px 0 6px 0;
      }
      .text {
        font-size: 14px;
        color: #000;
        opacity: 0.5;
      }
    }
  }
  .el-divider--horizontal {
    margin: 0;
  }
  .tend-chart {
    height: 430px;
    width: 100%;
    span {
      font-size: 14px;
    }
    .tend-map {
      height: 370px;
      width: 100%;
    }
  }
}
.circle2 /deep/ svg > path:nth-child(2) {
  stroke: url(#write);
}
.el-progress-circle__track {
  stroke: #120d65;
}
</style>