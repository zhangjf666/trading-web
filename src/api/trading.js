import request from '@/utils/trading-request'

export function getBond() {
  return request({
    url: '/collect/convertible',
    method: 'get'
  })
}