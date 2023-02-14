import request from '@/utils/request'

export function getInvoiceList (parameter) {
  return request({
    url: '/invoice/',
    method: 'get',
    params: parameter
  })
}

export function ocrRecognize (parameter) {
  return request({
    url: '/ocr',
    method: 'post',
    params: parameter
  })
}
