<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRloeDialog = true"
            >添加角色</el-button
          ></el-col
        >
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightId(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限和三级 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6"
                    ><el-tag
                      type="success"
                      closable
                      @close="removeRightId(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightId(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="eidtRoles(scope.row.id)"
              >编辑</el-button
            ><el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRole(scope.row.id)"
              >删除</el-button
            ><el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 修改角色 -->
    <el-dialog
      @close="editDialogClose()"
      title="修改角色"
      :visible.sync="editRoleDialog"
      width="30%"
    >
      <el-form :model="editRoles" ref="editRolesRef" label-width="70px">
        <el-form-item label="角色名称">
          <el-input v-model="editRoles.roleName" prop="roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRloeDialog"
      width="30%"
      @close="addDialogClose"
    >
      <!-- :rules="addFormRules" -->
      <el-form :model="addForm" ref="addRoleRef" label-width="70px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addRloeDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRoles()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClose()"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolelist: [],
      setRightDialogVisible: false, //分配权限对话框
      rightList: [], //所有权限的树形数据
      treeProps: {
        //树形控件的属性
        label: "authName",
        children: "children"
      },
      roleId: 0, //当前即将分配权限的角色id
      defKeys: [], //默认选中的节点数据值
      addRloeDialog: false,
      editRoleDialog: false,
      addForm: {
        roleName: "",
        roleDesc: ""
      },
      editRoles: {
        roleName: "",
        roleDesc: ""
      }
    };
  },
  methods: {
    getRoles() {
      this.axios.get("roles").then(res => {
        if ((res.data.meta.status = !200)) {
          return this.$message.error("获取角色列表失败");
        }
        this.rolelist = res.data.data;
      });
    },
    addDialogClose() {
      this.$refs.addRoleRef.resetFields();
    },
    editDialogClose() {
      this.$refs.editRolesRef.resetFields();
    },
    //删除角色
    removeRole(id){
       this.$confirm("此操作将永久删除该角色, 是否继续?", "删除角色", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios.delete("roles/" + id).then(res => {
            console.log(res);
            if (res.data.meta.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getRoles();
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
    editRoleInfo() {
      console.log(this.editRoles);
      this.axios
        .put("roles/" + this.editRoles.roleId, {
          roleName: this.editRoles.roleName,
          roleDesc: this.editRoles.roleDesc
        })
        .then(res => {
          if ((res.meta.status = !200)) {
            return this.$message.error("修改角色失败");
          }
          this.$message.success("修改角色成功");
          this.editRoleDialog = false;
          console.log(res);
        });
    },
    //编辑角色
    eidtRoles(id) {
      this.editRoleDialog = true;
      this.axios.get("roles/" + id).then(res => {
        console.log(res);
        if ((res.data.meta.status = !200)) {
          return this.$message.error("查询用户失败");
        }
        this.editRoles = res.data.data;
      });
    },
    //添加角色
    addRoles() {
      this.axios.post("roles", this.addForm).then(res => {
        console.log(res);
        if ((res.data.meta = !201)) {
          return this.$message.error("添加角色失败");
        }
        this.$message.success("添加角色成功");
        this.addRloeDialog = false;
        this.getRoles();
      });
    },
    //根据id删除对应的权限
    async removeRightId(role, rightId) {
      // 弹框提示 删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      // 点击确定 返回值为：confirm
      // 点击取消 返回值为： cancel
      if (confirmResult !== "confirm") {
        this.$message.info("已取消权限删除");
      }
      const { data: res } = await this.axios.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败！");
      }
      role.children = res.data;
      //   不建议使用getRoles
      // this.getRoles()
    },
    //分配权限的对话框
    async showSetRightDialog(role) {
      //获取所有权限的数据
      const { data: res } = await this.axios.get("rights/tree");
      if ((res.meta.status = !200)) {
        return this.$message.error("获取用户数据失败");
      }
      this.rightList = res.data;
      this.roleId = role.id;
      console.log(this.rightList);
      //获取三级节点的id
      this.getLeafKeys(role, this.defKeys);
      this.setRightDialogVisible = true;
    },
    //通过递归的方法 获取角色下所有三级的ID  保存到数组当中
    getLeafKeys(node, arr) {
      //如果当前node节点不包含childern属性 则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr);
      });
    },
    //监听关闭对话框的关闭事件
    setRightDialogClose() {
      this.defKeys = [];
      this.rightList = [];
    },
    //点击为角色分配权限
    async allotRights(roleId) {
      // 获得当前选中和半选中的Id
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      // join() 方法用于把数组中的所有元素放入一个字符串
      const idStr = keys.join(",");
      const { data: res } = await this.axios.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败！");
      }
      this.$message.success("分配权限成功!");
      this.getRoles();
      this.setRightDialogVisible = false;
    }
  },
  created() {
    this.getRoles();
  },
  watch: {}
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
.el-table {
  margin-top: 15px;
}
</style>
