import { def } from "@vue/shared";
import axios from "axios";

//新建axios对象
const httpClient = axios.create({
  validateStatus(status) {
    return status >= 200 && status <= 504; //设置默认的合法的状态，若状态码不合法，则不会接收response
  },
  timeout: 20000, //超时时间10秒
});

httpClient.defaults.retry = 3; //请求重试次数
httpClient.defaults.retryDelay = 1000; //请求重试时间间隔
httpClient.defaults.shouldRetry = true; //是否重试

//添加请求拦截器
httpClient.interceptors.request.use(
  (config) => {
    //添加header
    config.headers["Content-Type"] = "application/json";
    config.headers["Accept-Language"] = "zh-CN";
    config.headers["Authorization"] = localStorage.getItem("token"); //可以全局设置接口请求header中带token
    // config.headers["Authorization"] =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTM4MTE1MDYsInVzZXJfaWQiOiJ5b3VyX3VzZXJfaWQiLCJ1c2VybmFtZSI6InlvdXJfdXNlcm5hbWUifQ.qPnpQwGB5mCssfds8LtmgnYbaxp6pBJQGXV-MNrtNdA";
    if (config.method == "post") {
      if (!config.data) {
        // 没有参数时，config.data为null，需要转下类型
        config.data = {};
      }
    }
    return config;
  },
  (err) => {
    //Promise.reject()方法返回一个带有拒绝原因的Promise对象，在F12的console中显示报错
    Promise.reject(err);
  }
);

//添加响应拦截器
httpClient.interceptors.response.use((response) => {
  console.log("打印response: ", response);
  if (response.status !== 200) {
    return Promise.reject(response.data); //如果响应状态码不等于200，就返回报错的数据在console中打印
  } else {
    return response.data; //否则直接返回响应的数据
  }
});

export default httpClient;
