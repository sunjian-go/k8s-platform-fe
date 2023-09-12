import { createApp } from "vue";
//引入element-plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
//引入图标视图
import * as ELIcons from "@element-plus/icons-vue";
//引入APP.vue主组件
import App from "./App.vue";
//引入路由配置及规则
import router from "./router";

//codemirror编辑器
import { GlobalCmComponent } from "codemirror-editor-vue3";
//引入主题 可以从 codemirror/theme/ 下引入多个
import "../node_modules/codemirror-editor-vue3/node_modules/codemirror/theme/idea.css";
//引入语言模式 可以从 codemirror/mode/ 下引入多个
import "../node_modules/codemirror-editor-vue3/node_modules/codemirror/mode/yaml/yaml.js";

//创建vue实例
const app = createApp(App);
//将图标注册为全局组件
for (let iconName in ELIcons) {
  app.component(iconName, ELIcons[iconName]);
}
app.use(GlobalCmComponent);
//引入element plus
app.use(ElementPlus);
//引入路由
app.use(router);

//这两段代码是为了避免以下报错
// ResizeObserver loop limit exceeded     
// at handleError (webpack-internal:///./node_modules/webpack-dev-server/client/overlay.js:299:58)    
//  at eval (webpack-internal:///./node_modules/webpack-dev-server/client/overlay.js:318:7)
const debounce = (fn, delay) => {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  }
}
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver{
  constructor(callback) {
    callback = debounce(callback, 16);
    super(callback);
  }
}

//挂载
app.mount("#app");
