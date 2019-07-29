//这个文件是来处理所有和权限相关的操作
import axios from "@/utils/myaxios.js";

//获取所有权限数据
export const getAllRightList = type => {
  return axios({
    url: `rights/${type}`
  });
};

//获取左边菜单权限
export const getLeftMenu = () => {
  return axios({
    url: "menus"
  });
};
