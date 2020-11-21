<template>
  <div class="app-container">
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="用户名称" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名称"
          clearable
          size="small"
          style="width:140px"
        />
      </el-form-item>
      <el-form-item label="用户账号" prop="loginAccount">
        <el-input
          v-model="queryParams.loginAccount"
          placeholder="请输入用户账号"
          clearable
          size="small"
          style="width:140px"
        />
      </el-form-item>
      <el-form-item label="IP地址" prop="ipAddr">
        <el-input
          v-model="queryParams.ipAddr"
          placeholder="请输入IP地址"
          clearable
          size="small"
          style="width:130px"
        />
      </el-form-item>
      <el-form-item label="登录状态" prop="loginStatus">
        <el-select
          v-model="queryParams.loginStatus"
          placeholder="请选择登录状态"
          clearable
          size="small"
          style="width:140px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="登录类型" prop="loginType">
        <el-select
          v-model="queryParams.loginType"
          placeholder="请选择登录类型"
          clearable
          size="small"
          style="width:140px"
        >
          <el-option
            v-for="dict in loginTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width:280px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button type="normal" icon="el-icon-refresh" size="mini" @click="resetQuery">清空</el-button>
      </el-form-item>
    </el-form>
    <!-- 查询条件结束 -->
    <!-- 操作按钮开始 -->
    <el-row :gutter="10" style="margin-bottom: 8px;">
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-thumb" size="mini" @click="handleClearInfo">清空所有登录日志</el-button>
      </el-col>
    </el-row>
    <!-- 操作按钮结束 -->
    <!-- 数据列表开始 -->
    <el-table v-loading="loading" border :data="loginLogTableList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!--当行内容过多并且不想显示横向滚动条时，可以使用 Table 展开行功能-->
      <!--通过设置 type="expand" 和 Scoped slot 可以开启展开行功能-->
      <el-table-column label="日志ID" align="center" prop="infoId" />
      <el-table-column label="用户名称" align="center" prop="userName" />
      <el-table-column label="用户账号" align="center" prop="loginAccount"/>
      <el-table-column label="IP地址" width="180" align="center" prop="ipAddr" />
      <el-table-column label="登录地址" align="center" prop="loginLocation" />
      <el-table-column label="浏览器" align="center" prop="browser" />
      <el-table-column label="操作系统" align="center" prop="os" />
      <el-table-column label="登录状态" prop="loginStatus" align="center" :formatter="statusFormatter" />
      <el-table-column label="登录类型" align="center" prop="loginType" width="200"  :formatter="loginTypeFormatter" />
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 数据列表结束 -->
    <!-- 分页控件开始 -->
    <el-pagination
      v-show="total>0"
      :current-page="queryParams.pageNum"
      :page-sizes="[5,10,20,30]"
      :page-size="queryParams.pageSize"
      layout="total,sizes,prev,pager,next,jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 分页控件结束 -->
  </div>
</template>
<script>
import { listForPage, deleteLoginLogByIds, clearAllLoginLog } from '@/api/system/loginLog/loginLog'
export default {
  name: 'LoginLog',
  // 声明数据
  data() {
    return {
      // 遮罩
      loading: false,
      // 是否选择了多条记录的标记
      multiple: true,
      // 选中的记录的id集合
      ids: [],
      // 总条数
      total: 0,
      // 操作日志记录数据列表
      loginLogTableList: [],
      // 状态数据字典
      statusOptions: [],
      // 登录类型数据字典  0系统用户 1患者用户
      loginTypeOptions: [],
      // 查询的时间范围
      dateRange: [],
      // 查询参数  匹配操作时间
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined, // 用户名称
        loginAccount: undefined, // 用户账号
        ipAddr: undefined, // IP地址
        loginStatus: undefined, // 登录状态
        loginType: undefined // 登录状态  0 系统用户 1患者用户
      }
    }
  },
  // 初始化
  created() {
    // 查询条件中的状态码表
    this.getDataByType('sys_common_status').then(res => {
      this.statusOptions = res.data
    })
    // 查询条件中的登录类型码表
    this.getDataByType('sys_user_type').then(res => {
      this.loginTypeOptions = res.data
    })
    // 初始化查询数据
    this.getLoginLogList()
  },
  // 自定义方法
  methods: {
    // 查询操作日志
    getLoginLogList() {
      // 开启遮罩
      this.loading = true
      listForPage(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        // 将查询结果绑定到列表对象当中
        this.loginLogTableList = res.data
        // 保存总条数
        this.total = res.total
        // 关闭遮罩
        this.loading = false
      })
    },
    // 条件查询
    handleQuery() {
      this.getLoginLogList()
    },
    // 重置查询条件
    resetQuery() {
      // 重置查询对象
      this.resetForm('queryForm')
      // 清除日期搜索
      this.dateRange = []
      // 重新加载数据
      this.getLoginLogList()
    },
    // 删除
    handleDelete(row) {
      // 获取要删除的记录id，如果row不为空，那么就是删除一个id，否则批量删除ids
      const infoIds = row.infoId || this.ids
      this.$confirm('此操作将永久删除登录日志数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 执行删除，开启遮罩
        this.loading = true
        deleteLoginLogByIds(infoIds).then(res => {
          // 提示操作成功信息
          this.msgSuccess('删除成功')
          // 关闭遮罩
          this.loading = false
          // 重新查询数据
          this.getLoginLogList()
        })
      }).catch(() => {
        // 出现异常
        // 提示删除取消信息
        this.msgInfo('取消删除操作')
        // 关闭遮罩
        this.loading = false
      })
    },
    // 清空
    handleClearInfo() {
      this.$confirm('此操作将永久清空登录日志数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        clearAllLoginLog().then(res => {
          this.msgSuccess('清空成功')
          this.loading = false
          this.getLoginLogList()
        })
      }).catch(() => {
        this.msgError('取消清空操作')
        this.loading = false
      })
    },
    // 勾选数据时触发
    handleSelectionChange(selection) {
      // 将勾选的数据id存放到数组中
      this.ids = selection.map(item => item.infoId)
      // 默认为true，删除按钮不可使用，当选择至少一个后，变为false，可以进行删除（含批量）
      this.multiple = !selection.length
    },
    // 分页pageSize变化时触发
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      // 重新查询
      this.getLoginLogList()
    },
    // 点击上一页  下一页，跳转到指定页面时触发
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      // 重新查询
      this.getLoginLogList()
    },
    // 码表转换（状态）
    statusFormatter(row) {
      return this.transferDictCode(this.statusOptions, row.loginStatus)
    },
    // 码表转换（登录类型）
    loginTypeFormatter(row) {
      return this.transferDictCode(this.loginTypeOptions, row.loginType)
    }
  }
}
</script>
<!--scoped：表示这个标签的所有样式只会在当前这个组件中生效-->
<style scoped>
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
