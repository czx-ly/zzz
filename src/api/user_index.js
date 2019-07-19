//这个文件用来处理所有用户相关的操作
//引入axios
import axios from "@/utils/myaxios.js";

//登录
export const login = data => {
  //axios 会返回一个promise 对象
  return axios({
    //路径
    url: "login",
    //请求方式。默认为get
    method: "post",
    //post 方式所传递的数据
    data
  });
};
