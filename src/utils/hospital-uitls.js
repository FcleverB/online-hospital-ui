// 项目通用方法的封装

/**
 * 重置表单数据
 * @param refName 页面表单对应的ref属性的值
 */
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields()
  }
}
/**
 * 将查询条件中选择的日期范围构造为beginTime和endTime的形式
 * @param params  封装查询条件的对象
 * @param dateRange 选择的日期范围
 * @returns {*} 添加开始时间和结束时间的查询条件
 */
export function addDateRange(params, dateRange) {
  // params实际为查询条件,该方法只是添加了开始和结束时间的条件
  var search = params
  // 初始化开始时间和结束时间为空
  search.beginTime = ''
  search.endTime = ''
  // 如果查询条件中选择的时间范围不为(null,'',undefined)
  if (dateRange != null && dateRange !== '' && dateRange !== undefined) {
    // 赋值设置
    search.beginTime = this.dateRange[0]
    search.endTime = this.dateRange[1]
  }
  // 将结果返回
  return search
}
/**
 * 码表转换
 * @param datas 对应字典类型的全部数据
 * @param value 待转换的码值
 * @returns {string}
 */
export function transferDictCode(datas, value) {
  var actions = []
  Object.keys(datas).map((key) => {
    if (datas[key].dictValue === value) {
      actions.push(datas[key].dictLabel)
      return false
    }
  })
  return actions.join('')
}
