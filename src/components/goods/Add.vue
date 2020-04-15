<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      ></el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
        class="demo-ruleForm"
      >
        <el-tabs
          :tab-position="tabPosition"
          v-model="activeIndex"
          :before-leave="beforTabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                expand-trigger="hover"
                v-model="addForm.goods_cat"
                :options="CateList"
                addForm.goods_cat
                :props="CateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项目 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 上传图片 -->
            <!-- action是图片上传的地址 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headerObj"
              list-type="picture"
              :on-success="handSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组建 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash"; //导入包
export default {
  data() {
    return {
      activeIndex: "0",
      tabPosition: "left",
      CateList: [],
      CateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      headerObj: {
        Authorization: window.sessionStorage.getItem("token")
      }, //图片上传的组件的请求头对象
      manyTableData: [], //动态参数列表数据
      onlyTableData: [],
      uploadURL: "https://www.liulongbin.top:8888/api/private/v1/upload", //图片上传的地址
      previewPath: "",
      previewVisible: false,
      //添加商品的表单数据对象
      addForm: {
        goods_name: "",
        goods_price: 1,
        goods_weight: 1,
        goods_number: 1,
        goods_cat: [],
        //图片数组
        pics: [],
        goods_introduce: "", //商品介绍
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //   添加商品
    add() {
      this.$refs.addFormRef.validate(vlid => {
        if (!vlid) {
          return this.$message.error("请填写必要的表单项");
        }
        // 解决办法: 包：lodash 方法（深拷贝）：cloneDeep(boj)
        const form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(",");
 // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)

        this.axios.post("goods",form).then(res => {
          console.log(res);
          if(res.data.meta.status =!201) return this.$message.error('商品添加失败')
         this.$message.success('添加商品成功!')
        this.$router.push('/goods')

        });
      });
    },
    getCateList() {
      this.axios.get("categories").then(res => {
        if ((res.data.meta.status = !200))
          return this.$message.error("获取商品分类失败");
        this.CateList = res.data.data;
      });
    },
    //级联选择框选中变化会触发这个函数
    handleChange() {
      if (this.addForm.goods_cat.length != 3) {
        this.addForm.goods_cat = [];
      }
    },
    beforTabLeave(activeName, oldActiveName) {
      if (oldActiveName == "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    tabClick() {
      if (this.activeIndex === "1") {
        //证明访问的是动态参数面板
        this.axios
          .get(`categories/${this.cateId}/attributes`, {
            params: {
              sel: "many"
            }
          })
          .then(res => {
            if ((res.data.meta = !200)) {
              return this.$message.error("获取动态参数列表失败");
            }
            res.data.data.forEach(item => {
              item.attr_vals =
                item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
            });
            this.manyTableData = res.data.data;
          });
      } else if (this.activeIndex === "2") {
        this.axios
          .get(`categories/${this.cateId}/attributes`, {
            params: {
              sel: "only"
            }
          })
          .then(res => {
            if ((res.data.meta = !200)) {
              return this.$message.error("获取静态属性列表失败");
            }
            this.onlyTableData = res.data.data;
          });
      }
    },
    //处理图片预览
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
    //处理移除图片的操作
    handleRemove(file) {
      // 1.获取将要删除图片的临时路径
      const filePath = file.response.data.tmp_path;
      // 2.从pics数组中，找到图片对应的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath);
      // 3.调用splice方法，移除图片信息
      this.addForm.pics.splice(i, 1);
    },
    //监听图片上传成功的事件
    handSuccess(response) {
      //拼接得到一个图片信息对象 ，
      const pinInfo = {
        pic: response.data.tmp_path
      };
      this.addForm.pics.push(pinInfo);
      //2.将图片push到pic上
    }
  },
  created() {
    this.getCateList();
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    }
  }
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-checkbox {
  margin: 0 5px 0 0 !important ;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>
