<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区域 -->
    <div style="margin: 15px 0;">
      <el-input
        placeholder="请输入内容"
        v-model="userobj.query"
        class="input-with-select"
        style="width:300px;margin-right:10px"
        @keyup.enter.native="init"
      >
        <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
      </el-input>
      <el-button type="success" plain @click="adddialogFormVisible =true">添加用户</el-button>
    </div>
    <!-- 表格数据展示 -->
    <el-table :data="userList" style="width: 100%" border>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeState(scope.row.id,scope.row.mg_state)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="primary" icon="el-icon-d-caret" @click="showGrantDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete" @click="del(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userobj.pagenum"
      :page-sizes="[1,2,3,4]"
      :page-size="userobj.pagesize"
      layout="total, sizes, prev, pager,next,jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="adddialogFormVisible">
      <el-form :model="addform" ref="addform" :label-width="'80px'" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addform.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addform.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addform.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addform.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adddialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addsubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editdialogFormVisible">
      <el-form :model="editform" ref="editform" :label-width="'80px'" :rules="rules">
        <el-form-item label="用户名">
          <el-input v-model="editform.username" auto-complete="off" disabled style="width:100px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editform.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editform.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editsubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色对话框 -->

    <el-dialog title="分配角色" :visible.sync="grantdialogFormVisible">
      <el-form :model="grantform" :label-width="'80px'">
        <el-form-item label="用户名:">
          <span>{{grantform.username}}</span>
        </el-form-item>
        <el-form-item label="角色:">
          <el-select v-model="grantform.rid" clearable placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantrole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllUserList,
  addUser,
  editUser,
  delUserById,
  updateUserState,
  grantUserRole
} from "@/api/user_index.js";
import { getAllRolelist } from "@/api/role_index.js";
export default {
  data() {
    return {
      roleList: [],
      grantform: {
        id: "",
        rid: "",
        username: "jack"
      },
      grantdialogFormVisible: false,
      editdialogFormVisible: false,
      editform: {
        id: "",
        username: "",
        email: "",
        mobile: ""
      },
      adddialogFormVisible: false,
      //添加用户所对应的数据对象
      addform: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      total: 0,

      //搜索用户的关键字
      userobj: {
        query: "",
        pagenum: 1,
        pagesize: 4
      },
      //表格数据源，他是一个数组，里面的每个元素都是对象
      userList: [],
      //表单验证
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          //添加邮箱的验证规则
          {
            pattern: /\w+[@]\w+[.]\w+/,
            message: "请输入合法的电子邮箱",
            trigger: "blur"
          }
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号码",
            trigger: "blur"
          },
          {
            pattern: /^1\d{10}$/,
            message: "请输入合法的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    //展示分配角色对话框
    showGrantDialog(row) {
      this.grantdialogFormVisible = true;
      this.grantform.id = row.id;
      this.grantform.username = row.username;
      this.grantform.rid = row.rid;
    },
    //分配角色
    async grantrole() {
      if (!this.grantform.rid) {
        this.$message({
          type: "warning",
          message: "请选择一个角色"
        });
      } else {
        let res = await grantUserRole(this.grantform);
        if (res.data.meta.status === 200) {
          this.$message({
            type: "success",
            message: "角色设置成功"
          });
          this.grantdialogFormVisible = false;
          this.init();
        }
      }
    },
    //修改用户的状态
    async changeState(id, type) {
      let res = await updateUserState(id, type);
      if (res.data.meta.status === 200) {
        this.$message({
          type: "success",
          message: "状态修改成功"
        });
      }
    },
    //根据id来删除数据
    del(id) {
      this.$confirm(
        `这个操作会永久删除id号为${id}的用户，是否真的删除?`,
        "删除提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          //如果是确定删除就执行这里
          delUserById(id)
            .then(res2 => {
              if (res2.data.meta.status === 200) {
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
                //如果执行到这个，说明已经成功删除了，但是没有刷新
                //用三元表达式
                this.userobj.pagenum = Math.ceil(
                  (this.total - 1) / this.userobj.pagesize
                )
                  ? --this.userobj.pagenum
                  : this.userobj.pagenum;
                this.init();
              }
            })
            .catch(err2 => {
              console.log(err2);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已经取消"
          });
        });
    },
    //编辑提交
    async editsubmit() {
      //await  必须写在async函数内的
      let res = await editUser(this.editform);
      console.log(res);
      if (res.data.meta.status === 200) {
        this.$message({
          type: "success",
          message: "数据编辑成功"
        });
        //影藏对话框
        this.editdialogFormVisible = false;
        //重置表单元素的数据
        this.$refs.editform.resetFields();
        this.init();
      } else {
        this.$message({
          type: "error",
          message: "数据编辑失败"
        });
      }
    },
    //显示编辑的对话框
    showEditDialog(row) {
      this.editdialogFormVisible = true;
      this.editform.id = row.id;
      this.editform.username = row.username;
      this.editform.email = row.email;
      this.editform.mobile = row.mobile;
    },
    //添加用户
    addsubmit() {
      //对表单元素的数据进行验证
      this.$refs.addform.validate(valid => {
        if (valid) {
          //要调用接口
          addUser(this.addform)
            .then(res => {
              console.log(res);
              if (res.data.meta.status === 201) {
                this.$message({
                  type: "success",
                  message: "数据添加成功"
                });
                //影藏对话框
                this.adddialogFormVisible = false;
                //重置表单元素的数据
                this.$refs.addform.resetFields();
                //刷新
                this.init();
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          this.$message({
            type: "error",
            message: "数据输入的不合法"
          });
          return false;
        }
      });
    },

    //切换每页数量时触发
    handleSizeChange(val) {
      //修改全局的pagesize
      this.userobj.pagesize = val;
      //重新获取数据
      this.init();
    },
    //切换当前页面时候触发
    handleCurrentChange(val) {
      //修改全局的pagenum
      this.userobj.pagenum = val;
      //重新获取数据
      this.init();
    },
    //数据初始化
    init() {
      getAllUserList(this.userobj)
        .then(res => {
          console.log(res);
          if (res.data.meta.status === 200) {
            this.userList = res.data.data.users;
            //获取总数
            this.total = res.data.data.total;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取所有角色的数据
    async roleListInit() {
      let res = await getAllRolelist();

      this.roleList = res.data.data;
    }
  },
  mounted() {
    this.init();
    this.roleListInit();
  }
};
</script>

<style lang="less" scoped>
</style>










  