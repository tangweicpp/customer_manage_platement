<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="8">
          <img src="../../assets/images/logo.png" alt height="60px" width="60px" />
        </el-col>
        <el-col :span="8">
          <h1>客户管理平台</h1>
        </el-col>
        <el-col :span="8" class="col_r">
          当前用户:{{ userName }}
          <a href="#" @click.prevent="logout">退出</a>
        </el-col>
      </el-row>
    </el-header>

    <el-container>
      <el-aside width="210px">
        <el-menu
          default-active="2"
          :router="true"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="blue"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-sold-out"></i>
              <span>销售部</span>
            </template>
            <el-submenu index="1-1">
              <template slot="title">
                <i class="el-icon-folder"></i>
                <span style="font-size:smaller">订单维护</span>
              </template>

              <el-menu-item index="/po_uploads">
                <i class="el-icon-folder-opened"></i>
                <span style="font-size:smaller">订单上传</span>
              </el-menu-item>
              <el-menu-item index="/po_keyin">
                <i class="el-icon-folder-opened"></i>
                <span style="font-size:smaller">订单KEYIN</span>
              </el-menu-item>
              <el-menu-item index="/po_view">
                <i class="el-icon-folder-opened"></i>
                <span style="font-size:smaller">订单状态管理</span>
              </el-menu-item>
            </el-submenu>
            <el-submenu index="1-2">
              <template slot="title">
                <i class="el-icon-folder"></i>
                <span style="font-size:smaller">来料维护</span>
              </template>
              <el-menu-item index="1-2-1">
                <i class="el-icon-folder-opened"></i>
                <span style="font-size:smaller">来料上传</span>
              </el-menu-item>
              <el-menu-item index="1-2-2">
                <i class="el-icon-folder-opened"></i>
                <span style="font-size:smaller">来料KEYIN</span>
              </el-menu-item>
              <el-menu-item index="1-2-3">
                <i class="el-icon-folder-opened"></i>
                <span style="font-size:smaller">来料状态管理</span>
              </el-menu-item>
            </el-submenu>
            <el-submenu index="1-3">
              <template slot="title">
                <i class="el-icon-folder"></i>
                <span style="font-size:smaller">回货维护</span>
              </template>
              <el-menu-item index="1-3-1">
                <i class="el-icon-folder-opened"></i>
                <span style="font-size:smaller">回货上传</span>
              </el-menu-item>
              <el-menu-item index="1-3-2">
                <i class="el-icon-folder-opened"></i>
                <span style="font-size:smaller">回货KEYIN</span>
              </el-menu-item>
              <el-menu-item index="1-3-3">
                <i class="el-icon-folder-opened"></i>
                <span style="font-size:smaller">回货状态管理</span>
              </el-menu-item>
            </el-submenu>
            <el-submenu index="1-4">
              <template slot="title">
                <i class="el-icon-folder"></i>
                <span style="font-size:smaller">出货维护</span>
              </template>
              <el-menu-item index="1-4-1">
                <i class="el-icon-folder-opened"></i>
                <span style="font-size:smaller">出货上传</span>
              </el-menu-item>
              <el-menu-item index="1-4-2">
                <i class="el-icon-folder-opened"></i>
                <span style="font-size:smaller">出货KEYIN</span>
              </el-menu-item>
              <el-menu-item index="1-4-3">
                <i class="el-icon-folder-opened"></i>
                <span style="font-size:smaller">出货状态管理</span>
              </el-menu-item>
            </el-submenu>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-office-building"></i>
              <span>生产计划</span>
            </template>
            <el-menu-item-group>
              <template slot="title">资料维护</template>
              <el-menu-item index="2-1">订单-工单类型配置</el-menu-item>
              <el-menu-item index="2-2">打标规则维护</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="工单排程">
              <el-menu-item index="2-3">SAP工单下线</el-menu-item>
              <el-menu-item index="2-4">工单状态管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-menu-item index="3">
            <i class="el-icon-more"></i>
            <span slot="title">其他资料</span>
          </el-menu-item>
          <el-menu-item index="4" disabled>
            <i class="el-icon-document"></i>
            <span slot="title">冻结功能</span>
          </el-menu-item>
          <el-menu-item index="5">
            <i class="el-icon-user-solid"></i>
            <span slot="title">用户权限管理</span>
          </el-menu-item>
          <el-menu-item index="6">
            <i class="el-icon-setting"></i>
            <span slot="title">系统设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- router出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      userName: "",
    };
  },
  created() {
    this.userName = localStorage.getItem("userName");
    if (this.userName == null || this.userName == "" || this.userName == undefined) {
      // 2.跳转到Login页
      this.$router.push("/login");
    }
    // console.log("获取的用户名:", this.userName);
  },
  methods: {
    // 展开
    handleOpen() {
      console.log("展开");
    },
    handleClose() {
      console.log("关闭");
    },
    // 退出
    logout() {
      // 确认框
      this.$confirm("此操作将退出该账户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 1.提示
          this.$message({
            type: "success",
            message: "退出成功!",
            duration: 800,
          });
          // 2.跳转到Login页
          this.$router.push("/login");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出",
            duration: 800,
          });
        });
    },
  },
};
</script>

<style scoped>
/* 外部容器 */
.el-container {
  height: 100%;
  min-width: 900px;
}
/* 头部 */
.el-header {
  background: #b3c1cd;
  /* 去除空余部分 */
  padding: 0;
}

/* 头部标题 */
h1 {
  color: rgba(255, 255, 255, 0.973);
  /* 居中 */
  text-align: center;
  line-height: 60px;
  font-size: 30px;
}

.col_r {
  text-align: right;
  line-height: 60px;
  padding-right: 30px;
}

.col_r a {
  color: blue;
}

/* 侧栏 */
.el-aside {
  background: #545c64;
}
/* 主体 */
.el-main {
  background: #eaeef1;
}

.el-menu-item.is-active {
  background: #f377b4 !important;
}
</style>