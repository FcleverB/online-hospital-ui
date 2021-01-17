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
 *    对数据的结构进行重构建
 *    当 row 中包含 children 字段时，被视为树形数据
 *    通过指定 row 中的 hasChildren 字段来指定哪些行是包含子节点。children 与 hasChildren 都可以通过 tree-props 配置。
 * @param data  数据
 * @param id  指定当前数据的id匹配哪个属性名，默认取id
 * @param parentId  指定当前数据的父菜单id匹配的属性名，默认为parentId
 * @param children  指定当前数据的子节点匹配的属性名，默认为children
 * @param rootId  指定当前数据的根菜单id匹配的属性名 默认为0
 * @returns {*}
 */
export function handleTree(data, id, parentId, children, rootId) {
  id = id || 'id'
  parentId = parentId || 'parentId'
  children = children || 'children'
  rootId = rootId || 0
  // 对原数据进行深度克隆
  const cloneData = JSON.parse(JSON.stringify(data))
  // 外层过滤每次获取一行数据
  const treeData = cloneData.filter(father => {
    // 内层过滤之后，branchArr的内容就是father的所有child
    const branchArr = cloneData.filter(child => {
      return father[id] === child[parentId]
    })
    // 判断过滤后的branchArr是否为空，如果不为空，那么该father的所有的子节点就是branchArr，否则没有子节点
    branchArr.length > 0 ? father[children] = branchArr : ''
    // 返回上一层
    return father[parentId] === rootId
  })
  return treeData !== '' ? treeData : data
}

/**
 * 根据出生年月获取年龄的工具方法
 * @param birthday 格式必须为yyyy-MM-dd
 */
export function getAge(birthday) {
  // 1. 判断参数出生日期是否为null或者空，如果是则直接返回
  if (birthday === null || birthday === '') {
    return '出生年月为空！'
  }
  // 2. 解析参数出生年月，并转换为日期类型
  var birthArr = birthday.split('-')
  var birthYear = birthArr[0]
  var birthMonth = birthArr[1]
  var birthDay = birthArr[2]
  var birthDate = new Date(birthYear, birthMonth - 1, birthDay)
  // 获取当前日期(均取0点时刻）
  var date = new Date()
  var nowDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  // 比如二者大小，如果出生日期大于当前日期，则不合法
  if (birthDate.getTime() > nowDate.getTime()) {
    return '出生年月不能晚于当前时间'
  }
  // 年龄计算结果
  var resultAge
  // 计算出年龄
  var nowYear = date.getFullYear()
  var nowMonth = date.getMonth() + 1
  var nowDay = date.getDate()
  // 如果出生年和当前年相同，那么就是0岁
  if (nowYear === parseInt(birthYear)) {
    resultAge = 0
  } else {
    var yearDiff = nowYear - parseInt(birthYear)
    // 如果当前月份大于出生月，表示还没有到出生月的12倍数，减一年
    if (nowMonth > birthMonth) {
      resultAge = yearDiff - 1
    } else {
      var monthDiff = Math.abs(nowMonth - parseInt(birthMonth))
      // 表示在同一个月内，需要判断天数
      if (monthDiff === 0) {
        // 如果当天天数大于出生天数，那么就是年想减的年龄
        if (nowDay >= birthDay) {
          resultAge = yearDiff
        } else {
          // 否则表示还没有到生日，减去一年
          resultAge = yearDiff - 1
        }
      } else {
        if (nowMonth > parseInt(birthMonth)) {
          resultAge = yearDiff
        } else {
          resultAge = yearDiff - 1
        }
      }
    }
  }
  return resultAge
}
// 根据当前时间，判断是上午1，下午2，晚上3
export function getCurrentTimeType() {
  const now = new Date()
  const hour = now.getHours()
  if (hour >= 6 && hour < 12) {
    return '1'
  } else if (hour >= 12 && hour < 18) {
    return '2'
  } else {
    return '3'
  }
}
