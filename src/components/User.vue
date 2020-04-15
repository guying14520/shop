<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <div style="margin-top: 15px;">
        <el-row :gutter="20">
          <!-- <el-col :sapn="6"> -->
          <el-input
            placeholder="请输入内容"
            style="width:400px;margin-right:20px;margin-left:15px;"
            clearable
            v-model="queryInfo.query"
            @clear="getUserList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList()"
            ></el-button>
          </el-input>
          <!-- </el-col> -->
          <!-- <el-col :sapn="4" style="width:300px;"> -->
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
          <!-- </el-col> -->
        </el-row>
      </div>
      <el-table :data="userList" border stripe style="width: 100%">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态" width="150">
          <!-- {{scope.row}} 代表一行全部的数据 再拿到具体的属性 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="219">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="showEdiDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <el-tooltip effect="dark" content="分配角色" :enterable="false">
              <el-button
                @click="setRole(scope.row)"
                type="warning"
                icon="el-icon-setting"
                circle
                size="mini"
              ></el-button>
            </el-tooltip>
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
      <!-- 添加用户对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClose"
      >
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="70px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUserInfo()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户 -->
      <el-dialog
        @close="editDialogClose()"
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
      >
        <el-form
          :model="editFrom"
          :rules="editFromRules"
          ref="editFromRef"
          label-width="70px"
        >
          <el-form-item label="用户名">
            <el-input v-model="editFrom.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editFrom.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editFrom.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配角色对话框 -->
      <el-dialog
        @close="setRoledialogClose"
        title="分配角色"
        :visible.sync="setRoledialogVisible"
        width="50%"
      >
        <div>
          <p>当前的用户:{{ userInfo.username }}</p>
          <p>当前的角色:{{ userInfo.role_name }}</p>
          <p>
            分配新角色:
            <el-select v-model="selectRoleId" placeholder="请选择">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoledialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    //验证邮箱
    var checkEamil = (rule, value, cb) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/;
      if (regEmail.test(value)) {
        return cb;
      }
      cb(new Error("请输入合法的邮箱"));
    };
    //验证手机号
    var checkMobile = (rule, value, cb) => {
      const regEmail = /^1[34578]\d{9}$/;
      if (regEmail.test(value)) {
        return cb;
      }
      cb(new Error("请输入合法的手机号"));
    };
    return {
      queryInfo: {
        query: "", //搜索关键字
        pagenum: 1, //当前页
        pagesize: 10 //当前每页显示多少数据
      },
      userList: [],
      total: 0,
      addDialogVisible: false, //添加用户的对话框
      editDialogVisible: false, //修改用户的对话框
      setRoledialogVisible: false, //分配角色对话框
      userInfo: {
        //需要被分配角色的用户信息
      },
      selectRoleId: "", //已选中的角色
      roleList: [], //用户角色列表

      addForm: {
        //添加用户
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      editFrom: {
        //查询到的用户信息
      },
      addFormRules: {
        //表单的验证
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEamil, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      editFromRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEamil, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      this.axios.get("users", { params: this.queryInfo }).then(res => {
        if (res.data.meta.status != 200)
          return this.$message.error("用户列表获取失败");
        this.userList = res.data.data.users;
        this.total = res.data.data.total;
      });
    },
    //监听爬个size改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    //监听开关改变事件
    userStateChange(userInfo) {
      this.axios
        .put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
        .then(res => {
          if (res.data.meta.status != 200) {
            userInfo.mg_state = !userInfo.mg_state;
            return this.$message.error("更新用户失败");
          }
        });
    },
    //对话框内的确定按钮
    addUserInfo() {
      this.$refs.addFormRef.validate(vaild => {
        if (!vaild) return;
        this.axios.post("users", this.addForm).then(res => {
          if ((res.data.meta.status = !201)) {
            this.$message.error("添加用户失败");
          }
          this.$message.success("添加用户成功");
          this.addDialogVisible = false;
        });
      });
    },
    //修改用户对话框内的确定按钮
    editUserInfo() {
      // this.$refs.editFromRef.validate(vaild=>{
      // if(!vaild) return;
      this.axios
        .put("users/" + this.editFrom.id, {
          email: this.editFrom.email,
          mobile: this.editFrom.mobile
        })
        .then(res => {
          console.log(res);
          if ((res.data.meta.status = !200)) {
            this.$message.error("修改用户信息失败");
          }
          this.$message.success("更新用户信息成功");
          this.editDialogVisible = false;
          this.getUserList();
        });
      // })
    },
    // 编辑用户
    showEdiDialog(id) {
      this.editDialogVisible = true;
      this.axios.get("users/" + id).then(res => {
        if ((res.data.meta.status = !200)) {
          return this.$message.error("查询用户失败");
        }
        this.editFrom = res.data.data;
      });
    },
    // 监听添加用户对话框的关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    editDialogClose() {
      this.$refs.editFromRef.resetFields();
    },
    //删除用户
    removeUserById(id) {
      // 删除弹框
      this.$confirm("此操作将永久删除该用户, 是否继续?", "删除用户", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios.delete("users/" + id).then(res => {
            console.log(res);
            if (res.data.meta.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getUserList();
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
    // 分配角色对话框
    setRole(userInfo) {
      this.userInfo = userInfo;
      this.setRoledialogVisible = true;
      //获取所有角色的列表
      this.axios.get("roles").then(res => {
        console.log(res);
        if ((res.data.meta.status = !200)) {
          return this.$message.error("获取用户角色列表失败");
        }
        this.roleList = res.data.data;
      });
    },
    //点击按钮分配角色
    saveRoleInfo() {
      if (!this.selectRoleId) {
        return this.$message.error("请选择用户角色");
      }
      this.axios
        .put(`users/${this.userInfo.id}/role`, { rid: this.selectRoleId })
        .then(res => {
          if ((res.data.meta.status = !200)) {
            return this.$message.error("更新角色失败");
          }
          this.$message.success("更新角色成功");
          this.getUserList();
          this.setRoledialogVisible = false;
        });
    },
    //监听分配角色的对话框的关闭事件
    setRoledialogClose() {
      this.selectRoleId = "";
      this.userInfo = {};
    }
  }
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
// .el-card{box-shadow: 0 1px 1px rgb(0,0,0,0.15) !important;}
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 15px;
}
</style>
