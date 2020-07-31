<template>
  <el-row type="flex" justify="center" align="middle">
    <el-col :span="6">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入密码" v-model="ruleForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-preventReClick @click="startLogin">登录</el-button>
          <el-button plain @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
// 引入axios
// import axios from "axios";
// 引入qs
// import qs from "qs";

// Vue.prototype.$qs = qs;

export default {
  data() {
    return {
      ruleForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
        ],
      },
    };
  },
  // 创建钩子函数
  created() {
    // 注册回车登录
    var _self = this;
    document.onkeydown = function (e) {
      var key = window.event.keyCode;
      if (key == 13 || key == 100) {
        _self.startLogin();
      }
    };
  },
  methods: {
    startLogin() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(this.$Api);
          this.$axios
            .post(
              this.$Api.globalUrl + "/login",
              this.$qs.stringify(this.ruleForm)
            )
            .then((res) => {
              if (res.status === 200) {
                // 0.Save
                localStorage.setItem("userName", this.ruleForm.username);

                // 1.成功提示
                this.$message({
                  message: "登录成功",
                  type: "success",
                  duration: 800,
                });

                // 2.跳转到home页
                this.$router.push("/home");
              } else {
                this.$message({
                  message: res.data,
                  type: "error",
                  duration: 800,
                });
              }
            });
        } else {
          this.$message({
            message: "请输入账号和密码",
            type: "error",
            duration: 800,
          });
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
  },
};
</script>

<style scoped>
.el-row {
  height: 100%;
  background: #2d435c;
}

.el-col {
  background: #fff;
  padding: 20px 30px;
  border-radius: 15px;
}
</style>