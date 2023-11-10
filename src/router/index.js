//导入router的路由模式
import { createRouter, createWebHistory } from "vue-router";
//导入进度条组件
import NProgress from "nprogress";
import "nprogress/nprogress.css";
//直接导入布局页面
import Layout from "@/layout/Layout.vue";

//路由规则
const routes = [
  {
    path: "/home",
    component: Layout,
    icon: "odometer",
    children: [
      //配置子页面
      {
        path: "/home", //视图,访问子页面的时候会带上layout布局页面
        name: "概要",
        icon: "odometer", //图标
        meta: { title: "概要", requireAuth: true },
        component: () => import("@/views/home/Home.vue"), //视图组件
      },
    ],
  },
  {
    path: "/workflow",
    component: Layout,
    icon: "Basketball",
    children: [
      //配置子页面
      {
        path: "/workflow", //视图,访问子页面的时候会带上layout布局页面
        name: "工作流",
        icon: "Basketball", //图标
        meta: { title: "工作流", requireAuth: true },
        component: () => import("@/views/home/Workflow.vue"), //视图组件
      },
    ],
  },

  {
    path: "/cluster",
    name: "集群",
    component: Layout,
    icon: "house",
    meta: { title: "集群", requireAuth: true },
    children: [
      //配置子页面
      {
        path: "/cluster/node", //视图,访问子页面的时候会带上layout布局页面
        name: "Node",
        // icon: "arrow-up", //图标
        meta: { title: "node", requireAuth: true },
        component: () => import("@/views/cluster/node.vue"), //视图组件
      },
      {
        path: "/cluster/namespace", //视图,访问子页面的时候会带上layout布局页面
        name: "Namespace",
        // icon: "folder-opened", //图标
        meta: { title: "Namespace", requireAuth: true },
        component: () => import("@/views/cluster/namespace.vue"), //视图组件
      },
      {
        path: "/cluster/pv", //视图,访问子页面的时候会带上layout布局页面
        name: "PersistentVolumes",
        // icon: "view", //图标
        meta: { title: "PersistentVolumes", requireAuth: true },
        component: () => import("@/views/cluster/pv.vue"), //视图组件
      },
    ],
  },

  {
    path: "/workload",
    name: "工作负载",
    component: Layout,
    icon: "menu",
    meta: { title: "工作负载", requireAuth: true },
    children: [
      //配置子页面
      {
        path: "/workload/deployment", //视图,访问子页面的时候会带上layout布局页面
        name: "Deployment",
        meta: { title: "Deployment", requireAuth: true },
        component: () => import("@/views/deployment/deployment.vue"), //视图组件
      },
      {
        path: "/workload/pod", //视图,访问子页面的时候会带上layout布局页面
        name: "Pod",
        meta: { title: "pod", requireAuth: true },
        component: () => import("@/views/pod/pod.vue"), //视图组件
      },
      {
        path: "/workload/daemonset", //视图,访问子页面的时候会带上layout布局页面
        name: "DaemonSet",
        meta: { title: "DaemonSet", requireAuth: true },
        component: () => import("@/views/daemonset/DaemonSet.vue"), //视图组件
      },
      {
        path: "/workload/statefulset", //视图,访问子页面的时候会带上layout布局页面
        name: "StatefulSet",
        meta: { title: "StatefulSet", requireAuth: true },
        component: () => import("@/views/statefulset/StatefulSet.vue"), //视图组件
      },
    ],
  },

  {
    path: "/proxy",
    name: "负载均衡",
    component: Layout,
    icon: "files",
    meta: { title: "负载均衡", requireAuth: true },
    children: [
      //配置子页面
      {
        path: "/proxy/service", //视图,访问子页面的时候会带上layout布局页面
        name: "Service",
        // icon: "Watermelon", //图标
        meta: { title: "Service", requireAuth: true },
        component: () => import("@/views/proxy/service.vue"), //视图组件
      },
      {
        path: "/proxy/ingress", //视图,访问子页面的时候会带上layout布局页面
        name: "Ingress",
        // icon: "Pear", //图标
        meta: { title: "Ingress", requireAuth: true },
        component: () => import("@/views/proxy/ingress.vue"), //视图组件
      },
    ],
  },

  {
    path: "/storconf",
    name: "存储与配置",
    component: Layout,
    icon: "tickets",
    meta: { title: "存储与配置", requireAuth: true },
    children: [
      //配置子页面
      {
        path: "/storconf/configmap", //视图,访问子页面的时候会带上layout布局页面
        name: "ConfigMap",
        // icon: "Watermelon", //图标
        meta: { title: "ConfigMap", requireAuth: true },
        component: () => import("@/views/storconf/configmap.vue"), //视图组件
      },
      {
        path: "/storconf/secret", //视图,访问子页面的时候会带上layout布局页面
        name: "Secret",
        // icon: "Pear", //图标
        meta: { title: "Secret", requireAuth: true },
        component: () => import("@/views/storconf/secret.vue"), //视图组件
      },
      {
        path: "/storconf/pvc", //视图,访问子页面的时候会带上layout布局页面
        name: "PersistentVolumeClaims",
        // icon: "Pear", //图标
        meta: { title: "PersistentVolumeClaims", requireAuth: true },
        component: () => import("@/views/storconf/pvc.vue"), //视图组件
      },
    ],
  },
  {
    path: "/nodedetail", //视图
    //icon: "odometer", //图标
    meta: { title: "NodeDetail", requireAuth: true }, //定义meta元数据
    component: () => import("@/views/cluster/NodeDetail.vue"), //视图组件
  },
  {
    path: "/404", //视图
    icon: "odometer", //图标
    meta: { title: "404", requireAuth: true }, //定义meta元数据
    component: () => import("@/views/common/404.vue"), //视图组件
  },
  {
    path: "/403", //视图
    icon: "odometer", //图标
    meta: { title: "403", requireAuth: true }, //定义meta元数据
    component: () => import("@/views/common/403.vue"), //视图组件
  },

  {
    path: "/:pathMatch(.*)", //vue2的话直接'.*'即可，匹配到任何不存在的路由都会跳转到404页面
    redirect: "/login",
  },
  {
    path: "/login", //视图
    icon: "el-icon-unlock", //图标
    meta: { title: "login", requireAuth: true }, //定义meta元数据
    component: () => import("@/views/login/login.vue"), //视图组件
  },
  {
    path: "/test", //视图
    icon: "el-icon-unlock", //图标
    meta: { title: "test", requireAuth: true }, //定义meta元数据
    component: () => import("@/views/login/test.vue"), //视图组件
  },
];

//创建路由实例
const router = createRouter({
  //hash模式：createWebHashHistory
  //history模式：createWebHistory
  history: createWebHistory(),
  routes,
});

//递增进度条，这将获取当前状态值并添加0.2直到状态为0.994
//NProgress.inc(100);
NProgress.inc(0.2);

//easing 动画字符串; speed 动画速度; showSpinner 进度环显示隐藏
NProgress.configure({ easing: "ease", speed: 600, showSpinner: false });

//router.beforeEach（）一般用来做一些进入页面的限制。比如没有登录，就不能进入某些页面，只有登录了之后才有权限查看某些页面。。。说白了就是路由拦截。
//to 要去到某个页面的属性; from 从哪个页面来的属性; next 处理路由跳转及放行
router.beforeEach((to, from, next) => {
  // 启动进度条
  NProgress.start();
  // 设置头部
  console.log(to.meta.title);
  if (to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = "Kubernetes";
  }
  next();
});

router.afterEach((to, from, next) => {
  // 关闭进度条
  NProgress.done();
});

//抛出路由实例，在main.js中引用
export default router;
