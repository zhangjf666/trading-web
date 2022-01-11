<template>
  <div class="app-container">
    <!--搜索栏-->
    <div class="head-container">
      <div>
        <el-form
          :inline="true"
          :model="query"
        >
          <el-form-item label="查询日期范围">
            <el-date-picker
              ref="picker"
              v-model="query.value"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
              >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            class="form-item"
            size="small"
          >
            <el-button
              type="primary"
              @click="queryData"
            >查询</el-button>
          </el-form-item>
        </el-form>
        <div class="title">超跌次新个股</div>
        <u-table
          ref="stockTable"
          :data="stockData"
          style="width: 100%"
          stripe
          use-virtual
          showBodyOverflow="title"
          showHeaderOverflow="title"
          :header-cell-style="headerStyle('stock')"
        >
          <u-table-column
            v-for="(item, index) in stockTableHeader"
            :fixed="isFixed(item)"
            :label="item.label"
            :key="index"
            :property="item.label"
            align="center"
          ></u-table-column>
        </u-table>
      </div>
      <div class="title">超跌次新卖出个股</div>
      <div>
        <u-table
          ref="sellTable"
          :data="sellData"
          style="width: 100%"
          stripe
          use-virtual
          showBodyOverflow="title"
          showHeaderOverflow="title"
          :header-cell-style="headerStyle('sell')"
        >
          <u-table-column
            v-for="(item, index) in sellTableHeader"
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
import { getOverSoldNewStock, getOverSoldNewStockSell } from "@/api/trading"
import util from "@/utils/my-utils"

export default {
  name: "over-sold-new-stock",
  data() {
    return {
      tableOffsetTop: 0,
      stockTableHeader: [
        { label: "日期" },
        { label: "代码" },
        { label: "名称" },
        { label: "最大回撤" },
        { label: "回撤最高日期" },
        { label: "回撤最低日期" },
        { label: "总市值(亿)" },
        { label: "流通市值(亿)" }
      ],
      sellTableHeader: [
        { label: "日期" },
        { label: "代码" },
        { label: "名称" },
        { label: "买入日期" },
        { label: "卖出日期" },
        { label: "收盘" },
        { label: "涨幅(%)" },
        { label: "跌幅(%)" },
        { label: "持有天数"}
      ],
      stockData: [],
      sellData: [],
      query: {
        value:''
      },
      pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        }
    };
  },
  mounted() {
    this.query.value = [util.formatDate(new Date()), util.formatDate(new Date())]
    this.queryData();
  },
  methods: {
    queryData() {
      if(this.query.value == null || this.query.value == ''){
        this.$message({
          message: '请选择时间范围',
          type: 'error',
          duration: 2 * 1000
        })
        return
      }
      var param = {'beginDate': this.query.value[0], 'endDate': this.query.value[1]}
      getOverSoldNewStock(param).then(res => {
        this.stockData = res.data.data;
      });
      getOverSoldNewStockSell(param).then(res => {
        this.sellData = res.data.data
      })
    },
    isFixed(item) {
      // if(item.label == '日期' || item.label == '转债代码' || item.label == '转债名称'){
      //     return true
      // }
      return false;
    },
    headerStyle(type) {
      return type == 'stock' ? { "background-color": "#66B1FF", color: "#FFFFFF", "border-bottom": "1px #409EFF solid", } : {
        "background-color": "#F78989", color: "#FFFFFF", "border-bottom": "1px #F56C6C solid",
      };
    }
  }
};
</script>

<style>
.title {
  text-align: center;
  padding: 10px;
  font-size: 20px;
}
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
  width: 45%;
  height: 100%;
  padding-right: 10px;
}
.right {
  width: 55%;
  height: 100%;
}
</style>
