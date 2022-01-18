import request from '@/utils/trading-request'
import qs from "qs"

// 可转债比价表
export function getBond(data, showLoading) {
  return request({
    url: '/collect/convertible',
    method: 'get',
    params: data,
    showLoading: showLoading
  })
}

// 指数均线多头获取
export function getIndexMa(data, showLoading) {
  return request({
    url: '/strategy/index-ma',
    method: 'get',
    params: data,
    showLoading: showLoading
  })
}

// 个股均线多头获取
export function getStockMa(data, showLoading) {
  return request({
    url: '/strategy/stock-ma',
    method: 'get',
    params: data,
    showLoading: showLoading,
    paramsSerializer: data => {
      return qs.stringify(data, {indices: false})
    }
  })
}

// 超跌次新买入股票
export function getOverSoldNewStock(data, showLoading) {
  return request({
    url: '/strategy/select-oversold-stock',
    method: 'get',
    params: data,
    showLoading: showLoading,
    paramsSerializer: data => {
      return qs.stringify(data, {indices: false})
    }
  })
}

// 获取北向资金策略买卖点位数据
export function getN2sSign(data, showLoading) {
  return request({
    url: '/strategy/n2s-sign',
    method: 'get',
    params: data,
    showLoading: showLoading,
    paramsSerializer: data => {
      return qs.stringify(data, {indices: false})
    }
  })
}

// 获取北向资金策略回测数据
export function getN2sSignTest(data, showLoading) {
  return request({
    url: '/strategy/n2s-sign-test',
    method: 'get',
    params: data,
    showLoading: showLoading,
    paramsSerializer: data => {
      return qs.stringify(data, {indices: false})
    }
  })
}

// 超跌次新卖出股票
export function getOverSoldNewStockSell(data, showLoading) {
  return request({
    url: '/strategy/sell-over-stock',
    method: 'get',
    params: data,
    showLoading: showLoading,
    paramsSerializer: data => {
      return qs.stringify(data, {indices: false})
    }
  })
}

// 获取行业板块列表
export function getIndustryList(data, showLoading) {
  return request({
    url: '/collect/industry-list',
    method: 'get',
    params: data,
    showLoading: showLoading,
    paramsSerializer: data => {
      return qs.stringify(data, {indices: false})
    }
  })
}

// 获取概念板块列表
export function getConceptList(data, showLoading) {
  return request({
    url: '/collect/concept-list',
    method: 'get',
    params: data,
    showLoading: showLoading,
    paramsSerializer: data => {
      return qs.stringify(data, {indices: false})
    }
  })
}

// 机构调研统计
export function getJgdytj(data, showLoading) {
  return request({
    url: '/collect/jgdytj',
    method: 'get',
    params: data,
    showLoading: showLoading
  })
}

// 技术指标
export function getJszb(data, showLoading) {
  return request({
    url: '/collect/jszb',
    method: 'get',
    params: data,
    showLoading: showLoading
  })
}

// 资金流向
export function getZjlx(data, showLoading) {
  return request({
    url: '/collect/zjlx',
    method: 'get',
    params: data,
    showLoading: showLoading
  })
}