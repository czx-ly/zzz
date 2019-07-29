<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- //添加角色按钮 -->
    <el-button type="primary" style="margin:10px 0" @click="adddialogFormVisible = true">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="roleList" style="width: 100%" border>
      <!-- type:expand:说明这些后期可以展开，或者合并。
      展开行可以访问的属性与使用自定义模板，scoped slot 相同-->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 准备进行嵌套循环生成展开数据显示的结构 -->
          <el-row
            v-for="first in scope.row.children"
            :key="first.id"
            style="margin-bottom:10px;
             border-bottom:1px dashed #ccc"
          >
            <el-col :span="4">
              <el-tag
                closable
                type="success"
                @close="delRightById(scope.row,first.id)"
              >{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="second in first.children" :key="second.id" style="magin-bottom:10px">
                <el-col :span="4">
                  <el-tag
                    closable
                    type="info"
                    @close="delRightById(scope.row,second.id)"
                  >{{second.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    type="warning"
                    v-for="third in second.children"
                    :key=" third.id"
                    style="magin:0px 10px 5px 0px"
                    @close="delRightById(scope.row,third.id)"
                  >{{third.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" v-show="scope.row.children.length==0">没有任何权限。请先分配</el-col>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="角色授权" placement="top">
            <el-button type="primary" icon="el-icon-d-caret" @click="showGrantDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色授权对话框 -->
    <el-dialog title="角色授权" :visible.sync="grantdialogFormVisible">
      <el-tree
        red="mytree"
        :data="rightList"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="checkedArr"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantdialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="grantSubmit">确定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="adddialogFormVisible">
      <el-form :model="addForm" :lable-widtn="'100px'">
        <el-form-item label="角色名称">
          <el-input v-model="addForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描诉">
          <el-input v-model="addForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adddialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addRoleSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAllRolelist,
  delRightByRoleId,
  grantRightById,
  addRole
} from "@/api/role_index.js";
import { getAllRightList } from "@/api/right_index.js";
export default {
  data() {
    return {
      adddialogFormVisible: false,
      addForm: {
        roleName: "",
        roleDesc: ""
      },
      roleId: "",
      grantdialogFormVisible: false,
      checkedArr: [],
      roleList: [],
      rightList: [],
      defaultProps: {
        children: "children",
        label: "authName"
      }
    };
  },
  methods: {
    //新增角色
    async addRoleSubmit() {
      let res = await addRole(this.addForm);
      console.log(res);
      if (res.data.meta.status === 201) {
        this.$message({
          type: "success",
          message: res.data.meta.msg
        });
        this.adddialogFormVisible = false;
        this.roleInit();
      }
    },
    //实现角色权限的分配提交
    async grantSubmit() {
      var arr = this.$refs.mytree.getCheckedodes();

      //遍历数组，进行数据的拼接
      var temp = [];
      arr.forEach(item => {
        temp.push(item.id + "," + item.pid);
      });

      //将获取到的数组进行拼接
      var tempstr = temp.join(",");

      //将字符串转换成数组
      var temparr = tempstr.split(",");
      //数组去重
      var finalarr = [...new Set(temparr)];
      //调用接口方法实现权限的分配
      let res = await grantRightById(this.roleId, finalarr.join(","));

      if (res.data.meta.status === 200) {
        this.$message({
          type: "success",
          message: res.data.meta.msg
        });
        this.grantdialogFormVisible = false;
        this.roleInit();
      }
    },
    //打开授权角色对话框
    async showGrantDialog(row) {
      this.grantdialogFormVisible = true;
      // 存储当前角色id,方便后期进行权限分配提交时的获取
      this.roleId = row.id;
      // 进行所有权限数据的获取
      let res = await getAllRightList("tree");
      console.log(row);
      this.rightList = res.data.data;
      // 获取当前角色的权限id
      // 先清空之前的数组中的存储的id
      this.checkedArr.length = 0;
      if (row.children && row.children.length > 0) {
        row.children.forEach(first => {
          if (first.children && first.children.length > 0) {
            first.children.forEach(second => {
              if (second.children && second.children.length > 0) {
                second.children.forEach(third => {
                  // 添加id到数组
                  this.checkedArr.push(third.id);
                });
              }
            });
          }
        });
      }
    },
    //删除指定角色的指定权限
    async delRightById(row, rightId) {
      let res = await delRightByRoleId(row.id, rightId);
      console.log(res);
      if (res.data.meta.status === 200) {
        this.$message({
          type: "success",
          $message: res.data.msg
        });
        row.children = res.data.data;
      }
    },
    //角色数据的变化
    async roleInit() {
      let res = await getAllRolelist();
      this.roleList = res.data.data;
      console.log(res);
    }
  },
  mounted() {
    this.roleInit();
  }
};
</script>
<style lang="less" scoped>
</style>




