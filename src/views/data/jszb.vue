<template>
  <div class="app-container">
    <!--搜索栏-->
    <div class="head-container">
      <el-tabs
        v-model="query.zbType"
        @tab-click="queryData"
        type="card"
      >
        <el-tab-pane
          label="创新高"
          name="cxg"
        ></el-tab-pane>
        <el-tab-pane
          label="创新低"
          name="cxd"
        ></el-tab-pane>
        <el-tab-pane
          label="连续上涨"
          name="lxsz"
        ></el-tab-pane>
        <el-tab-pane
          label="连续下跌"
          name="lxxd"
        ></el-tab-pane>
        <el-tab-pane
          label="持续放量"
          name="cxfl"
        ></el-tab-pane>
        <el-tab-pane
          label="持续缩量"
          name="cxsl"
        ></el-tab-pane>
        <el-tab-pane
          label="量价齐升"
          name="ljqs"
        ></el-tab-pane>
        <el-tab-pane
          label="量价齐跌"
          name="ljqd"
        ></el-tab-pane>
      </el-tabs>
      <el-date-picker
        v-if="isShowDatePicker"
        ref="picker"
        v-model="query.date"
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['00:00:00', '23:59:59']"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd"
        @change="queryData"
      />
    </div>
    <u-table
      ref="table"
      :data="data"
      style="width: 100%"
      stripe
      :height="tableHeight"
      use-virtual
      showBodyOverflow="title"
      showHeaderOverflow="title"
      :header-cell-style="headerStyle"
    >
      <u-table-column
        v-for="(item,index) in tableHeader"
        :label="item.label"
        :key="index"
        :property="item.label"
        align="center"
      ></u-table-column>
    </u-table>
  </div>
</template>

<script>
import { getJszb } from "@/api/trading";
import util from "@/utils/my-utils";

export default {
  name: "zjlx",
  data() {
    return {
      tableHeight: 500,
      tableOffsetTop: 0,
      tableHeader: [],
      data: [],
      query: {
        zbType: "cxg",
        date: "",
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  mounted() {
    this.$nextTick(function () {
      this.tableOffsetTop = this.$refs.table.$el.offsetTop;
      this.tableHeight = window.innerHeight - this.tableOffsetTop - 110;

      // 监听窗口大小变化
      let self = this;
      window.onresize = function () {
        self.tableHeight = window.innerHeight - self.tableOffsetTop - 110;
      };
    });
    this.query.date = [
      util.formatDate(new Date()),
      util.formatDate(new Date()),
    ];
    this.queryData();
  },
  computed: {
    isShowDatePicker() {
        return this.query.zbType == 'cxg' || this.query.zbType == 'cxd'
    }  
  },
  methods: {
    queryData() {
      if (this.query.date == null || this.query.date == "") {
        this.$message({
          message: "请选择时间范围",
          type: "error",
          duration: 2 * 1000,
        });
        return;
      }
      var param = {
        zbType: this.query.zbType,
        beginDate: this.query.date[0],
        endDate: this.query.date[1],
      };
      getJszb(param).then((res) => {
        this.tableHeader = []
            Object.values(res.data.columns).forEach(key => {
                if (key != '公告日期'){
                    this.tableHeader.push({'label': key})
                }
            })
            this.data = res.data.data;
      });
    },
    headerStyle() {
      return {
        "background-color": "#66B1FF",
        color: "#FFFFFF",
        "border-bottom": "1px #409EFF solid",
      };
    },
  },
};
</script>

<style>
.line {
  text-align: center;
}
.form-item {
  padding-right: 20px;
}
</style>
