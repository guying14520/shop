<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addCateDialogVisible = true"
        >添加分类</el-button
      >

      <!-- 表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" type="primary"
            >编辑</el-button
          >
          <el-button icon="el-icon-delete" size="mini" type="danger"
            >删除</el-button
          >
        </template>
      </tree-table>
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
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateRef"
        label-width="70px"
      >
        <el-form-item label="分类名" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options：数据源 -->
          <!-- props：指定配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            change-on-select="true"
            clearable
            filterable
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [], //商品分类列表
      queryInfo: {
        type: 3,
        pagesize: 10,
        pagenum: 1
      },
      total: 0,
      //添加分类的表单数据
      addCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1到 10 个字符", trigger: "blur" }
        ]
      },

      //为table指定列的定义
      columns: [
        { label: "分类名称", prop: "cat_name" },
        { label: "是否有效", type: "template", template: "isOk" },
        { label: "排序", type: "template", template: "order" },
        { label: "操作", type: "template", template: "opt" }
      ],
      addCateDialogVisible: false,
      parentCateList:[],
            // 指定级联选择器的配置对象
      cascaderProps: {
        // 配置触发选项 hover/click
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //选中的父级分类的数组
      selectedKeys:[]
    };
  },
  methods: {
    getCategorles() {
      this.axios.get("categories", { params: this.queryInfo }).then(res => {
        console.log(res);
        if ((res.data.meta.status = !200)) {
          return this.$message.error("商品分类获取失败");
        }
        this.cateList = res.data.data.result;
        this.total = res.data.data.total;
      });
    },
    //级联选择器 选择项法伤变化
    parentCateChanged(){
      if(this.selectedKeys.length>0){
        this.addCateForm.cat_pid=this.selectedKeys[this.selectedKeys.length-1];

        this.addCateForm.cat_level=this.selectedKeys.length;
        return
      }else{
               this.addCateForm.cat_pid=0;

        this.addCateForm.cat_level=0;
      }
    },
    //点击按钮添加分类
addCate(){
  this.axios.post("categories",this.addCateForm).then(res=>{
    if(res.data.meta.status =!201){
      this.$message.error("添加失败")
    }
    this.$message.success("添加成功");
    this.addCateDialogVisible=false;
    this.getCategorles();
   
  })
},
    getParenCateList(){
      this.axios.get('categories',{params:{type:2}}).then(res=>{
        if(res.data.meta.status==200){
          this.parentCateList=res.data.data;
          this.addCateForm.cat_pid=0;
          this.addCateForm.cat_level=0;
        }
      })
    },

    addCateDialogClose() {
      this.$refs.addCateRef.resetFields();
      this.selectedKeys=[];
      
    },
    //监听爬个size改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCategorles();
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCategorles();
    }
  },
  created() {
    this.getCategorles();
    this.getParenCateList();
  }
};
</script>

<style scoped lang="less">
.el-breadcrumb {
  margin-bottom: 15px;
}
</style>
