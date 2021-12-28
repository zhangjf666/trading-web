<template>
  <div>
      <label>可转债比价表</label>
      <el-table ref="table" :data="data" style="width: 100%" stripe height="800">
          <el-table-column v-for="(item,index) in tableHeader" :label="item.label" :key="index" :property="item.label" align="center"></el-table-column>
      </el-table>
  </div>
</template>

<script>
import { getBond } from '@/api/trading'

export default {
    name: 'InlineEditTable',
    data() {
        return{
            tableHeader: [{'label':'日期'},
                            {'label':'转债代码'},
                            {'label':'转债名称'},
                            {'label':'双低值'},
                            {'label':'转债最新价'},
                            {'label':'转债涨跌幅'},
                            {'label':'转股价'},
                            {'label':'转股价值'},
                            {'label':'转股溢价率'},
                            {'label':'到期赎回价'},
                            {'label':'回售触发价'},
                            {'label':'开始转股日'},
                            {'label':'强赎触发价'},
                            {'label':'正股代码'},
                            {'label':'正股名称'},
                            {'label':'正股最新价'},
                            {'label':'正股涨跌幅'},
                            {'label':'申购日期'},
                            {'label':'上市日期'}],
            data:[],

        }
    },
    mounted() {
        getBond().then(res =>{
            this.data = res.data
        })
    },
    methods: {
        
    }
}
</script>

<style>

</style>
