import axios from 'axios'
import { MessageBox, Message, Notification } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建一个axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 实际发送的URL=baseURL  +  请求配置的url  （baseURL当前就是/dev-api
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // 设置请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做的事情
    if (store.getters.token) {
      // 让每一个请求中都携带token
      // 【‘X-Token’】是一个自定义的header中的key
      // 可以根据实际情况改变它
      // 这里的token名称要和后端保持一致
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // 当请求出现问题时所做的一些事情
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
   * 如果你想要得到诸如请求头或者状态的http信息
   * 请返回  response => response
   */
  /**
   * 通过自定义码来决定请求状态
   * 这里仅仅是一个例子
   * 你同样也可以根据http的状态码来决定这个状态
   * @param response
   * @returns {any|Promise<AxiosResponse<any>>}
   */
  response => {
    /**
     * 项目中存在的状态码
     * 400：参数存在问题
     * 401：未授权
     * 500：系统内部错误
     * 200：操作成功
     */
    const res = response.data // response.data才是后台返回给我们的数据
    if (res.code === 401) {
      // 未授权，身份过期  一个弹出框
      MessageBox.confirm('用户登录身份已过期，请重新登录', '系统提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/logout').then(() => { // 跳转到登录页面重新登录
          location.reload()
        })
      })
    } else if (res.code === 500) {
      Notification.error({
        title: '服务器内部出现异常，请联系管理员'
      })
      return Promise.reject('error') // 记录错误
    } else if (res.code === 400) { // 可能是其他参数出错
      Notification.error({
        title: res.msg
      })
      return Promise.reject('error') // 记录错误
    } else {
      // 以上验证通过之后放行
      return res
    }
    // 如果响应的code值不是200，那么就判别为一个error
    // if (res.code !== 200) {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    //
    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //       confirmButtonText: 'Re-Login',
    //       cancelButtonText: 'Cancel',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }
    //   return Promise.reject(new Error(res.message || 'Error'))
    // } else {
    //   return res
    // }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
