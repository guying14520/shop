// 项目发布过程中用到的bable插件
const prodPlugins=[]
if(process.env.NODE_ENV==='production'){//处于发布模式的时候 向bable中添加这个方法
  prodPlugins.push("transform-remove-console")
}


module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }

    ],
    //在项目发布阶段移除页面中的console方法的调用
    ...prodPlugins,
    "@babel/plugin-syntax-dynamic-import"

  ]
}