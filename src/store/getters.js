const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes, // 原始页面中是从该路由对象中获取菜单数据，我们进行动态控制显示后，应该在页面上修改为新的菜单
  errorLogs: state => state.errorLog.logs,
  menu_routes: state => state.menu.routes // 实际显示的菜单
}
export default getters
