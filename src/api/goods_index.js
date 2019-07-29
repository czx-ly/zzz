//这个文件用来处理所有的与商品相关的操作
//引入axios
import axios from "@/utils/myaxios.js";

//获取所有商品的数据
export const getAllGoodsList = params => {
  return axios({
    url: "goods",
    params
  });
};
