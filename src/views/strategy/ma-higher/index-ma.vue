<template>
  <div class="app-container">
    <!--搜索栏-->
    <div class="head-container inline">
      <div class="left">
        <el-form :inline="true" :model="query">
          <el-form-item>
            <el-checkbox v-model="indexQuery.industryCheck">行业指数</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="indexQuery.conceptCheck">概念指数</el-checkbox>
          </el-form-item>
          <el-form-item class="form-item" label="多头持续时间">
            <el-input
              v-model="indexQuery.miniTrendDay"
              clearable
              size="small"
              placeholder="最小持续时间"
              style="width: 130px;"
              class="filter-item"
            />-
            <el-input
              v-model="indexQuery.maxTrendDay"
              clearable
              size="small"
              placeholder="最大持续时间"
              style="width: 130px;"
              class="filter-item"
            />
          </el-form-item>

          <el-form-item class="form-item" size="small">
            <el-button type="primary" @click="queryIndexData">查询</el-button>
          </el-form-item>
        </el-form>
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
            v-for="(item,index) in indexTableHeader"
            :fixed="isFixed(item)"
            :label="item.label"
            :key="index"
            :property="item.label"
            align="center"
          ></u-table-column>
        </u-table>
      </div>
      <div class="right">
        <el-form>
          <el-form-item class="form-item" label="可转债价格范围">
            <el-input
              v-model="query.miniBondPrice"
              clearable
              size="small"
              placeholder="最低价格"
              style="width: 120px;"
              class="filter-item"
            />-
            <el-input
              v-model="query.maxBondPrice"
              clearable
              size="small"
              placeholder="最高价格"
              style="width: 120px;"
              class="filter-item"
            />
          </el-form-item>
        </el-form>
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
            :fixed="isFixed(item)"
            :label="item.label"
            :key="index"
            :property="item.label"
            align="center"
          ></u-table-column>
        </u-table>
      </div>
    </div>
  </div>
</template>

<script>
import { getIndexMa } from "@/api/trading";
import { objectIsEmpty } from "@/utils/index";

export default {
  name: "InlineEditTable",
  data() {
    return {
      tableHeight: 500,
      tableOffsetTop: 0,
      indexTableHeader: [
        { label: "指数类型" },
        { label: "代码" },
        { label: "名称" },
        { label: "成交量(亿)" },
        { label: "成交额(亿)" },
        { label: "起始时间" },
        { label: "持续天数" },
      ],
      data: [],
      indexQuery: {
        industryCheck: true,
        conceptCheck: true,
        miniTrendDay: "",
        maxTrendDay: "",
      },
      query: {
        miniTrendDay: "",
        maxTrendDay: "",
        miniMarketValue: "",
        maxMarketValue: "",
        industrys: [],
        concepts: [],
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
    this.queryIndexData();
  },
  methods: {
    queryIndexData() {
      var param = {};
      if (this.indexQuery.industryCheck && this.indexQuery.conceptCheck) {
        param["boardType"] = "3";
      } else if (
        this.indexQuery.industryCheck == null ||
        this.indexQuery.industryCheck == ""
      ) {
        param["boardType"] = "1";
      } else if (
        this.indexQuery.conceptCheck == null ||
        this.indexQuery.conceptCheck == ""
      ) {
        param["boardType"] = "2";
      }
      if (
        this.indexQuery.miniTrendDay != null &&
        this.indexQuery.miniTrendDay != ""
      ) {
        param["miniTrendDay"] = this.indexQuery.miniTrendDay;
      }
      if (
        this.indexQuery.maxTrendDay != null &&
        this.indexQuery.maxTrendDay != ""
      ) {
        param["maxTrendDay"] = this.indexQuery.maxTrendDay;
      }

      getIndexMa(param).then((res) => {
        this.data = res.data;
      });
    },
    isFixed(item) {
      // if(item.label == '日期' || item.label == '转债代码' || item.label == '转债名称'){
      //     return true
      // }
      return false;
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
.inline {
  display: flex;
  flex-direction: row;
}
.left {
  width: 40%;
  height: 100%;
  padding-right: 10px;
}
.right {
  width: 60%;
  height: 100%;
}
</style>
