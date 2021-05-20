import request from '@/utils/request'

export function getStatisticsData() {
  return request({
    url: '/api/statistics/statistics',
    method: 'post'
  })
}
