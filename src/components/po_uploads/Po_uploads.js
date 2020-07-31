export default {
  data() {
    return {
      activeName: "first",
      // 1.普通上传
      uploadUrl: this.$Api.globalUrl + "/upload_po_file",
      btnDisable: false,
      authenStatus: 1,
      gridDataTotal: [],
      gridDataDetail: [],
      innerVisible: false,
      outerVisible: false,
      timer: {},

      formData: {
        userName: "",
        custCode: "",
        poType: "普通销售订单",
        bondedType: "",
        offerSheet: "",
        needDelay: false,
        delayDays: "",
        needMailTip: false,
        mailTip: "",
        fileID: ""
      },
      formItemCustCode: [],
      formItemPOType: [
        { value: "普通销售订单", label: "普通销售订单" },
        { value: "工程批订单", label: "工程批订单" },
        { value: "RMA收费订单", label: "RMA收费订单" },
        { value: "RMA免费订单", label: "RMA免费订单" },
        { value: "免费订单", label: "免费订单" }
      ],
      formItemBonded: [
        { value: "保税", label: "保税" },
        { value: "非保税", label: "非保税" }
      ],
      tableData: [],

      fileList: [],
      rules: {
        custCode: [
          { required: true, message: "请选择客户代码", trigger: "blur" }
        ],
        poType: [
          { required: true, message: "请选择订单类型", trigger: "blur" }
        ],
        bondedType: [
          {
            required: true,
            message: "请选择保税类型",
            trigger: "blur"
          }
        ],
        mailTip: [
          { required: false, message: "请填写邮件正文提醒", trigger: "blur" }
        ],
        offerSheet: [
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

      // 2.模板配置
      fileNum: 1,
      poTemplate: { custCode: "", poType: "普通销售订单" },
      tableData2: [],
    };
  },
  created() {
    this.formData.userName = localStorage.getItem("userName")
    if (this.formData.userName == null || this.formData.userName == "" || this.formData.userName == undefined) {
      this.$router.push("/login");
      return false;
    }

    this.$axios.get(this.$Api.globalUrl + "/cust_code_list").then(res => {
      if (res.status === 200) {
        this.formItemCustCode = res.data;
      }
    });
  },
  methods: {
    handleClickTabs(tab, event) {
      // console.log(tab, event);
    },
    getCustPOTemplate() {
      // 发送请求
      this.$axios
        .post(
          this.$Api.globalUrl + "/po_template",
          this.$qs.stringify({
            custCode: this.formData.custCode
          })
        )
        .then(res => {
          if (res.status === 200) {
            this.tableData = res.data;
          }
        }).catch(function (error) {
          console.log(error);
        });

      // 清除上传列表
      this.fileList = [];
    },

    // 点击上传入口
    handleClickUpload(row) {
      this.formData.fileID = row.file_id;
      this.$refs.formData.validate(vallid => {
        if (!vallid) {
          this.authenStatus = 0;
        } else {
          this.authenStatus = 1;
          this.fileList = [];
          row.show_filelist_flag = false;
          row.load_progress = 0;
        }
      });
    },
    handleBeforeupload() {
      console.log("before upload");
      // 判断文件大小
      this.btnDisable = true;
    },
    handleProgress(event, file, fileList, row) {
      console.log("handleProgress");
      row.show_progress_flag = true;
      let key = row.file_id;
      this.timer[key] = setInterval(this.updateLoadProgress, 300, row);
    },
    updateLoadProgress(row) {
      this.$axios
        .get(this.$Api.globalUrl + "/update_progress?userKey=" + row.file_id)
        .then(res => {
          row.load_progress = parseInt(res.data.progress);

          if (row.load_progress >= 100) {
            let key = row.file_id;
            clearInterval(this.timer[key]);
            delete this.timer[key];
          }
        });
    },
    handleChange(files, fileList) {
      console.log("handleChange");

    },
    handleSuccess(res, file, fileList, row) {
      console.log("handleSuccess", res);
      this.btnDisable = false;
      if (res.status === 201) {
        // 1.错误提示
        this.$message({
          message: res.err_desc,
          type: "error",
          duration: 2000
        });
        // 2.delete timer
        let key = row.file_id.toString();
        clearInterval(this.timer[key]);
        console.log("delete timer")
        delete this.timer[key];

        // 3.delete filelist
        this.fileList = [];

        return false
      }

      row.load_progress = 100;
      // 0.delete timer
      let key = row.file_id.toString();
      clearInterval(this.timer[key]);
      console.log("delete timer")
      delete this.timer[key];
      // 1.成功提示
      this.$message({
        message: "订单上传成功",
        type: "success",
        duration: 800
      });

      this.outerVisible = true;
      row.show_filelist_flag = true;
      row.show_progress_flag = false;
      this.gridDataTotal = res.data.total_data;
      this.gridDataDetail = res.data.detail_data;
    },
    handleError(err, file, fileList, row) {
      console.log("handleError");
      console.log("文件上传失败")
      this.btnDisable = false;
      row.load_progress = 0;
      // 1.delete timer
      let key = row.file_id.toString();
      clearInterval(this.timer[key]);
      delete this.timer[key];
      // 2.delete filelist
      this.fileList = [];
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
      if (this.formData.needDelay) {
        this.rules.delayDays[0].required = true;
      } else {
        this.rules.delayDays[0].required = false;
      }

      if (this.formData.needMailTip) {
        this.rules.mailTip[0].required = true;
      } else {
        this.rules.mailTip[0].required = false;
      }

      if (this.formData.poType === "RMA收费订单") {
        this.rules.offerSheet[0].required = true;
      } else {
        this.rules.offerSheet[0].required = false;
      }
    }
    // handleChange(value) {
    //   console.log(value);
    //   console.log(this.fileNum);
    //   if (value > this.tableData2.length) {
    //     this.tableData2.push({});
    //   } else {
    //     this.tableData2.pop();
    //   }
    // }
  }
};