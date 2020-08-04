<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="订单查询" name="first"></el-tab-pane>
      <el-tab-pane label="订单修改" name="second"></el-tab-pane>
      <el-tab-pane label="订单删除" name="third">
        <el-form :inline="true" class="demo-form-inline" :model="formData">
          <el-form-item label="客户代码" prop="custCode">
            <el-input clearable placeholder="请输入内容" v-model="formData.custCode"></el-input>
          </el-form-item>
          <el-form-item label="客户LOTID" prop="custLotID">
            <el-input clearable v-model="formData.custLotID" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="queryData">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="info">删除</el-button>
          </el-form-item>
        </el-form>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="font-size: 10px"
          row-style="height:20px"
          cell-style="padding:0"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="客户代码" width="120">
            <template slot-scope="scope">{{ scope.row.cust_code }}</template>
          </el-table-column>
          <el-table-column prop="cust_pn" label="客户机种" show-overflow-tooltip></el-table-column>

          <el-table-column label="客户lot" width="120">
            <template slot-scope="scope">{{ scope.row.lot_id }}</template>
          </el-table-column>

          <el-table-column prop="wafer_id" label="waferid" show-overflow-tooltip></el-table-column>
          <el-table-column prop="is_worked" label="是否开工单" show-overflow-tooltip></el-table-column>
          <el-table-column prop="upload_id" label="上传ID" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "first",
      formData: {
        custCode: "",
        custLotID: "",
        custWaferID: "",
        custPOID: "",
        createBy: "",
        createDate: "",
      },
      tableData: [],
      multipleSelection: [],
    };
  },
  created() {
    let userName = localStorage.getItem("userName");
    if (userName == null || userName == "" || userName == undefined) {
      this.$router.push("/login");
      return false;
    }
  },
  methods: {
    queryData() {
      if (this.formData.custCode === "" && this.formData.custLotID === "") {
        this.$message({
          message: "请输入查询条件",
          type: "error",
          duration: 500,
        });
        return false;
      }
      console.log("点击查询按钮");

      this.$axios
        .get(this.$Api.globalUrl + "/query_po_data", {
          params: this.formData,
        })
        .then((res) => {
          this.tableData = res.data.info;
        });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>

<style scoped>
</style>

