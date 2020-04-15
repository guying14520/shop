<template>
  <el-container>
      <!-- 头部区域 -->
    <el-header>
        <div>
            <img src="../assets/logo.png" alt="">
            <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="loginOut">退出</el-button>
    </el-header>
    <el-container>
       
        <el-aside :width="isCollapse?'64px' : '200px'">
            <div class="toggle-button" @click="toggleCollapse()">|||</div>
             <!-- 侧边菜单区域 -->
            <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activePath">
                <!-- 一级菜单 -->
                <el-submenu :index="item.id +''" v-for="item in menuList" :key="item.id">
                    <template slot="title">
                        <i :class="iconObj[item.id]"></i>
                        <span>{{item.authName}}</span>
                    </template>
                    <!-- 二级菜单 -->
                    <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
                        <template slot="title">
                             <i class="el-icon-menu"></i>
                        <span>{{subItem.authName}}</span>
                        </template>
                    </el-menu-item>
                </el-submenu>
            </el-menu>
        </el-aside>
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
    data(){
        return{
            menuList:[],
            iconObj:{
                "125":'iconfont  icon-users',
                "103":'iconfont icon-tijikongjian',
                "101":'iconfont icon-shangpin',
                "102":'iconfont icon-danju',
                "145":'iconfont icon-baobiao'
            },
            isCollapse:false,
            activePath:''//被激活的鏈接地址
        }
    },
  methods: {
    loginOut() {
      window.sessionStorage.clear() //清楚token
      this.$router.push("/login") //返回到登录页面
    },
    getMenuList(){
        this.axios.get('menus').then(res=>{
    
            if(res.data.meta.status !=200){
                return this.$message.errot(res.data.mata.msg)
            }
            this.menuList=res.data.data;
           
        })
    },
    //点击按钮切换菜单的折叠和展开
    toggleCollapse(){
        this.isCollapse=!this.isCollapse;
    },
    //保存連接的激活狀態
    saveNavState(activePath){
        window.sessionStorage.setItem('activePath',activePath);
        this.activePath=activePath;
    }

  },
  created(){
      this.getMenuList();
      this.activePath= window.sessionStorage.getItem('activePath')
  }
}
</script>

<style lang="less" scoped>
.el-container{
    height: 100%;
}
.el-header{
    background: #373d41;
    display: flex;justify-content: space-between;padding-left: 0;align-items: center;color: #fff;font-size: 20px;
    >div{
        display: flex;align-items: center;
        span{
            margin-left: 15px;
        }
    }
}
.toggle-button{
    background: #4A5064;color:#fff;font-size: 10px;line-height: 24px;text-align: center;letter-spacing: 0.2em;cursor: pointer;
}
.el-aside{
    background: #333744;
}
.el-main{
    background: #eaedf1;
}
.el-menu{border-right:0;}
.iconfont{margin-right: 10px;}
</style>
