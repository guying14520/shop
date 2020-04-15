<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的选择框 -->
          <el-cascader
            expand-trigger="hover"
            v-model="selectCateKeys"
            :options="CateList"
            :props="CateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 选项卡 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            sizi="mini"
            :disabled="isBtnDisbled"
            @click="adddialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                     @close="handleClose(i,scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  icon="el-icon-edit"
                  type="primary"
                  size="mini"
                  @click="showEditDaliog(scope.row.attr_id)"
                  >修改
                </el-button>
                <el-button
                  icon="el-icon-delete"
                  type="danger"
                  size="mini"
                  @click="removeCategories(scope.row.attr_id)"
                  >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            sizi="mini"
            :disabled="isBtnDisbled"
            @click="adddialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  icon="el-icon-edit"
                  type="primary"
                  size="mini"
                  @click="showEditDaliog(scope.row.attr_id)"
                  >修改
                </el-button>
                <el-button
                  icon="el-icon-delete"
                  type="danger"
                  size="mini"
                  @click="removeCategories(scope.row.attr_id)"
                  >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="adddialogVisible"
      width="50%"
      @close="adddialogClose"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editdialogClose"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      CateList: [],
      //级联选项框的配置项
      CateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      //级联选择框双向绑定到的数组
      selectCateKeys: [],
      activeName: "many",
      manyTableData: [], //动态参数的数据
      onlyTableData: [], //静态参数的数据
      adddialogVisible: false,
      editDialogVisible: false,
      addForm: {
        attr_name: ""
      },
      // 添加表单的验证规则
      addFormRules: {
        attr_name: {
          required: true,
          message: "请输入参数名称",
          trigger: "blur"
        }
      },
      editForm: {
        attr_name: ""
      },
      // 修改表单的验证规则
      editFormRules: {
        attr_name: {
          required: true,
          message: "请输入参数名称",
          trigger: "blur"
        }
      }
    };
  },
  methods: {
    getCateList() {
      this.axios.get("categories").then(res => {
        if ((res.data.meta.status = !200)) {
          return this.$message.error("商品分类获取失败");
        }
        this.CateList = res.data.data;
      });
    },
    //文本框失去焦点或按下enter键都会触发
    handleInputConfirm(row) {
      if(row.inputValue.trim().length===0){
        row.inputValue='';
        row.inputVisible = false;
        return
      }
     //如果么有return 则证明输入了内容需要做后续处理
     row.attr_vals.push(row.inputValue.trim())
     row.inputValue='';
     row.inputVisible=false;
this.saveAttrVals(row)
       
    },
    //删除对应的参数选项
    handleClose(i,row){
      row.attr_vals.splice(i,1)
      this.saveAttrVals(row)
    },
    //将对attr_vals的操作，保存到数据库
    saveAttrVals(row){
           //发起请求保存数据
     this.axios.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
       attr_name:row.attr_name,
       attr_sel:row.attr_sel,
       attr_vals:row.attr_vals.join(' ')
     }).then(res=>{
     
       if(res.data.meta.status=!200) return this.$message.error('修改参数项失败')
       this.$message.success('修改参数项成功')
     })
    },
    //
    showInput(row) {
      row.inputVisible = true;
      //让文本框自动获取焦点
      //$nextTick 方法的作用，就是当页面被重新渲染后才会执行函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //监听添加对话框的关闭事件
    adddialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    editdialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    //级联选择框选中变化会触发这个函数
    handleChange() {
      this.getParamsData();
    },
    //点击按钮添加参数
    addParams() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return;
        this.axios
          .post(`categories/${this.cateId}/attributes`, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          })
          .then(res => {
            if ((res.data.meta.status = !200)) {
              return this.$message.error("参数添加失败");
            }
            this.$message.success("添加参数成功！");
            this.adddialogVisible = false;
            this.getParamsData();
          });
      });
    },
    // 修改参数对话框的确定按钮
    editParams() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return;
        this.axios
          .put(
            `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
            {
              attr_name: this.editForm.attr_name,
              attr_sel: this.activeName
            }
          )
          .then(res => {
            if ((res.data.meta.status = !200)) {
              return this.$message.error("参数修改失败");
            }
            this.$message.success("修改参数成功！");
            this.editDialogVisible = false;
            this.getParamsData();
          });
      });
    },

    getParamsData() {
      //证明选中不是三级分离
      if (this.selectCateKeys.length !== 3) {
        this.selectCateKeys = [];
        this.manyTableData=[];
        this.onlyTableData=[];
        return;
      }
      //根据所选分类的id和当前所处的面板 获取对应的参数
      this.axios
        .get(`categories/${this.cateId}/attributes`, {
          params: { sel: this.activeName }
        })
        .then(res => {
          if ((res.data.meta.status = !200)) {
            return this.$message.error("获取参数列表失败");
          }
          res.data.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
            //控制文本框的显示与隐藏
            item.inputVisible = false;
            item.inputValue = ""; //文库框中输入的值
          });
   
          if (this.activeName === "many") {
            this.manyTableData = res.data.data;
          } else {
            this.onlyTableData = res.data.data;
          }
        });
    },
    //删除数据
    removeCategories(id) {
      // 删除弹框
      this.$confirm("此操作将永久删除该数据, 是否继续?", "删除用户", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios
            .delete(`categories/${this.cateId}/attributes/${id}`)
            .then(res => {
        
              if (res.data.meta.status == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.getParamsData();
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
    //tab 标签页的点击事件
    handleTabClick() {
  
      this.getParamsData();
    },
    showEditDaliog(id) {
      this.editDialogVisible = true;
      this.axios
        .get(`categories/${this.cateId}/attributes/${id}`, {
          params: { attr_sel: this.activeName }
        })
        .then(res => {
         
          if ((res.data.meta.status = !200)) {
            this.$message.error("获取信息失败");
          }
          this.editForm = res.data.data;
        });
    }
  },
  computed: {
    // 如果按钮需要被禁用则返回true，否则返回false
    isBtnDisbled() {
      if (this.selectCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    //当前选中的数组的id
    cateId() {
      if (this.selectCateKeys.length === 3) {
        return this.selectCateKeys[2];
      }
      return null;
    },
    //动态计算标题的文本
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    }
  },
  created() {
    this.getCateList();
  }
};
</script>

<style scoped lang="less">
.el-breadcrumb {
  margin-bottom: 15px;
}
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 150px;
}
</style>
