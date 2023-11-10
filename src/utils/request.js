import axios from "axios";
import Cookies from "js-cookie";
import router from "@/router";

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

// 创建一个取消令牌
let cancelToken = null;
let source = null;

//添加请求拦截器
// 获取 token
httpClient.interceptors.request.use(
  (config) => {
    //每次只有登陆的时候，才会重新创建cancelToken
    if (config.url.includes("login")) {
      cancelToken = axios.CancelToken;
      source = cancelToken.source();
    }
    config.cancelToken = source.token; // 全局添加cancelToken,用于下面响应拦截器按需调用 cancelToken 的 cancel() 方法来取消请求。
    //添加header
    config.headers["Content-Type"] = "application/json";
    config.headers["Accept-Language"] = "zh-CN";
    // config.headers["Authorization"] = localStorage.getItem("token"); //可以全局设置接口请求header中带token
    config.headers["Authorization"] = Cookies.get("token");
    // config.headers["Name"] = "etan";
    console.log("准备请求token为：", config.headers["Authorization"]);
    if (config.method == "post") {
      if (!config.data) {
        // 没有参数时，config.data为null，需要转下类型
        config.data = {};
      }
    }
    console.log("请求: ", config);
    return config;
  },
  (err) => {
    //Promise.reject()方法返回一个带有拒绝原因的Promise对象，在F12的console中显示报错
    Promise.reject(err);
  }
);

//添加响应拦截器
httpClient.interceptors.response.use(
  (response) => {
    console.log("打印response: ", response);
    if (response.status !== 200) {
      for (let k in response.data) {
        if (k == "data") {
          if (response.data[k].code == 10086) {
            source.cancel(response.data.msg); //发起取消其他正在进行的请求，使用source取消请求
            alert(response.data.msg);
            router.push("/login");
          }
        }
      }
      return Promise.reject(response.data); //如果响应状态码不等于200且不等于10086，就返回报错的数据在console中打印
    } else {
      return response.data; //否则直接返回响应的数据
    }
  },
  //使用Axios发送请求时，如果请求发生错误，会产生一个error
  (error) => {
    //当source.cancel发起取消请求的时候，会生成一个特定类型的错误对象。axios.isCancel() 方法用于检查给定的错误对象是否是由请求取消而引起的。
    if (axios.isCancel(error)) {
      // 取消请求的情况下，终端Promise调用链
      return new Promise(() => {}); //终止 Promise 调用链，表示不再进行任何请求或响应的操作了。通过返回一个立即解析的空 Promise，它告诉 Promise 调用链在这里终止，不再执行后续的操作。
    } else {
      return Promise.reject(error);
    }
  }
);

export default httpClient;
