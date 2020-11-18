<template>
  <div class="app-container">
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="模块名称" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入模块名称"
          clearable
          size="small"
          style="width:140px"
        />
      </el-form-item>
      <el-form-item label="操作人员" prop="operName">
        <el-input
          v-model="queryParams.operName"
          placeholder="请输入操作人员"
          clearable
          size="small"
          style="width:140px"
        />
      </el-form-item>
      <el-form-item label="操作类型" prop="businessType">
        <el-select
          v-model="queryParams.businessType"
          placeholder="请选择类型"
          clearable
          size="small"
          style="width:140px"
        >
          <el-option
            v-for="dict in businessTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
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
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width:240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholde="开始日期"
          end-placeholde="结束日期"
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
        <el-button type="warning" icon="el-icon-thumb" size="mini" @click="handleClearInfo">清空所有操作日志</el-button>
      </el-col>
    </el-row>
    <!-- 操作按钮结束 -->
    <!-- 数据列表开始 -->
    <el-table v-loading="loading" border :data="operationLogTableList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!--当行内容过多并且不想显示横向滚动条时，可以使用 Table 展开行功能-->
      <!--通过设置 type="expand" 和 Scoped slot 可以开启展开行功能-->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="操作模块">
              <span>{{ props.row.title }}</span>
            </el-form-item>
            <el-form-item label="登陆信息">
              <span>{{ props.row.operName }} // {{ props.row.operIp }} // {{ props.row.operLocation }}</span>
            </el-form-item>
            <el-form-item label="请求地址">
              <span>{{ props.row.operUrl }}</span>
            </el-form-item>
            <el-form-item label="操作方法">
              <span>{{ props.row.requestMethod }}</span>
            </el-form-item>
            <el-form-item label="请求参数">
              <span>{{ props.row.operParam }}</span>
            </el-form-item>
            <el-form-item label="返回参数">
              <span>{{ props.row.jsonResult }}</span>
            </el-form-item>
            <el-form-item label="操作状态">
              <span>{{ props.row.status==0?'成功':'失败' }}</span>
            </el-form-item>
            <el-form-item label="操作时间">
              <span>{{ props.row.operTime }}</span>
            </el-form-item>
            <el-form-item label="异常信息">
              <span>{{ props.row.errorMsg }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="日志ID" align="center" prop="operId" />
      <el-table-column label="模块名称" align="center" prop="title" />
      <el-table-column label="操作类型" align="center" prop="businessType" :formatter="businessTypeFormatter" />
      <el-table-column label="请求方式" width="180" align="center" prop="requestMethod" />
      <el-table-column label="操作人员名称" align="center" prop="operName" />
      <el-table-column label="主机" align="center" prop="operIp" />
      <el-table-column label="操作地点" align="center" prop="operLocation" />
      <el-table-column label="操作状态" prop="status" align="center" :formatter="statusFormatter" />
      <el-table-column label="操作时间" align="center" prop="operTime" width="200" />
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
import { listForPage, deleteOperationLogByIds, clearAllOperationLog } from '@/api/system/operator/operationLog'
export default {
  name: 'OperationLog',
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
      operationLogTableList: [],
      // 状态数据字典
      statusOptions: [],
      // 业务类型数据字典   其他 后台 手机
      businessTypeOptions: [],
      // 查询的时间范围
      dateRange: [],
      // 查询参数  匹配操作时间
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined, // 模块名称
        operName: undefined, // 操作人名称
        status: undefined, // 状态
        businessType: undefined // 业务类型 其他  后台  手机端
      }
    }
  },
  // 初始化
  created() {
    // 查询条件中的状态码表
    this.getDataByType('sys_common_status').then(res => {
      this.statusOptions = res.data
    })
    // 查询条件中的业务类型码表
    this.getDataByType('sys_oper_type').then(res => {
      this.businessTypeOptions = res.data
    })
    // 初始化查询数据
    this.getOperationLogList()
  },
  // 自定义方法
  methods: {
    // 查询操作日志
    getOperationLogList() {
      // 开启遮罩
      this.loading = true
      listForPage(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        // 将查询结果绑定到列表对象那个
        this.operationLogTableList = res.data
        // 保存总条数
        this.total = res.total
        // 关闭遮罩
        this.loading = false
      })
    },
    // 条件查询
    handleQuery() {
      this.getOperationLogList()
    },
    // 重置查询条件
    resetQuery() {
      // 重置查询对象
      this.resetForm('queryForm')
      // 重新加载数据
      this.getOperationLogList()
    },
    // 删除
    handleDelete(row) {
      // 获取要删除的记录id，如果row不为空，那么就是删除一个id，否则批量删除ids
      const operIds = row.operId || this.ids
      this.$confirm('此操作将永久删除操作日志数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 执行删除，开启遮罩
        this.loading = true
        deleteOperationLogByIds(operIds).then(res => {
          // 提示操作成功信息
          this.msgSuccess('删除成功')
          // 关闭遮罩
          this.loading = false
          // 重新查询数据
          this.getOperationLogList()
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
      this.$confirm('此操作将永久清空操作日志数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        clearAllOperationLog().then(res => {
          this.msgSuccess('清空成功')
          this.loading = false
          this.getOperationLogList()
        })
      }).catch(() => {
        this.msgError('取消清空操作')
        this.loading = false
      })
    },
    // 勾选数据时触发
    handleSelectionChange(selection) {
      // 将勾选的数据id存放到数组中
      this.ids = selection.map(item => item.operId)
      // 默认为true，删除按钮不可使用，当选择至少一个后，变为false，可以进行删除（含批量）
      this.multiple = !selection.length
    },
    // 分页pageSize变化时触发
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      // 重新查询
      this.getOperationLogList()
    },
    // 点击上一页  下一页，跳转到指定页面时触发
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      // 重新查询
      this.getOperationLogList()
    },
    // 码表转换（状态）
    statusFormatter(row) {
      return this.transferDictCode(this.statusOptions, row.status)
    },
    // 码表转换（操作类型）
    businessTypeFormatter(row) {
      return this.transferDictCode(this.businessTypeOptions, row.businessType)
    }
  }
}
</script>
<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
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
