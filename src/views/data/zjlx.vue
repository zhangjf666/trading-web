<template>
  <div class="app-container">
    <!--搜索栏-->
    <div class="head-container">
        <el-tabs v-model="query.zjType" @tab-click="queryData" type="card">
            <el-tab-pane label="个股资金" name="0"></el-tab-pane>
            <el-tab-pane label="概念资金" name="1"></el-tab-pane>
            <el-tab-pane label="行业资金" name="2"></el-tab-pane>
        </el-tabs>
        <el-radio-group v-model="query.bdType" @change="queryData">
            <el-radio-button label="0">当日排行</el-radio-button>
            <el-radio-button label="3">3日排行</el-radio-button>
            <el-radio-button label="5">5日排行</el-radio-button>
            <el-radio-button label="10">10日排行</el-radio-button>
            <el-radio-button label="20">20日排行</el-radio-button>
        </el-radio-group>
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
        sortable
        align="center"
      ></u-table-column>
    </u-table>
  </div>
</template>

<script>
import { getZjlx } from "@/api/trading";
import util from "@/utils/my-utils"

export default {
  name: "zjlx",
  data() {
    return {
      tableHeight: 500,
      tableOffsetTop: 0,
      tableHeader: [],
      data: [],
      query: {
        zjType: '0',
        bdType: '3'
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
    this.queryData();
  },
  methods: {
    queryData() {
      getZjlx(this.query, true).then((res) => {
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
