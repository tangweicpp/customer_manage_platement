<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="普通上传" name="first">
        <!-- 转换-上传选项  -->
        <el-form
          :inline="true"
          :model="poForm"
          class="demo-form-inline"
          ref="poForm"
          :rules="rules"
        >
          <el-form-item label="客户代码" prop="custCode">
            <el-select
              v-model="poForm.custCode"
              placeholder="请选择"
              filterable
              clearable
              @change="handleCustCodeChange"
              ref="selCustCode"
            >
              <el-option
                v-for="item in custCodeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="订单类型" prop="poType">
            <el-select
              v-model="poForm.poType"
              placeholder="请选择"
              filterable
              clearable
              @change="poItemChange"
              ref="selPoType"
            >
              <el-option
                v-for="item in poTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="报价单号" prop="poPrice">
            <el-input
              v-model="poForm.poPrice"
              clearable
              placeholder="请输入内容"
              :disabled="!this.rules.poPrice[0].required"
            ></el-input>
          </el-form-item>
          <el-form-item prop="isDelay">
            <el-checkbox v-model="poForm.isDelay" @change="poItemChange">延长账期</el-checkbox>
          </el-form-item>
          <el-form-item prop="delayDays">
            <div v-if="poForm.isDelay === true">
              <el-input v-model="poForm.delayDays" placeholder="请输入延长的天数"></el-input>
            </div>
            <div v-else>
              <el-input v-model="poForm.delayDays" placeholder="请输入延长的天数" disabled></el-input>
            </div>
          </el-form-item>
        </el-form>
        <el-divider content-position="left">文件上传</el-divider>

        <!-- 2.模板文件上传 -->
        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="序号" width="180">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="模板文件(可下载)" width="180">
            <template slot-scope="scope">
              <el-link
                :href="scope.row.file_url"
                target="_blank"
                type="primary"
              >{{scope.row.file_name}}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="模板示意(可参考)" width="180">
            <template slot-scope="scope">
              <el-popover trigger="focus" placement="top">
                <img :src="scope.row.img_url" />
                <img
                  slot="reference"
                  :src="scope.row.img_url"
                  alt
                  style="max-height: 50px;max-width: 130px"
                />
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="关键字段">
            <template slot-scope="scope">
              <el-tag size="medium">{{ scope.row.file_key }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="文件层级">
            <template slot-scope="scope">
              <div v-if="scope.row.level === 'primary'">
                <el-tag size="medium" type="danger" effect="dark">{{ scope.row.level }}</el-tag>
              </div>
              <div v-else-if="scope.row.level === 'secondary'">
                <el-tag size="medium" type="info" effect="dark">{{ scope.row.level }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="上传文件">
            <template slot-scope="scope">
              <el-upload
                class="upload-demo"
                ref="upload"
                name="poFile"
                :data="poForm"
                :disabled="authenStatus==0?true:false"
                :accept="scope.row.accept"
                action="http://10.160.31.115:5000/upload_po_file"
                :limit="1"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-exceed="handleExceed"
                :file-list="fileList"
              >
                <el-button
                  slot="trigger"
                  size="small"
                  type="success"
                  @click="handleUpload(scope.row)"
                >选取文件</el-button>
              </el-upload>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="模板配置" name="second">模板配置</el-tab-pane>
      <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs>

    <!-- <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>-->
  </div>
</template>
<script>
export default {
  data() {
    return {
      selFile: "",
      authenStatus: 1,
      // dialogVisible: false,
      activeName: "first",
      rules: {
        custCode: [
          { required: true, message: "请选择客户代码", trigger: "blur" }
        ],
        poType: [
          { required: true, message: "请选择订单类型", trigger: "blur" }
        ],
        poPrice: [
          {
            required: false,
            message: "请填写报价单号",
            trigger: "blur"
          },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        delayDays: [
          {
            required: false,
            message: "请输入延期天数",
            trigger: "blur"
          }
        ]
      },
      poForm: {
        custCode: "",
        poType: "普通销售订单",
        poPrice: "",
        isDelay: false,
        delayDays: ""
      },
      custCodeList: [],
      poTypeList: [
        { value: "普通销售订单", label: "普通销售订单" },
        { value: "工程批订单", label: "工程批订单" },
        { value: "RMA收费订单", label: "RMA收费订单" },
        { value: "RMA免费订单", label: "RMA免费订单" },
        { value: "免费订单", label: "免费订单" }
      ],
      tableData: [],

      fileList: []
    };
  },
  // 创建钩子函数
  created() {
    this.$axios.get("http://10.160.31.115:5000/cust_list").then(res => {
      console.log(res.data);
      this.custCodeList = res.data;
    });
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    handleCustCodeChange() {
      // 获取客户资料
      this.$axios
        .post(
          "http://10.160.31.115:5000/po_template",
          this.$qs.stringify({
            custcode: this.poForm.custCode
          })
        )
        .then(res => {
          console.log(res.data);
          this.tableData = res.data;
        });

      // 清除上传列表
      // this.$refs.upload.clearFiles();
      this.fileList = [];
    },
    handleUpload(row) {
      console.log(row);
      this.poForm["url"] = row.file_name;
      this.$refs.poForm.validate(vallid => {
        if (!vallid) {
          this.authenStatus = 0;
        } else {
          this.authenStatus = 1;
        }
      });
      // if (this.poForm.poType == "") {
      //   alert("请选择订单类型");
      //   this.authenStatus = 0;
      // } else {
      //   this.authenStatus = 1;
      // }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleClose(file) {
      console.log("close");
    },
    handlePreview(file) {
      console.log(file);
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    poItemChange() {
      console.log("PO ITEM变化");

      if (this.poForm.isDelay) {
        this.rules.delayDays[0].required = true;
      } else {
        this.rules.delayDays[0].required = false;
      }

      if (this.poForm.poType === "RMA收费订单") {
        this.rules.poPrice[0].required = true;
      } else {
        this.rules.poPrice[0].required = false;
      }
    }
  }
};
</script>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>