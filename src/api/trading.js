import request from '@/utils/trading-request'

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