<template>
  <div class="app-container">
    <div class="head-container">
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
            style="width: 140px"
            class="filter-item"
          />-
          <el-input
            v-model="stockQuery.maxTrendDay"
            clearable
            size="small"
            placeholder="最大持续时间"
            style="width: 140px"
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
            style="width: 140px"
            class="filter-item"
          />-
          <el-input
            v-model="stockQuery.maxMarketValue"
            clearable
            size="small"
            placeholder="最大流通市值"
            style="width: 140px"
            class="filter-item"
          />
        </el-form-item>
        <el-form-item
          class="form-item"
          label="涨幅(%)"
        >
          <el-input
            v-model="stockQuery.miniRange"
            clearable
            size="small"
            placeholder="最小涨幅"
            style="width: 140px"
            class="filter-item"
          />-
          <el-input
            v-model="stockQuery.maxRange"
            clearable
            size="small"
            placeholder="最大涨幅"
            style="width: 140px"
            class="filter-item"
          />
        </el-form-item>
        <el-form-item
          class="form-item"
          label="涨速"
        >
          <el-input
            v-model="stockQuery.miniSpeed"
            clearable
            size="small"
            placeholder="最小涨速"
            style="width: 140px"
            class="filter-item"
          />-
          <el-input
            v-model="stockQuery.maxSpeed"
            clearable
            size="small"
            placeholder="最大涨速"
            style="width: 140px"
            class="filter-item"
          />
        </el-form-item>
        <el-form-item
          class="form-item"
          size="small"
        >
          <el-button
            type="primary"
            @click="queryStockData"
          >查询</el-button>
        </el-form-item>
        <el-form-item label="叠加技术指标">
          <el-checkbox-group v-model="stockQuery.jszb">
            <el-checkbox v-for="zb in jszbList" :key="zb" :label="zb.value">{{ zb.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="选择行业板块">
          <el-select v-model="stockQuery.industrys" style="width:800px;" multiple filterable placeholder="请选择" :filter-method="filterIndustry">
            <el-option v-for="item in industryOption" :key="item['代码']" :label="item['名称']" :value="item['代码']" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择概念板块">
          <el-select v-model="stockQuery.concepts" style="width:800px;" multiple filterable placeholder="请选择" :filter-method="filterConcept">
            <el-option v-for="item in conceptOption" :key="item['代码']" :label="item['名称']" :value="item['代码']" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <u-table
      ref="indexTable"
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
</template>

<script>
import { getConceptList, getIndustryList, getStockMa } from '@/api/trading'
import Pinyin from '@/utils/chinese-py'

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
      stockTableHeader: [],
      industryListData: [],
      industryOption: [],
      conceptListData: [],
      conceptOption: [],
      stockData: [],
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
    // 获取板块列表
    this.queryBoardList()
    this.queryStockData()
  },
  methods: {
    queryBoardList() {
      getIndustryList().then(res => {
        this.industryListData = res.data.data
        this.industryOption = res.data.data
      })
      getConceptList().then(res => {
        this.conceptListData = res.data.data
        this.conceptOption = res.data.data
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
      if (
        this.stockQuery.miniRange != null &&
        this.stockQuery.miniRange != ''
      ) {
        param['miniRange'] = this.stockQuery.miniRange
      }
      if (
        this.stockQuery.maxRange != null &&
        this.stockQuery.maxRange != ''
      ) {
        param['maxRange'] = this.stockQuery.maxRange
      }
      if (
        this.stockQuery.miniSpeed != null &&
        this.stockQuery.miniSpeed != ''
      ) {
        param['miniSpeed'] = this.stockQuery.miniSpeed
      }
      if (
        this.stockQuery.maxSpeed != null &&
        this.stockQuery.maxSpeed != ''
      ) {
        param['maxSpeed'] = this.stockQuery.maxSpeed
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
      getStockMa(param, true).then((res) => {
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
      return type == 'stock' ? { 'background-color': '#66B1FF', color: '#FFFFFF', 'border-bottom': '1px #409EFF solid' } : {
        'background-color': '#F78989', color: '#FFFFFF', 'border-bottom': '1px #F56C6C solid'
      }
    },
    indexSelectionChange(val) {
      if (val.length == 0) {
        return
      }
      this.stockQuery.industrys = []
      this.stockQuery.concepts = []
      for (var item of val) {
        var indexType = item['指数类型']
        if (indexType == '行业指数') {
          this.stockQuery.industrys.push(item['代码'])
        } else if (indexType == '概念指数') {
          this.stockQuery.concepts.push(item['代码'])
        }
      }
    },
    filterIndustry(query) {
      if (query != '') {
        this.industryOption = this.industryListData.filter(item => {
          return Pinyin.GetJP(item['名称']).indexOf(query.toUpperCase()) > -1
        })
      } else {
        this.industryOption = this.industryListData
      }
    },
    filterConcept(query) {
      if (query != '') {
        this.conceptOption = this.conceptListData.filter(item => {
          return Pinyin.GetJP(item['名称']).indexOf(query.toUpperCase()) > -1
        })
      } else {
        this.conceptOption = this.conceptListData
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
