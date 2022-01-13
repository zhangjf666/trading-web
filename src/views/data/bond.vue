<template>
  <div class="app-container">
    <!--搜索栏-->
    <div class="head-container">
      <el-form :inline="true" :model="query">
        <el-form-item class="form-item" label="双低值范围">
          <el-col :span="12">
            <el-input
              v-model="query.miniDoubleValue"
              clearable
              size="small"
              placeholder="最小双低值"
              style="width: 120px;"
              class="filter-item"
            />
          </el-col>
          <el-col class="line" :span="1">-</el-col>
          <el-col :span="11">
            <el-input
              v-model="query.maxDoubleValue"
              clearable
              size="small"
              placeholder="最大双低值"
              style="width: 120px;"
              class="filter-item"
            />
          </el-col>
        </el-form-item>
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
        <el-form-item class="form-item" size="small">
          <el-button type="primary" @click="queryData">查询</el-button>
        </el-form-item>
      </el-form>
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
        :fixed="isFixed(item)"
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
import { getBond } from "@/api/trading";
import { objectIsEmpty } from "@/utils/index";

export default {
  name: "InlineEditTable",
  data() {
    return {
      tableHeight: 500,
      tableOffsetTop: 0,
      tableHeader: [
        { label: "日期" },
        { label: "转债代码" },
        { label: "转债名称" },
        { label: "双低值" },
        { label: "转债最新价" },
        { label: "转债涨跌幅" },
        { label: "转股价" },
        { label: "转股价值" },
        { label: "转股溢价率" },
        { label: "到期赎回价" },
        { label: "回售触发价" },
        { label: "开始转股日" },
        { label: "强赎触发价" },
        { label: "正股代码" },
        { label: "正股名称" },
        { label: "正股最新价" },
        { label: "正股涨跌幅" },
        { label: "上市日期" },
      ],
      data: [],
      query: {
        miniDoubleValue: "",
        maxDoubleValue: "",
        miniBondPrice: "",
        maxBondPrice: "",
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
      if (objectIsEmpty(this.query)) {
        this.query = {};
      }
      getBond(this.query).then((res) => {
        this.data = res.data.data;
      });
    },
    isFixed(item) {
      if (
        item.label == "日期" ||
        item.label == "转债代码" ||
        item.label == "转债名称"
      ) {
        return true;
      }
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
</style>
