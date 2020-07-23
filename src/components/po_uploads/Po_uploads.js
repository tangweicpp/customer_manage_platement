export default {
  data() {
    return {
      activeName: "first",
      // 1.普通上传
      btnEnable: false,
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
    this.$axios.get("http://10.160.31.115:5000/cust_list").then(res => {
      this.formItemCustCode = res.data;
    });
    this.formData.userName = localStorage.getItem("userName")
    if (this.formData.userName == null || this.formData.userName == "" || this.formData.userName == undefined) {
      this.$router.push("/login");
    }
  },
  methods: {
    handleClickTabs(tab, event) {
      // console.log(tab, event);
    },
    getCustPOTemplate() {
      this.$axios
        .post(
          "http://10.160.31.115:5000/po_template",
          this.$qs.stringify({
            custcode: this.formData.custCode
          })
        )
        .then(res => {
          this.tableData = res.data;
        });

      // 清除上传列表
      this.fileList = [];
    },

    // 点击上传入口
    handleClickUpload(row) {
      this.formData.fileID = row.file_id.toString();
      this.$refs.formData.validate(vallid => {
        if (!vallid) {
          this.authenStatus = 0;
          console.log(row);
        } else {
          this.authenStatus = 1;
          this.fileList = [];
          row.show_filelist_flag = false;
          row.load_progress = 0;
        }
      });
    },
    handleBeforeupload() {
      // console.log("before upload");
      this.btnEnable = true;
    },
    handleProgress(event, file, fileList, row) {
      row.show_progress_flag = true;
      let key = row.file_id.toString();
      this.timer[key] = setInterval(this.updateLoadProgress, 200, row);
    },
    updateLoadProgress(row) {
      this.$axios
        .get("http://10.160.31.115:5000/update_progress?userKey=" + row.file_id)
        .then(res => {
          row.load_progress = parseInt(res.data);

          if (row.load_progress >= 100) {
            let key = row.file_id.toString();
            clearInterval(this.timer[key]);
            delete this.timer[key];
          }
        });
    },
    handleChange(files, fileList) {
      // console.log("file", files.length);
      // console.log("fileList", fileList.length);
    },
    handleSuccess(res, file, fileList, row) {
      this.btnEnable = false;
      row.show_filelist_flag = true;
      row.show_progress_flag = false;
      let key = row.file_id.toString();
      clearInterval(this.timer[key]);
      delete this.timer[key];
      // 1.成功提示
      this.$message({
        message: "订单上传成功",
        type: "success",
        duration: 800
      });
      this.gridDataTotal = res.total_data;
      this.gridDataDetail = res.detail_data;
      this.outerVisible = true;
    },
    handleError(err, file, fileList) {
      console.log("文件上传失败")
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