<!--字典类型页面-->
<template>
  <div class="app-container">
    <!--查询条件开始-->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="90px">
      <el-form-item label="供应商" prop="providerId">
        <el-select
          v-model="queryParams.providerId"
          placeholder="请选择供应商"
          clearable
          size="small"
          style="width:140px"
        >
          <el-option
            v-for="dict in providerOptions"
            :key="dict.providerId"
            :label="dict.providerName"
            :value="dict.providerId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请人" prop="applyUserName">
        <el-input
          v-model="queryParams.applyUserName"
          placeholder="请输入申请人"
          clearable
          size="small"
          style="width:140px"
        />
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
      <el-form-item>
        <!--查询和清空按钮-->
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">清空</el-button>
      </el-form-item>
    </el-form>
    <!--查询条件结束-->
    <!--操作栏按钮开始-->
    <el-row :gutter="10" style="margin-bottom: 8px;">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增采购</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="!single" @click="handleDoAudit">提交审核</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="!single" @click="handleDoInvalid">作废</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-delete" size="mini" :disabled="!multiple" @click="handleCommit">提交入库</el-button>
      </el-col>
    </el-row>
    <!--操作栏按钮结束-->
    <!--数据列表开始-->
    <el-table v-loading="loading" border :data="purchaseTableList" @selection-change="handleSelectionChange">
      <!--el-table-column:每一行中的每一列
        prop:对应从:data中取出的数据
        align:对齐方式
        label:列名
        show-overflow-tooltip:默认情况下数据过长不够显示的时候是换行显示,如果需要单行显示,可以使用这个,并且当鼠标移动到此处时会显示实际内容的提示信息
      -->
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="入库单据id" prop="purchaseId" align="center" />
      <el-table-column label="供应商名称" prop="providerId" width="180" align="center" :formatter="providerFormatter"/>
      <el-table-column label="采购批发总额" prop="purchaseTradeTotalAmount" align="center"/>
      <el-table-column label="状态" prop="status" align="center" :formatter="statusFormatter"/>
      <el-table-column label="申请人" prop="applyUserName" align="center"/>
      <el-table-column label="入库操作人" prop="storageOptUser" align="center"/>
      <el-table-column label="入库时间" prop="storageOptTime" width="180" align="center"/>
      <el-table-column label="审核信息" prop="auditMsg" align="center"/>
      <el-table-column label="创建时间" prop="createTime" align="center" width="180" />
    </el-table>
    <!--数据列表结束-->
    <!--底部分页开始-->
    <!--pagination:分页控件
      v-show:控制是否显示分页控件的条件,当数据列表中数据不为空才显示
      current-page:当前显示第几页
      page-sizes:可选的每页显示条数
      page-size:默认每页显示条数
      layout:设置分页格式:总数,每页条数,前一页,当前页,下一页,跳转至某一页
      total:总数
      @size-change:改变每页显示条数后触发方法
      @current-change:当前页发生改变的时候触发的方法
    -->
    <el-pagination
      v-show="total > 0"
      :current-page="queryParams.pageNum"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="queryParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--底部分页结束-->
  </div>
</template>

