<template>
  <div>
    <el-card class="goods">
      <div class="goods-top">
        <!-- 输入框和添加商品按钮 -->
        <el-input placeholder="请输入内容" v-model="search" size="small" clearable @clear="getGoodsList">
          <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
        </el-input>
        <el-button type="primary" size="small" @click="showAddGoods">添加商品</el-button>
      </div>
      <!-- 商品展示去区 -->
      <el-table ref="goodslist" :data="goodsList.slice((currentPage - 1) * pageSize, currentPage * pageSize)" stripe>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="商品名称" prop="goodsName"></el-table-column>
        <el-table-column label="标签" prop="tag"></el-table-column>
        <el-table-column label="价格" prop="price" width="60"></el-table-column>
        <el-table-column label="销量" prop="salesNum"></el-table-column>
        <el-table-column label="上下架时间" width="160">
          <template slot-scope="scope">
            {{scope.row.putAwayDate | transformTime}}
          </template>
        </el-table-column>
        <el-table-column label="剩余库存" prop="stock"></el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" size="mini">编辑</el-button>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加商品弹出框 -->
    <el-dialog title="添加商品" :visible.sync="addGoodsVisible" width="36%">
      <el-form :model="goodsInfo" class="goods-add">
        <el-form-item label="商品名称">
          <el-input v-model="goodsInfo.goodsName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="商品标签">
          <el-select v-model="goodsInfo.tag" placeholder="请选择标签" size="small">
            <el-option label="食用油" value="shiyongyou"></el-option>
            <el-option label="面粉" value="mianfen"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="goodsInfo.price" size="small"></el-input>
        </el-form-item>
        <el-form-item label="销量">
          <el-input v-model="goodsInfo.salesNum" size="small"></el-input>
        </el-form-item>
        <el-form-item label="库存">
          <el-input v-model="goodsInfo.stock" size="small"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addGoodsVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGoodsVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../../api/index'
export default {
  data() {
    return {
      goodsList: [],
      search: '',
      total: 0,
      currentPage: 1,
      pageSize: 10,
      addGoodsVisible: false,
      goodsInfo: {
        goodsName: '',
        tag: '',
        price: '',
        salesNum: '',
        stock: '',
      },
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const gList = await this.$axios.get(`${api.defultUrl}/goods`)
      if (gList.data.meta.status !== 200)
        return this.$message.error('获取商品列表失败')
      this.goodsList = gList.data.data
      this.total = gList.data.data.length
    },
    // 监听页面展示条数
    handleSizeChange(size) {
      this.pageSize = size
    },
    // 监听当前选择的页码
    handleCurrentChange(page) {
      this.currentPage = page
    },
    showAddGoods() {
      this.addGoodsVisible = true
    },
  },
}
</script>

<style lang="less" scoped>
.goods {
  .goods-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 18px;
  }
  .el-input {
    width: 340px;
  }
}
.el-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-start;
}
.goods-add {
  padding: 0 30px 0 30px;
  .el-form-item {
    display: flex;
    justify-content: flex-start;
  }
  .el-input {
    width: 270px;
  }
  .el-select {
    width: 270px;
  }
}
::v-deep .el-form-item__label {
    width: 70px;
}
::v-deep .el-dialog__footer {
    padding: 0px 20px 20px;
}
::v-deep .el-table th.el-table__cell {
    background-color: #f5f6f8;
}
</style>