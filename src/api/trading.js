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