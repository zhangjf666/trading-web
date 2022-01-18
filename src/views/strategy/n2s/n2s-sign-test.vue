<template>
  <div class="app-container">
    <!--搜索栏-->
    <div class="head-container">
      <el-form :inline="true" :model="query">
        <el-form-item class="form-item" label="回测代码">
            <el-input v-model="query.code" style="width: 100px"></el-input>
        </el-form-item>
        <el-form-item class="form-item" label="代码类型">
          <el-radio v-model="query.codeType" label="0">个股</el-radio>
          <el-radio v-model="query.codeType" label="1">指数</el-radio>
        </el-form-item>
        <el-form-item class="form-item" label="标准差取值">
            <el-input-number v-model="query.multiple" :step="0.5" step-strictly :min="1"></el-input-number>
        </el-form-item>
        <el-form-item class="form-item" label="年周期天数">
          <el-input-number v-model="query.period" :step="1" step-strictly></el-input-number>
        </el-form-item>
        <el-form-item
            class="form-item"
            label="回测时间"
          >
            <el-date-picker
              ref="picker"
              v-model="query.date"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
              >
            </el-date-picker>
          </el-form-item>
        <el-form-item class="form-item" size="small">
          <el-button type="primary" @click="queryData">回测</el-button>
        </el-form-item>
      </el-form>
      <div class="summary" v-if="Object.keys(summary).length != 0">
        <p>代码: {{summary.code}}, 名称: {{summary.name}}</p>
        <p>目标总收益率: {{summary.er}}%, 目标年收益率: {{summary.arr}}%, 最大回撤: {{summary.max_drawdown}}%, 最大回撤开始时间: {{summary.max_point}}, 最大回撤结束时间: {{summary.min_point}}</p>
        <p>策略总收益率: {{summary.s_er}}%, 策略年收益率: {{summary.s_arr}}%, 最大回撤: {{summary.s_max_drawdown}}%, 最大回撤开始时间: {{summary.s_max_point}}, 最大回撤结束时间: {{summary.s_min_point}}</p>
      </div>
    </div>
    <div class="chart-container">
        <line-chart id="n2s-sign" height="100%" width="100%" :option="option"></line-chart>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import LineChart from "@/components/Charts/LineChart"
import { getN2sSignTest } from "@/api/trading";
import util from "@/utils/my-utils"

export default {
  name: "n2s-sign-test",
  components: { LineChart },
  data() {
    return {
      data: [],
      summary: {},
      query: {
        code: '',
        codeType: '0',
        date: '',
        multiple: 2,
        period: 252
      },
      pickerOptions: {
          shortcuts: [{
            text: '最近一年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近两年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 * 2);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 * 3);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      option: {
        backgroundColor: '#394056',
        title: {
          top: 20,
          text: '北向资金买卖策略回测',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#F1F1F3'
          },
          left: '1%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        dataZoom:[
            {
                type:'slider',//slider表示有滑动块的，inside表示内置的
                show:true,
                xAxisIndex:[0],
                start:0,
                end:100,
                textStyle: {
                    color: '#FFFFFF'
                }
            }
        ],
        legend: {
          top: 20,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: ['目标净值', '策略净值', '持仓区间'],
          right: '4%',
          textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
          }
        },
        grid: {
          top: 100,
          left: '2%',
          right: '2%',
          bottom: '6%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          data: []
        }],
        yAxis: [{
          type: 'value',
          name: '净值',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14
            }
          },
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },{
          type: 'value',
          name: '持仓区间',
          axisTick: {
            show: false
          },
          position : 'right',
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          axisLabel: {
            show: false,
            margin: 10,
            textStyle: {
              fontSize: 14
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: [{
          name: '目标净值',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          tooltip: {
              show: true
          },
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(137, 189, 27, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(137, 189, 27, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(137,189,27)',
              borderColor: 'rgba(137,189,2,0.27)',
              borderWidth: 12

            }
          },
          data: []
        }, {
          name: '策略净值',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(0, 136, 212, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(0, 136, 212, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(0,136,212)',
              borderColor: 'rgba(0,136,212,0.2)',
              borderWidth: 12

            }
          },
          data: []
        }, {
          name: '持仓区间',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          tooltip: {
              show: false
          },
          yAxisIndex : 1,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: 'rgba(219, 50, 51, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(219, 50, 51, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(219,50,51)',
              borderColor: 'rgba(219,50,51,0.2)',
              borderWidth: 12
            }
          },
          data: []
        }]
      }
    };
  },
  mounted() {
    const start = new Date() 
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
    this.query.date = [util.formatDate(start), util.formatDate(new Date())]
  },
  methods: {
    queryData() {
      if(this.query.code == null || this.query.code == ''){
        this.$message({
          message: '请输入代码',
          type: 'error',
          duration: 2 * 1000
        })
        return
      }
      if(this.query.date == null || this.query.date == ''){
        this.$message({
          message: '请选择时间范围',
          type: 'error',
          duration: 2 * 1000
        })
        return
      }
      var param = {'code': this.query.code, 
                    'codeType': this.query.codeType,
                    'multiple': this.query.multiple,
                    'period': this.query.period,
                   'startDate': this.query.date[0], 
                   'endDate': this.query.date[1]}
      getN2sSignTest(param, true).then((res) => {
        this.data = res.data;
      });
    },
    
  },
  watch: {
      data(val) {
          this.summary = val.summary
          var detail = val.detail
          var date = []
          var net = []
          var s_net = []
          var point = []
          detail.map(item => {
              date.push(item['日期'])
              net.push(item['net'])
              s_net.push(item['s_net'])
              point.push(item['point'])
          })
          this.option.xAxis[0].data = date
          this.option.series[0].data = net
          this.option.series[1].data = s_net
          this.option.series[2].data = point
      }
  }
};
</script>

<style>
.line {
  text-align: center;
}
.form-item {
  padding-right: 20px;
}
.chart-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 200px);
}
</style>
