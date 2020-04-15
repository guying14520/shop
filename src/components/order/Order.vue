<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @clear="getOrderList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList()"
            >
            </el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" border stripe style="width: 100%">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格(元)">
        </el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status == '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">{{
            scope.row.create_time | dataFormat
          }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showBox()"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProgressBox(scope.row.order_id)"
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
      <!-- 修改地址的对话框 -->
      <el-dialog
        title="修改地址"
        :visible.sync="addressVisible"
        width="50%"
        @close="addressDialogClose"
      >
        <span slot="footer" class="dialog-footer">
          <el-form
            :model="addressForm"
            :rules="addressrules"
            ref="addressruleFormRef"
            label-width="100px"
          >
            <el-form-item label="省市区/县" prop="address1">
              <el-cascader
                :options="cityData"
                v-model="addressForm.address1"
                :props="{ expandTrigger: 'hover' }"
              >
              </el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="address2">
              <el-input v-model="addressForm.address2"></el-input>
            </el-form-item>
          </el-form>
          <el-button @click="addressVisible = false">取 消</el-button>
          <el-button type="primary"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 物流进度的对话框 -->
      <el-dialog title="物流进度" :visible.sync="ProgressVisible" width="50%">
              <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import cityData from "./citydata";
export default {
  data() {
    return {
      queryInfo: {
        query: "", //搜索关键字
        pagenum: 1, //当前页
        pagesize: 10 //当前每页显示多少数据
      },
      total: 0,
      orderList: [],
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ""
      },
      addressrules: {
        address1: [
          { required: true, message: "请选择省市区/县", trigger: "blur" }
        ],
        address2: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      },
      cityData,
      ProgressVisible: false,
      progressInfo:[],//物流信息
    };
  },
  methods: {
    getOrderList() {
      this.axios.get("orders", { params: this.queryInfo }).then(res => {
        if ((res.data.meta.status = !200))
          return this.$message.error("获取商品列表失败");
        this.orderList = res.data.data.goods;
        this.total = res.data.data.total;
      });
    },
    showBox() {
      this.addressVisible = true;
    },
  
    showProgressBox(id) {
        this.ProgressVisible=true;
        this.axios.get('/kuaidi/1106975712662').then(res=>{
            console.log(res)
            if(res.data.meta.status=!200) return this.$message.error('物流信息获取失败')
            this.progressInfo = res.data.data
            
        })
    },

    //监听爬个size改变的事件
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    //监听页码值改变的事件
    handleCurrentChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagenum = newSize;
      this.getOrderList();
    },
    addressDialogClose() {
      this.$refs.addressruleFormRef.resetFields();
    }
  },
  created() {
    this.getOrderList();
  }
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
