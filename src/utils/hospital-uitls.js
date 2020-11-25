// 项目通用方法的封装

/**
 * 重置表单数据
 * @param refName 页面表单对应的ref属性的值
 */
export function resetForm(refName) {
  if (this.$refs[refName]) {
    /**
     * elementUI的重置表单的方法-对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
     *    表单中每个属性需要添加prop属性,并且要和绑定数据的名称一致
      */
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
 * 码表转换(每一行都会调用一次)
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
  // actions  =>   ["正常"]  或者  ["停用"]
  // actions.join('')   =>  化数组为字符串了
  return actions.join('')
}

/**
 * 构造树的结构
 * @param data  数据
 * @param id  主键id
 * @param parentId  父菜单id
 * @param children  子节点
 * @param rootId  根菜单id 默认为0
 * @returns {*}
 */
export function handleTree(data, id, parentId, children, rootId) {
  id = id || 'id'
  parentId = parentId || 'parentId'
  children = children || 'children'
  rootId = rootId || 0
  // 对原数据进行深度克隆
  const cloneData = JSON.parse(JSON.stringify(data))
  const treeData = cloneData.filter(father => {
    const branchArr = cloneData.filter(child => {
      return father[id] === child[parentId]
    })
    branchArr.length > 0 ? father.children = branchArr : ''
    // 返回上一层
    return father[parentId] === rootId
  })
  return treeData !== '' ? treeData : data
}
