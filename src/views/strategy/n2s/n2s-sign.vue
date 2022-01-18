<template>
  <div class="app-container">
    <!--搜索栏-->
    <div class="head-container">
      <el-form :inline="true" :model="query">
        <el-form-item class="form-item" label="标准差取值">
            <el-input-number v-model="query.multiple" :step="0.5" step-strictly :min="1"></el-input-number>
        </el-form-item>
        <el-form-item class="form-item" label="年周期天数">
          <el-input-number v-model="query.period" :step="1" step-strictly></el-input-number>
        </el-form-item>
        <el-form-item class="form-item" size="small">
          <el-button type="primary" @click="queryData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="chart-container">
        <line-chart id="n2s-sign" height="100%" width="100%" :option="option"></line-chart>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import LineChart from "@/components/Charts/LineChart"
import { getN2sSign } from "@/api/trading";

export default {
  name: "n2s-sign",
  components: { LineChart },
  data() {
    return {
      data: [],
      query: {
        multiple: 2,
        period: 252
      },
      option: {
        backgroundColor: '#394056',
        title: {
          top: 20,
          text: '北向资金策略买卖点位',
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
                start:90,
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
          data: ['当日成交净买额'],
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
          name: '净买额(亿)',
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
        }],
        series: [{
          name: '上限值',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          tooltip: {
              show: false
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
          name: '当日成交净买额',
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
          data: [],
          markPoint: {
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: true,
                data:[]
            }
        }, {
          name: '下限值',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          tooltip: {
              show: false
          },
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
    this.queryData();
  },
  methods: {
    queryData() {
      getN2sSign(this.query, true).then((res) => {
        this.data = res.data.data;
      });
    },
  },
  watch: {
      data(val) {
          var date = []
          var value = []
          var up = []
          var down = []
          var markPoint = []
          val.map(item => {
              date.push(item['日期'])
              value.push(item['当日成交净买额'])
              up.push(item['up'])
              down.push(item['down'])
              if(item['buy'] != null){
                  markPoint.push({name: '买', value: '买', xAxis: item['日期'], yAxis: item['当日成交净买额'],
                  itemStyle: {
                      normal: {
                          color: '#96CF16',
                          borderColor: '#96CF16',
                          borderWidth: 1,
                          label: {
                              show: true,
                              position: 'top'
                          }
                      }
                  }
                  })
              }
              if(item['sell'] != null){
                  markPoint.push({name: '卖', value: '卖', xAxis: item['日期'], yAxis: item['当日成交净买额'], 
                  itemStyle: {
                      normal: {
                          color: '#F03738',
                          borderColor: '#F03738',
                          borderWidth: 1,
                          label: {
                              show: true,
                              position: 'buttom'
                          }
                      }
                  }
                  })
              }
          })
          this.option.xAxis[0].data = date
          this.option.series[0].data = up
          this.option.series[1].data = value
          this.option.series[1].markPoint.data = markPoint
          this.option.series[2].data = down
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
