<template>
  <div class="app-container">
    <!--搜索栏-->
    <div class="head-container">
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
import { getJgdytj } from "@/api/trading";
import util from "@/utils/my-utils"

export default {
  name: "jgdytj",
  data() {
    return {
      tableHeight: 500,
      tableOffsetTop: 0,
      tableHeader: [],
      headerExclued: ['公告日期'],
      data: [],
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
    this.$nextTick(function () {
      this.tableOffsetTop = this.$refs.table.$el.offsetTop;
      this.tableHeight = window.innerHeight - this.tableOffsetTop - 110;

      // 监听窗口大小变化
      let self = this;
      window.onresize = function () {
        self.tableHeight = window.innerHeight - self.tableOffsetTop - 110;
      };
    });
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
      getJgdytj(param).then((res) => {
            this.tableHeader = []
            Object.values(res.data.columns).forEach(key => {
                if (!this.headerExclued.includes(key)){
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
