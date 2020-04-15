import Vue from "vue";
import VueRouter from "vue-router";
const User = () => import(/* webpackChunkName: "user" */ '../components/User.vue')

const Rights = () => import(/* webpackChunkName: "right_roles" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "right_roles" */ '../components/power/Roles.vue')

const Goods = () => import(/* webpackChunkName: "goods" */ '../components/goods/Goods.vue')
const Categories = () => import(/* webpackChunkName: "goods" */ '../components/goods/Categories.vue')
const Params = () => import(/* webpackChunkName: "goods" */ '../components/goods/Params.vue')
const Add = () => import(/* webpackChunkName: "goods" */ '../components/goods/Add.vue')



// import Order from "../components/order/Order.vue";
// import Report from "../components/report/Report.vue";
const Order = () => import(/* webpackChunkName: "order" */ '../components/order/Order.vue')
const Report = () => import(/* webpackChunkName: "report" */ '../components/report/Report.vue')



const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')




Vue.use(VueRouter);

const router = new VueRouter({
  routes: [{
    path: "/",
    redirect: "/login"
  }, //路由重定向
  {
    path: "/login",
    component: Login
  },
  {
    path: "/home",
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: Welcome
    },
    {
      path: '/users',
      component: User
    },{
      path:'/rights',
      component:Rights
    }
    ,{
      path:'/goods',
      component:Goods
    },{
      path:'/categories',
      component:Categories
    },{
      path:'/params',
      component:Params
    },{
      path:'/roles',
      component:Roles
    },{
      path:'/goods/add',
      component:Add
    },
    {
      path:'/orders',
      component:Order
    },
    {
      path:'/reports',
      component:Report
    }
    ]
  }
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