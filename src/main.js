import Vue from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css' // 一个可定制的css重置样式集,使浏览器呈现的所有元素，更一致和符合现代标准
import Element from 'element-ui'
import './styles/element-variables.scss'
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖
import '@/styles/index.scss' // 全局css样式
import App from './App'
import store from './store' // Vuex
import router from './router' // 路由管理
import './icons' // 图标管理
import './permission' // 权限控制
import './utils/error-log' // 错误日志
import * as filters from './filters' // 全局过滤器

import { resetForm, addDateRange, transferDictCode, handleTree, getAge, getCurrentTimeType } from '@/utils/hospital-uitls' // 通用方法(重置表单,日期范围拆分,码表转换)
import { getDataByType } from '@/api/system/dict/data' // 根据字典类型获取字典数据

// 全局方法挂载(这里挂载了自定义的全局通用方法)
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.transferDictCode = transferDictCode
Vue.prototype.getDataByType = getDataByType // 加载全局的根据字典类型查询字典的方法[基本每个页面都要使用]
Vue.prototype.handleTree = handleTree // 挂载全局的构造树结构的方法
Vue.prototype.getAge = getAge // 挂载全局的根据出生年月计算年龄的方法
Vue.prototype.getCurrentTimeType = getCurrentTimeType // 挂载全局的判断当前时刻是上午|下午|晚上的方法
// 挂载全局消息框
// 成功消息
Vue.prototype.msgSuccess = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'success' })
}
// 错误信息
Vue.prototype.msgError = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'error' })
}
// 提示信息
Vue.prototype.msgInfo = function(msg) {
  this.$message.info(msg)
}

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// 使用项目本身提供的模拟数据,后面就用不到了
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  // locale: enLang // 如果使用中文，无需设置，请删除
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