<script>
// 引入采购入库相关api
import { listPurchaseForPage, doAudit, doInvalid } from '@/api/erp/purchase/purchase'
// 引入供应商api
import { selectAllProvider } from '@/api/erp/provider/provider'
export default {
  name: 'Purchase',
  data() {
    return {
      // 是否启用遮罩层,请求后台时出现进度条(如果请求响应很快的话,可能看不到)
      // 体现在页面上就是一个页面中心一个转圈的显示
      loading: false,
      // 选中的字典类型的id集合
      ids: [],
      // 判断是否选中了单条记录,进而控制一些页面行为,比如选中了单个可以进行修改操作
      single: false,
      // 判断是否选中了多条记录,进行控制一些页面行为,比如选中了多个可以进行批量删除操作
      multiple: false,
      // 分页数据总条数
      total: 0,
      // 数据列表中数据(字典类型)
      purchaseTableList: [],
      // 是否显示模态框
      open: false,
      // 查询条件中单据状态的码表
      statusOptions: [],
      // 查询条件中的供应商信息
      providerOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1, // 默认第一页
        pageSize: 10, // 每页默认10条
        providerId: undefined, // 供应商id
        applyUserName: undefined, // 申请人
        status: undefined // 单据状态
      }
    }
  },
  // 生命周期,钩子函数  在实例创建完成后被立即调用
  created() {
    // 使用全局的根据字典类型查询字典数据的方法来获取查询条件中的状态信息
    this.getDataByType('his_order_status').then(res => {
      // 将查询到的状态信息保存到当前页面对应的属性中
      this.statusOptions = res.data
    })
    // 获取生产厂家列表
    selectAllProvider().then(res => {
      this.providerOptions = res.data
    })
    // 最后查询列表
    // 加载页面时,需要进行初始化数据,调用查询数据列表的方法
    this.getPurchaseList()
  },
  methods: {
    // 查询数据列表数据
    getPurchaseList() {
      // 打开遮罩
      this.loading = true
      // 调用分页查询的api方法
      // listForPage(this.queryParams).then(res => {
      // 通过addDateRange封装起始时间和结束时间
      listPurchaseForPage(this.queryParams).then(res => {
        // 将分页数据传递给数据类表绑定的data数据
        this.purchaseTableList = res.data
        // 查询到数据了,就要显示分页了
        this.total = res.total
        // 关闭遮罩
        this.loading = false
      })
    },
    // 查询操作
    handleQuery() {
      // 执行实际的查询方法
      // 因为输入的查询条件实时与queryParams动态绑定
      this.getPurchaseList()
    },
    // 清空查询条件操作
    resetQuery() {
      // 清空查询数据
      this.resetForm('queryForm')
      // 重新查询数据列表,相当于执行一次无查询条件的查询操作,如果不调用这个方法,那么清空操作后,数据列表不会同步改变
      this.getPurchaseList()
    },
    // 改变数据列表第一列多选框选中状态所触发的方法,selection为选择的内容
    handleSelectionChange(selection) {
      // selection保存着勾选的一条数据，以数组形式存储，对象为一个单位
      this.single = selection.length === 1
      this.multiple = selection.length > 1
      // 保存勾选的数据的id  item表示取出数组中一个数据，然后获取到该条数据的id，遍历完成后，ids拿到所有勾选的id
      this.ids = selection.map(item => item.purchaseId)
    },
    // 转换字典数据(code值与实际显示值)
    statusFormatter(row) {
      return this.transferDictCode(this.statusOptions, row.status)
    },
    providerFormatter(row) {
      let name = ''
      this.providerOptions.filter(item => {
        if (parseInt(item.providerId) === parseInt(row.providerId)) {
          name = item.providerName
        }
      })
      return name
    },
    // 改变每页显示条数的时候触发
    handleSizeChange(val) {
      // 更新每页显示条数
      this.queryParams.pageSize = val
      // 重新查询
      this.getPurchaseList()
    },
    // 当前页改变时触发(前一页,点击某一页,下一页,跳转某一页)
    handleCurrentChange(val) {
      // 更新需要显示的第几页数
      this.queryParams.pageNum = val
      // 重新查询
      this.getPurchaseList()
    },
    // 新增入库单据
    handleAdd() {
      //
    },
    // 提交审核方法
    handleDoAudit() {
      // 获取要提交审核的入库单据id
      const purchaseId = this.ids[0]
      // 确认框显示
      this.$confirm('是否确认将单据Id为：' + purchaseId + '的单据提交给上级审核？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 开启遮罩
        this.loading = true
        // 调用api执行删除操作
        doAudit(purchaseId).then(res => {
          // 关闭遮罩
          this.loading = false
          // 操作成功提示
          this.msgSuccess('提交审核成功')
          // 重新查询数据列表
          this.getPurchaseList()
        }).catch(() => {
          this.loading = false
          // 操作失败提示
          this.msgError('提交审核失败')
        })
      }).catch(() => {
        // 关闭遮罩
        this.loading = false
        // 操作失败提示
        this.msgInfo('取消提交审核操作')
      })
    },
    // 作废方法
    handleDoInvalid(row) {
      // 获取要提交审核的入库单据id
      const purchaseId = this.ids[0]
      // 确认框显示
      this.$confirm('是否确认将单据Id为：' + purchaseId + '的单据进行作废？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 开启遮罩
        this.loading = true
        // 调用api执行删除操作
        doInvalid(purchaseId).then(res => {
          // 关闭遮罩
          this.loading = false
          // 操作成功提示
          this.msgSuccess('作废成功')
          // 重新查询数据列表
          this.getPurchaseList()
        }).catch(() => {
          this.loading = false
          // 操作失败提示
          this.msgError('作废失败')
        })
      }).catch(() => {
        // 关闭遮罩
        this.loading = false
        // 操作失败提示
        this.msgInfo('取消作废操作')
      })
    },
    // 提交入库
    handleCommit() {
      //
    }
  }
}
</script>

<style scoped>

</style>
