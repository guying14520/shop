import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/Login.vue";
import Home from "../components/Home.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: "/", redirect: "/login" }, //路由重定向
    { path: "/login", component: Login },
    { path: "/home", component: Home }
  ]
});
router.beforeEach((to, from, next) => {
  //to将要访问的路劲
  //from 从哪个路径体跳转过来的
  //next 是一个函数 表示放行
  if (to.path === "/login") return next(); //登陆页面是不需要token的 其他页面都是需要的
  //获取token
  const tokenStr = window.sessionStorage.getItem("token");
  if (!tokenStr) return next("/login");
  next();
});
export default router;
