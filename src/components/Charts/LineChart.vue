<template>
  <div
    :id="id"
    :class="className"
    :style="{height:height,width:width}"
    :option="option"
  />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    option: {
      type: Object
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))

      this.chart.setOption(this.option)
    }
  },
  watch: {
    option : {
      handler(newVal, oldVal) {
        if(this.chart) {
          if(newVal){
            this.chart.setOption(newVal)
          } else {
            this.chart.setOption(oldVal)
          } 
        }
      },
      deep: true
    }
  }
}
</script>
