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
//获取用户数据
export const getAllUserList = params => {
  return axios({
    url: "users",
    params
  });
};

//添加用户
export const addUser = data => {
  return axios({
    url: "users",
    method: "post",
    data
  });
};

//编辑用户
export const ediUser = data => {
  return axios({
    url: `users/${data.id}`,
    method: "put",
    data: { email: data.email, mobile: data.mobile }
  });
};
//根据id来删除用户
export const delUserById = id => {
  return axios({
    url: `users/${id}`,
    method: "delete"
  });
};

//根据id修稿用户的状态
export const updateUserState = (uid, type) => {
  return axios({
    url: `users/${uid}/state/${type}`,
    method: "put"
  });
};
//分配用户角色
export const grantUserRole = data => {
  return axios({
    url: `users/${data.id}/role`,
    method: "put",
    data: { rid: data.rid }
  });
};
