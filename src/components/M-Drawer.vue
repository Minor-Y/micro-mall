<template>
  <div>
    <!-- 抽屉 -->
    <el-drawer :title="title" :visible.sync="drawer" :before-close="handleClose" :size="size" :show-close="false">
      <slot name="header"></slot>
      <div class="editContent">
        <slot name="contents"></slot>
        <!-- 提交按钮 -->
        <div class="editButton">
          <slot name="button"></slot>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'MinorDrawer',
  data() {
    return {
      drawer: false,
    }
  },
  props: {
    size: {
      type: String,
      default: '30%',
    },
    drawerFlagD: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '抽屉标题',
    },
  },
  methods: {
    handleClose() {
      this.$emit('update:drawerFlagD', false)
    },
  },
  watch: {
    drawerFlagD() {
      this.drawer = this.drawerFlagD
    },
  },
}
</script>

<style lang="less" scoped>
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
</style>