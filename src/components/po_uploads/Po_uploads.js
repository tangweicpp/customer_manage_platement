export default {
    data() {
      return {
        btnChangeEnable: false,
        gridDataTotal: [],
        gridDataDetail: [],
        innerVisible: false,
        outerVisible: false,
        timer: {},
        input: "",
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
          isBonded: [
            {
              required: true,
              message: "请选择保税类型",
              trigger: "blur"
            }
          ],
          mailContent: [
            { required: false, message: "请填写邮件正文提醒", trigger: "blur" }
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
          delayDays: "",
          isBonded: "",
          isAppend: false,
          mailContent: ""
        },
        poTemplate: { custCode: "", poType: "普通销售订单" },
        custCodeList: [],
        poTypeList: [
          { value: "普通销售订单", label: "普通销售订单" },
          { value: "工程批订单", label: "工程批订单" },
          { value: "RMA收费订单", label: "RMA收费订单" },
          { value: "RMA免费订单", label: "RMA免费订单" },
          { value: "免费订单", label: "免费订单" }
        ],
        poBondedList: [
          { value: "保税", label: "保税" },
          { value: "非保税", label: "非保税" }
        ],
        tableData: [],
        tableData2: [
          {
            date: "2016-05-02",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          }
        ],
  
        fileList: [],
  
        // 模板数据
        num: 1
      };
    },
    // 创建钩子函数
    created() {
      this.$axios.get("http://10.160.31.115:5000/cust_list").then(res => {
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
            console.log(this.tableData);
          });
  
        // 清除上传列表
        // this.$refs.upload.clearFiles();
        this.fileList = [];
      },
  
      // 点击上传入口
      uploadPoClick(row) {
        this.poForm["templateId"] = row.file_id;
        this.poForm["userUploadRandom"] = row.file_id.toString();
        this.$refs.poForm.validate(vallid => {
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
        console.log("before upload");
        this.btnChangeEnable = true;
      },
      handleProgress(event, file, fileList, row) {
        row.show_progress_flag = true;
        let key = row.file_id.toString();
        this.timer[key] = setInterval(this.updateLoadProgress, 200, row);
      },
      handleChange(files, fileList) {
        console.log("file", files.length);
        console.log("fileList", fileList.length);
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
      handleSuccess(res, file, fileList, row) {
        this.btnChangeEnable = false;
        row.show_filelist_flag = true;
        row.show_progress_flag = false;
        // 1.成功提示
        this.$message({
          message: "订单上传成功",
          type: "success",
          duration: 800
        });
        this.gridDataTotal = res.total_data;
        this.gridDataDetail = res.detail_data;
        this.outerVisible = true;
        // if (res == "success") {
        //   row.show_filelist_flag = true;
        //   row.show_progress_flag = false;
        //   // 1.成功提示
        //   this.$message({
        //     message: "订单上传成功",
        //     type: "success",
        //     duration: 800
        //   });
        // } else {
        //   this.$message({
        //     message: res,
        //     type: "error",
        //     duration: 800
        //   });
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
        if (this.poForm.isDelay) {
          this.rules.delayDays[0].required = true;
        } else {
          this.rules.delayDays[0].required = false;
        }
  
        if (this.poForm.isAppend) {
          this.rules.mailContent[0].required = true;
        } else {
          this.rules.mailContent[0].required = false;
        }
  
        if (this.poForm.poType === "RMA收费订单") {
          this.rules.poPrice[0].required = true;
        } else {
          this.rules.poPrice[0].required = false;
        }
      }
      // handleChange(value) {
      //   console.log(value);
      //   console.log(this.num);
      //   if (value > this.tableData2.length) {
      //     this.tableData2.push({});
      //   } else {
      //     this.tableData2.pop();
      //   }
      // }
    }
  };