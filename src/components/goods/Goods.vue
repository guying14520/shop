<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @clear="getGoodsList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList()"
            >
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" border stripe style="width: 100%">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="130px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100px">
        </el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="100px">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="170px">
          <template slot-scope="scope">{{
            scope.row.add_time | dataFormat
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="removeGoodsById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsList: [],
      queryInfo: {
        query: "", //搜索关键字
        pagenum: 1, //当前页
        pagesize: 10 //当前每页显示多少数据
      },
      total: 0
    };
  },
  methods: {
    getGoodsList() {
      this.axios.get("goods", { params: this.queryInfo }).then(res => {
        if ((res.data.meta.status = !200))
          return this.$message.error("获取商品列表失败");
        this.goodsList = res.data.data.goods;
        this.total = res.data.data.total;
      });
    },
    // 添加商品的按钮
    goAddpage() {
      this.$router.push('/goods/add')
    },
    //删除商品
    removeGoodsById(id) {
      console.log(id);
      this.$confirm("此操作将永久删除该用户, 是否继续?", "删除用户", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios.delete("goods/" + id).then(res => {
            console.log(res);
            if (res.data.meta.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getGoodsList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //监听爬个size改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    }
    //监听开关改变事件
  },
  created() {
    this.getGoodsList();
  }
};
</script>

<style scoped lang="less">
.el-table {
  margin: 15px 0;
}
.el-card {
  margin-top: 15px;
}
</style>
