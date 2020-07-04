<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="普通上传" name="first">
        <!-- 分割线 -->
        <!-- <el-divider></el-divider> -->
        <!-- <el-divider content-position="left">上传资料</el-divider> -->

        <!-- 2.上传 -->
        <!-- <el-upload
          class="upload-demo"
          ref="upload"
          action="http://10.160.31.115:80/comments/index.php"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload"
          >上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">上传客户订单excel\pdf</div>
        </el-upload>-->
        <!-- 分割线 -->
        <!-- <el-divider></el-divider> -->
        <!-- 转换-上传选项  -->
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="客户代码">
            <el-select
              v-model="custcode"
              disabled
              placeholder="请选择"
              filterable
              clearable
              ref="selcustcode"
            >
              <el-option
                v-for="item in custcodeData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
              <!-- <el-option label="57" value="57"></el-option> -->
            </el-select>
          </el-form-item>

          <el-form-item label="订单类型">
            <el-select v-model="sotype" placeholder="请选择" filterable clearable ref="selsotype">
              <el-option
                v-for="item in sotypeData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="报价单号">
            <el-select
              disabled
              v-model="sotype"
              placeholder="请输入"
              filterable
              clearable
              ref="selsotype"
            >
              <el-option
                v-for="item in sotypeData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>-->
          <el-form-item>
            <el-checkbox v-model="checked">是否延长账期</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button
              style="margin-left: 30px"
              size="medium"
              type="primary"
              @click="submitUpload"
            >转换/上传</el-button>
          </el-form-item>
        </el-form>
        <el-divider></el-divider>

        <!-- 入口文件上传 -->
        <el-upload
          class="upload-demo"
          drag
          action="http://10.160.31.115:5000/upload"
          multiple
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip" style="color:red">上传包含客户代码的文件</div>
        </el-upload>

        <el-divider></el-divider>
        <!-- 2.模板文件上传 -->
        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="序号" width="180">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="模板文件" width="180">
            <template slot-scope="scope">
              <!-- <el-link href="https://element.eleme.io" target="_blank" type="primary">{{ss.row.name}}</el-link> -->
              <el-link
                :href="scope.row.file_url"
                target="_blank"
                type="primary"
              >{{scope.row.file_name}}</el-link>

              <!-- 悬浮提示 -->
              <!-- <el-popover trigger="hover" placement="top">
                <p>姓名: {{ ss.row.name }}</p>
                <p>住址: {{ ss.row.address }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ ss.row.name }}</el-tag>
                </div>
              </el-popover>-->
            </template>
          </el-table-column>
          <el-table-column label="模板示意" width="180">
            <template slot-scope="scope">
              <el-popover trigger="focus" placement="top">
                <!-- <p>姓名: {{ ss.row.name }}</p>
                <p>住址: {{ ss.row.address }}</p>-->

                <img :src="scope.row.img_url" />
                <img
                  slot="reference"
                  :src="scope.row.img_url"
                  alt
                  style="max-height: 50px;max-width: 130px"
                />
                <!-- 
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ ss.row.name }}</el-tag>
                </div>-->
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="关键字段">
            <template slot-scope="scope">
              <!-- <el-link type="primary" @click.prevent="dialogVisible = true">客户订单链接</el-link> -->
              <!-- <el-input v-model="ss.row.content"></el-input> -->

              <el-tag size="medium">{{ scope.row.file_key }}</el-tag>
              <!-- <input type="text" /> -->
            </template>
          </el-table-column>
          <el-table-column label="文件层级">
            <template slot-scope="scope">
              <!-- <el-link type="primary" @click.prevent="dialogVisible = true">客户订单链接</el-link> -->
              <!-- <el-input v-model="ss.row.content"></el-input> -->

              <el-tag size="medium" :type="scope.row.type" effect="dark">{{ scope.row.level }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="上传进度">
            <template slot-scope="scope">
              <!-- <el-button size="mini" @click="handleEdit(ss.$index, ss.row)">编辑</el-button>
              <el-button size="mini" @click="handleEdit(ss.$index, ss.row)">提交</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(ss.$index, ss.row)">删除</el-button>-->

              <el-upload
                class="upload-demo"
                :accept="scope.row.accept"
                ref="upload"
                action="http://10.160.31.115:80/comments/index.php"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                :auto-upload="false"
              >
                <el-button slot="trigger" size="small" type="success">选取文件</el-button>
                <!-- <el-button
                  style="margin-left: 10px;"
                  size="small"
                  type="success"
                  @click="submitUpload"
                >上传到服务器</el-button>-->
              </el-upload>
            </template>
          </el-table-column>
        </el-table>
        <!-- <div style="text-align:center"> -->
      </el-tab-pane>
      <el-tab-pane label="模板配置" name="second">模板配置</el-tab-pane>
      <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      input: "",
      checked: false,
      dialogVisible: false,
      activeName: "first",
      // 0.客户代码,订单类型
      custcode: "",
      custcodeData: [
        { value: "37", label: "37" },
        { value: "57", label: "57" },
        { value: "GD108", label: "GD108" },
        { value: "AA", label: "AA" }
      ],
      sotype: "",
      sotypeData: [
        { value: "普通销售订单", label: "普通销售订单" },
        { value: "工程批订单", label: "工程批订单" },
        { value: "RMA收费订单", label: "RMA收费订单" },
        { value: "RMA免费订单", label: "RMA免费订单" },
        { value: "免费订单", label: "免费订单" }
        // PC负责
        // { value: "厂内重工免费订单", label: "厂内重工免费订单" },
        // { value: "陪片订单", label: "陪片订单" }
      ],
      // 1.列表数据
      tableData: [
        {
          file_name: "AA map.xml",
          file_url: "./static/file/1.xlsx",
          file_key: "晶圆批号|waferID|良品DIE数量|不良品DIE数量",
          progress: "100%",
          accept: "text/xml, application/xml",
          level: "primary",
          type: "danger",
          img_url: "./static/pic/AA_MAP.png"
        },
        {
          file_name: "AA BC.xls",
          file_url: "./static/file/1.xlsx",
          file_key: "晶圆批号|晶圆机种",
          progress: "100%",
          accept: "application/vnd.ms-excel",
          level: "secondary",
          type: "info",
          img_url: "./static/pic/AA_MAP.png"
        },
        {
          file_name: "AA FEDS.xls",
          file_url: "./static/file/1.xlsx",
          file_key: "晶圆机种|半成品机种|成品机种",
          progress: "100%",
          accept: "application/vnd.ms-excel",
          level: "secondary",
          type: "info",
          img_url: "./static/pic/AA_MAP.png"
        }
        // {
        //   name: "客户订单.xlsx",
        //   address: "./static/file/592690.pdf",
        //   content: "客户代码,客户机种,FAB机种",
        //   progress: "100%",
        //   accept:
        //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        // },
        // {
        //   name: "客户订单.csv",
        //   address: "./static/file/README.md",
        //   content: "客户代码,客户机种,FAB机种",
        //   progress: "100%",
        //   accept: ".csv"
        // },
        // {
        //   name: "客户订单.pdf",
        //   address: "./static/file/1.xlsx",
        //   content: "客户代码,客户机种,FAB机种",
        //   progress: "100%",
        //   accept: ".pdf"
        // }
      ],
      sizeForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formInline: {
        user: "",
        region: ""
      },
      fileList: [
        // {
        //   name: "food.jpeg",
        //   url:
        //     "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        // },
        // {
        //   name: "food2.jpeg",
        //   url:
        //     "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        // }
      ]
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    onSubmit() {
      // console.log(this.$refs);
      console.log(this.$refs.selcustcode.value);
      console.log("submit!");
    },
    submitUpload() {
      this.$refs.upload.submit();
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