<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card> 
        <el-table :data="rightList" border stripe>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="权限名称" prop="authName"></el-table-column>
            <el-table-column label="路径" prop="path"></el-table-column>
            <el-table-column label="权限等级" prop="level">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.level=='0'">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.level=='1'">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
                </template>
            </el-table-column>
        </el-table>

    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightList: [] //权限列表数据
    };
  },
  methods: {
    getRightList() {
      this.axios.get("rights/list").then(res => {
        console.log(res);
        if(res.data.meta.status =!200){
            return this.$message.error('获取权限列表失败')
        }
        this.rightList=res.data.data;
      });
    },

  },
  created() {
    this.getRightList();
  }
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
</style>
