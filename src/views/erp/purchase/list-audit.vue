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
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="!single" @click="handleGetDetail">查看单据详情</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-delete" size="mini" :disabled="!single" @click="handleAuditPass">审核通过</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="!single" @click="handleAuditRefuse">审核不通过</el-button>
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
      <el-table-column label="采购批发总额" prop="purchaseTradeTotalAmount" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.purchaseTradeTotalAmount | accurate}}</span>
        </template>
      </el-table-column>
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
    <!--单据详情的模态框开始-->
    <el-dialog
      :title="title"
      :visible.sync="isDetail"
      width="1000px"
      center
      append-to-body
    >
      <el-table v-loading="detailLoading" border :data="purchaseItemTableList">
        <!--el-table-column:每一行中的每一列
          prop:对应从:data中取出的数据
          align:对齐方式
          label:列名
          show-overflow-tooltip:默认情况下数据过长不够显示的时候是换行显示,如果需要单行显示,可以使用这个,并且当鼠标移动到此处时会显示实际内容的提示信息
        -->
        <el-table-column label="详情Id" prop="itemId" width="170px" align="center" />
        <el-table-column label="采购单据Id" prop="purchaseId" width="195px" align="center"/>
        <el-table-column label="采购数量" prop="purchaseNumber" align="center"/>
        <el-table-column label="批发价格" prop="tradePrice" align="center" />
        <el-table-column label="药品批发金额" prop="tradeTotalAmount" align="center" />
        <el-table-column label="批次号" prop="batchNumber" align="center"/>
        <el-table-column label="药品名称" prop="medicinesName" align="center"/>
        <el-table-column label="换算量" prop="conversion" align="center"/>
        <el-table-column label="单位（g/条）" prop="unit" align="center" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">关 闭</el-button>
      </span>
    </el-dialog>
    <!--单据详情的模态框结束-->
  </div>
</template>

<script>
// 引入采购入库相关api
import { listPurchasePendingForPage, auditPass, auditRefuse, getPurchaseItemById } from '@/api/erp/purchase/purchase'
// 引入供应商api
import { selectAllProvider } from '@/api/erp/provider/provider'
export default {
  name: 'ListAudit',
  // 过滤器   页面渲染数据之前使用
  filters: {
    accurate(value) {
      // 保留两位小数
      return value.toFixed(2)
    }
  },
  data() {
    return {
      // 是否打开查看详情模态框
      isDetail: false,
      // 模态框标题
      title: '',
      // 是否启用遮罩层,请求后台时出现进度条(如果请求响应很快的话,可能看不到)
      // 体现在页面上就是一个页面中心一个转圈的显示
      loading: false,
      detailLoading: false,
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
      // 入库单据详情
      purchaseItemTableList: [],
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
        applyUserName: undefined // 申请人
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
      listPurchasePendingForPage(this.queryParams).then(res => {
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
    handleGetDetail() {
      // 显示模态框
      this.isDetail = true
      // 设置标题
      this.title = '查看入库单据详情信息'
      // 获取选中的入库单据id
      const purchaseId = this.ids[0]
      // 加载遮罩
      this.detailLoading = true
      // 查询对应入库单据id的详情数据
      getPurchaseItemById(purchaseId).then(res => {
        this.purchaseItemTableList = res.data
        this.detailLoading = false
      })
    },
    // 关闭模态框
    close() {
      // 关闭
      this.isDetail = false
      // 清空列表数据,也可以不清空，打开模态框时会查询后替换原有值
    },
    // 审核通过
    handleAuditPass() {
      // 获取要提交审核的入库单据id
      const purchaseId = this.ids[0]
      // 确认框显示
      this.$confirm('是否确认审核通过单据Id为：' + purchaseId + '的单据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 开启遮罩
        this.loading = true
        // 调用api执行删除操作
        auditPass(purchaseId).then(res => {
          // 关闭遮罩
          this.loading = false
          // 操作成功提示
          this.msgSuccess('审核通过成功')
          // 重新查询数据列表
          this.getPurchaseList()
        }).catch(() => {
          this.loading = false
          // 操作失败提示
          this.msgError('审核通过失败')
        })
      }).catch(() => {
        // 关闭遮罩
        this.loading = false
        // 操作失败提示
        this.msgInfo('取消审核通过操作')
      })
    },
    // 审核不通过
    handleAuditRefuse() {
      // 获取要提交审核的入库单据id
      const purchaseId = this.ids[0]
      this.$prompt('请输入审核不通过原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        // 开启遮罩
        this.loading = true
        // 调用api执行删除操作
        auditRefuse(purchaseId, value).then(res => {
          // 关闭遮罩
          this.loading = false
          // 操作成功提示
          this.msgSuccess('审核不通过成功')
          // 重新查询数据列表
          this.getPurchaseList()
        }).catch(() => {
          this.loading = false
          // 操作失败提示
          this.msgError('审核不通过失败')
        })
      }).catch(() => {
        // 关闭遮罩
        this.loading = false
        // 操作失败提示
        this.msgInfo('取消审核不通过操作')
      })
    }
  }
}
</script>

<style scoped>

</style>
