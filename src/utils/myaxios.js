//这个文件封装axios 相关的配置
import axios from "axios";

//设置基准路径
axios.defaults.baseURL = "http://localhost:8888/api/private/v1";

//添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    //在发送请求之前应该通过请求头的方式传递token数据，并且传递的时候键必须设置为Authorization
    //获取token
    var token = localStorage.getItem("itcast_manage_34_token");
    if (token) {
      //通过请求头的方式设置token的传递，通过config获取到请求头
      config.headers["Authorization"] = token;
    }
    return config;
  },
  function(error) {
    //对请求错误做些什么
    return Promise.reject(error);
  }
);

export default axios;
