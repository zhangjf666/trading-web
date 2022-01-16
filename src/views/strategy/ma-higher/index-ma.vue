<template>
  <div class="app-container">
    <!--搜索栏-->
    <div class="head-container inline">
      <div class="left">
        <el-form
          :inline="true"
          :model="indexQuery"
        >
          <el-form-item>
            <el-checkbox v-model="indexQuery.industryCheck">行业指数</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="indexQuery.conceptCheck">概念指数</el-checkbox>
          </el-form-item>
          <el-form-item
            class="form-item"
            label="持续时间"
          >
            <el-input
              v-model="indexQuery.miniTrendDay"
              clearable
              size="small"
              placeholder="最小持续时间"
              style="width: 130px"
              class="filter-item"
            />-
            <el-input
              v-model="indexQuery.maxTrendDay"
              clearable
              size="small"
              placeholder="最大持续时间"
              style="width: 130px"
              class="filter-item"
            />
          </el-form-item>

          <el-form-item
            class="form-item"
            size="small"
          >
            <el-button
              type="primary"
              @click="queryIndexData"
            >查询指数</el-button>
          </el-form-item>
        </el-form>
        <u-table
          ref="indexTable"
          :data="indexData"
          style="width: 100%"
          stripe
          :height="tableHeight"
          use-virtual
          show-body-overflow="title"
          show-header-overflow="title"
          :header-cell-style="headerStyle('index')"
          @selection-change="indexSelectionChange"
        >
          <u-table-column type="selection" align="center" />
          <u-table-column
            v-for="(item, index) in indexTableHeader"
            :key="index"
            :fixed="isFixed(item)"
            :label="item.label"
            :property="item.label"
            sortable
            align="center"
          />
        </u-table>
      </div>
      <div class="right">
        <el-form
          :inline="true"
          :model="stockQuery"
        >
          <el-form-item
            class="form-item"
            label="持续时间"
          >
            <el-input
              v-model="stockQuery.miniTrendDay"
              clearable
              size="small"
              placeholder="最小持续时间"
              style="width: 120px"
              class="filter-item"
            />-
            <el-input
              v-model="stockQuery.maxTrendDay"
              clearable
              size="small"
              placeholder="最大持续时间"
              style="width: 120px"
              class="filter-item"
            />
          </el-form-item>
          <el-form-item
            class="form-item"
            label="流通市值(亿)"
          >
            <el-input
              v-model="stockQuery.miniMarketValue"
              clearable
              size="small"
              placeholder="最小流通市值"
              style="width: 120px"
              class="filter-item"
            />-
            <el-input
              v-model="stockQuery.maxMarketValue"
              clearable
              size="small"
              placeholder="最大流通市值"
              style="width: 120px"
              class="filter-item"
            />
          </el-form-item>
          <el-form-item label="叠加技术指标">
            <el-checkbox-group v-model="stockQuery.jszb">
              <el-checkbox v-for="zb in jszbList" :key="zb" :label="zb.value">{{ zb.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            class="form-item"
            size="small"
          >
            <el-button
              type="danger"
              @click="queryStockData"
            >查询个股</el-button>
          </el-form-item>
        </el-form>
        <u-table
          ref="stockTable"
          :data="stockData"
          style="width: 100%"
          stripe
          :height="tableHeight"
          use-virtual
          show-body-overflow="title"
          show-header-overflow="title"
          :header-cell-style="headerStyle('stock')"
        >
          <u-table-column
            v-for="(item, index) in stockTableHeader"
            :key="index"
            :fixed="isFixed(item)"
            :label="item.label"
            :property="item.label"
            sortable
            align="center"
          />
        </u-table>
      </div>
    </div>
  </div>
</template>

<script>
import { getIndexMa, getStockMa } from '@/api/trading'
import { objectIsEmpty } from '@/utils/index'

export default {
  name: 'IndexMa',
  data() {
    return {
      jszbList: [
        { name: '创新高', value: 'cxg' },
        { name: '创新低', value: 'cxd' },
        { name: '持续放量', value: 'cxfl' },
        { name: '持续缩量', value: 'cxsl' },
        { name: '量价齐升', value: 'ljqs' },
        { name: '量价齐跌', value: 'ljqd' },
        { name: '连续上涨', value: 'lxsz' },
        { name: '连续下跌', value: 'lxxd' }
      ],
      tableHeight: 500,
      tableOffsetTop: 0,
      indexTableHeader: [],
      stockTableHeader: [],
      indexData: [],
      stockData: [],
      indexQuery: {
        industryCheck: true,
        conceptCheck: true,
        miniTrendDay: '',
        maxTrendDay: ''
      },
      stockQuery: {
        miniTrendDay: '',
        maxTrendDay: '',
        miniMarketValue: '',
        maxMarketValue: '',
        industrys: [],
        concepts: [],
        jszb: []
      }
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.tableOffsetTop = this.$refs.indexTable.$el.offsetTop
      this.tableHeight = window.innerHeight - this.tableOffsetTop - 110

      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.tableOffsetTop - 110
      }
    })
    this.queryIndexData()
  },
  methods: {
    queryIndexData() {
      var param = {}
      if (this.indexQuery.industryCheck && this.indexQuery.conceptCheck) {
        param['boardType'] = '3'
      } else if (
        this.indexQuery.industryCheck == null ||
        this.indexQuery.industryCheck == ''
      ) {
        param['boardType'] = '1'
      } else if (
        this.indexQuery.conceptCheck == null ||
        this.indexQuery.conceptCheck == ''
      ) {
        param['boardType'] = '2'
      }
      if (
        this.indexQuery.miniTrendDay != null &&
        this.indexQuery.miniTrendDay != ''
      ) {
        param['miniTrendDay'] = this.indexQuery.miniTrendDay
      }
      if (
        this.indexQuery.maxTrendDay != null &&
        this.indexQuery.maxTrendDay != ''
      ) {
        param['maxTrendDay'] = this.indexQuery.maxTrendDay
      }

      getIndexMa(param).then((res) => {
        this.indexTableHeader = []
        Object.values(res.data.columns).forEach(key => {
          this.indexTableHeader.push({ 'label': key })
        })
        this.indexData = res.data.data
      })
    },
    queryStockData() {
      var param = {}
      if (
        this.stockQuery.miniTrendDay != null &&
        this.stockQuery.miniTrendDay != ''
      ) {
        param['miniTrendDay'] = this.stockQuery.miniTrendDay
      }
      if (
        this.stockQuery.maxTrendDay != null &&
        this.stockQuery.maxTrendDay != ''
      ) {
        param['maxTrendDay'] = this.stockQuery.maxTrendDay
      }
      if (
        this.stockQuery.miniMarketValue != null &&
        this.stockQuery.miniMarketValue != ''
      ) {
        param['miniMarketValue'] = this.stockQuery.miniMarketValue
      }
      if (
        this.stockQuery.maxMarketValue != null &&
        this.stockQuery.maxMarketValue != ''
      ) {
        param['maxMarketValue'] = this.stockQuery.maxMarketValue
      }
      if (this.stockQuery.industrys.length != 0) {
        param['industrys'] = this.stockQuery.industrys
      }
      if (this.stockQuery.concepts.length != 0) {
        param['concepts'] = this.stockQuery.concepts
      }
      if (this.stockQuery.jszb.length != 0) {
        param['jszb'] = this.stockQuery.jszb
      }
      getStockMa(param).then((res) => {
        this.stockTableHeader = []
        Object.values(res.data.columns).forEach(key => {
          this.stockTableHeader.push({ 'label': key })
        })
        this.stockData = res.data.data
      })
    },
    isFixed(item) {
      // if(item.label == '日期' || item.label == '转债代码' || item.label == '转债名称'){
      //     return true
      // }
      return false
    },
    headerStyle(type) {
      return type == 'index' ? { 'background-color': '#66B1FF', color: '#FFFFFF', 'border-bottom': '1px #409EFF solid' } : {
        'background-color': '#F78989', color: '#FFFFFF', 'border-bottom': '1px #F56C6C solid'
      }
    },
    indexSelectionChange(val) {
      this.stockQuery.industrys = []
      this.stockQuery.concepts = []
      if (val.length == 0) {
        return
      }
      for (var item of val) {
        var indexType = item['指数类型']
        if (indexType == '行业指数') {
          this.stockQuery.industrys.push(item['代码'])
        } else if (indexType == '概念指数') {
          this.stockQuery.concepts.push(item['代码'])
        }
      }
    }
  }
}
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
  width: 45%;
  height: 100%;
  padding-right: 10px;
}
.right {
  width: 55%;
  height: 100%;
}
</style>
