import request from '@/utils/trading-request'
import qs from "qs"

// 可转债比价表
export function getBond(data) {
  return request({
    url: '/collect/convertible',
    method: 'get',
    params: data
  })
}

// 指数均线多头获取
export function getIndexMa(data) {
  return request({
    url: '/strategy/index-ma',
    method: 'get',
    params: data
  })
}

// 个股均线多头获取
export function getStockMa(data) {
  return request({
    url: '/strategy/stock-ma',
    method: 'get',
    params: data,
    paramsSerializer: data => {
      return qs.stringify(data, {indices: false})
    }
  })
}

// 超跌次新买入股票
export function getOverSoldNewStock(data) {
  return request({
    url: '/strategy/select-oversold-stock',
    method: 'get',
    params: data,
    paramsSerializer: data => {
      return qs.stringify(data, {indices: false})
    }
  })
}

// 超跌次新卖出股票
export function getOverSoldNewStockSell(data) {
  return request({
    url: '/strategy/sell-over-stock',
    method: 'get',
    params: data,
    paramsSerializer: data => {
      return qs.stringify(data, {indices: false})
    }
  })
}

// 获取行业板块列表
export function getIndustryList(data) {
  return request({
    url: '/collect/industry-list',
    method: 'get',
    params: data,
    paramsSerializer: data => {
      return qs.stringify(data, {indices: false})
    }
  })
}

// 获取概念板块列表
export function getConceptList(data) {
  return request({
    url: '/collect/concept-list',
    method: 'get',
    params: data,
    paramsSerializer: data => {
      return qs.stringify(data, {indices: false})
    }
  })
}