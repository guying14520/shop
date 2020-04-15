import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/css/global.css"; //导入全局样式表
import "./assets/fonts/iconfont.css"; //导入字体图标
import TreeTable from "vue-table-with-tree-grid";
import axios from "axios";
import VueQuillEditor from "vue-quill-editor"; //富文本编辑器
// 导入富文本编辑器对应的样式
import "quill/dist/quill.core.css"; // import styles
import "quill/dist/quill.snow.css"; // for snow theme
import "quill/dist/quill.bubble.css"; // for bubble theme
//导入进入条对应的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
Vue.use(ElementUI);
Vue.config.productionTip = false;
//配置请求的根路径
// axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1/";
//设置请求头request 中显示进度条NProgress.start()
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
});
// 在response 拦截器中隐藏进度条   NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config;

});
// 将富文本编辑器注册成全局可用的组建
Vue.use(VueQuillEditor);
//全局时间过滤器
Vue.filter("dataFormat", function(originVal) {
  const dt = new Date(originVal);
  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + "").padStart(2, "0");
  const d = (dt.getDate() + "").padStart(2, "0");
  const hh = (dt.getHours() + "").padStart(2, "0");
  const mm = (dt.getMinutes() + "").padStart(2, "0");
  const ss = (dt.getSeconds() + "").padStart(2, "0");
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});
Vue.prototype.axios = axios;
Vue.component("tree-table", TreeTable); //注册全局组建
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
