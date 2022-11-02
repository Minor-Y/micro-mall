<template>
  <div>
    <el-dialog :title="title" :visible.sync="visible" :width="width" @close="visibleClose">
      <div class="order-detail">
        <div class="detail-top">
          <el-card :style="cradWidthHeight" v-if="showCard.one" class="detail-one">
            <slot name="one"></slot>
          </el-card>
          <el-card :style="cradWidthHeight" v-if="showCard.two">
            <slot name="two"></slot>
          </el-card>
        </div>
        <el-card class="crad-margin" v-if="showCard.three">
            <slot name="three"></slot>
        </el-card>
        <el-card v-if="showCard.four">
            <slot name="four"></slot>
        </el-card>
        <slot name="extra"></slot>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'MinorDialog',
  data() {
    return {
      visible: false,
    }
  },
  props: {
    title: {
      type: String,
      default: '提示',
    },
    visibleFlag: {
      type: Boolean,
      default: false,
    },
    // 对话框宽度
    width: {
      type: String,
      default: '60%',
    },
    // 卡片宽度
    cradWidthHeight: {
      type: String,
      default: 'width: 395px; height: 240px',
    },
    showCard: {
    //   type: Boolean,
      one: true,
      two: true,
      three: true,
      four: true,
    },
  },
  created() {},
  methods: {
    visibleClose() {
      this.$emit('update:visibleFlag', false)
      this.$emit('clearActivities', [])
      this.$emit('clearConsumerInfo', [])
    },
  },
  watch: {
    visibleFlag() {
      this.visible = this.visibleFlag
    },
  },
}
</script>

<style lang="less" scoped>
::v-deep .el-dialog {
  border-radius: 6px;
  .el-dialog__header {
    padding: 12px 12px 10px;
    text-align: left;
    .el-dialog__title {
      font-size: 16px;
    }
  }
  .el-dialog__body {
    padding: 0 12px 12px;
  }
}
.crad-margin {
  margin-bottom: 8px;
}
.order-detail {
  background-color: #f2f2f6;
  padding: 8px;
  border-radius: 6px;
  .detail-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    .detail-one {
      margin-right: 8px;
    }
  }
  .el-card {
    border-radius: 8px;
    // height: 200px;
    box-shadow: none;
    border: none;
  }
}

</style>