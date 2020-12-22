<template>
  <div class="app-container">
    <!--操作栏按钮开始-->
    <el-card class="box-card">
      <div style="text-align:right;">
        <el-button type="primary" icon="el-icon-plus" :disabled="isSubmit" size="small" @click="handleAddMedicines">添加药品</el-button>
        <el-button type="success" icon="el-icon-s-operation" :disabled="isSubmit" size="small" @click="handleBatchSet">批量设置</el-button>
        <el-button type="warning" icon="el-icon-check" :disabled="isSubmit" size="small" @click="handleSubmit">暂存</el-button>
        <el-button type="danger" icon="el-icon-finished" :disabled="isSubmit" size="small" @click="handleSubmitAndAudit">提交审核</el-button>
      </div>
    </el-card>
    <!--操作栏按钮结束-->
    <!--采购单据表单开始-->
    <el-card class="box-card">
      <el-form ref="form" :model="form" :inline="true" label-width="90px">
        <el-row :gutter="10">
          <el-col :span="1.5">
            <el-form-item label="入库单据号" prop="purchaseId">
              <el-input
                v-model="form.purchaseId"
                placeholder="请输入入库单据号"
                :disabled="true"
                size="small"
                style="width:220px">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1.5">
            <el-form-item label="供应商" prop="providerId">
              <el-select
                v-model="form.providerId"
                placeholder="请选择供应商"
                size="small"
                style="width: 220px">
                <el-option
                  v-for="item in providerOptions"
                  :label="item.providerName"
                  :value="item.providerId"
                  :key="item.providerId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1.5">
            <el-form-item label="总批发金额" prop="purchaseTradeTotalAmount">
              <el-input
                v-model="form.purchaseTradeTotalAmount"
                placeholder="请输入总批发金额"
                :disabled="true"
                size="small"
                style="width:220px">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!--采购单据表单结束-->
    <!--采购单据详情开始-->
    <el-card class="box-card">
      <el-table
        :data="purchaseItemList"
        class="tb-edit"
        style="width: 100%"
        border
        highlight-current-row
      >
        <el-table-column label="药品Id" align="center" width="80" prop="medicinesId"></el-table-column>
        <el-table-column label="药品名称" align="center" width="100" prop="medicinesName"></el-table-column>
        <!--规格并没有保存到数据库，只是根据已有数据进行拼接显示-->
        <el-table-column label="规格" align="center" width="60">
          <template slot-scope="scope">
            <span>{{scope.row.conversion}}{{scope.row.unit}}</span>
          </template>
        </el-table-column>
        <el-table-column label="生产厂家" align="center" width="200" prop="producterId" :formatter="producterFormatter"></el-table-column>
        <el-table-column label="数量" align="center" width="155" prop="purchaseNumber">
          <template slot-scope="scope">
           <el-input-number v-model="scope.row.purchaseNumber" size="small" :step="1" :min="1"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="单位" align="center" width="80" prop="unit"></el-table-column>
        <el-table-column label="批发价" align="center" width="155" prop="tradePrice">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.tradePrice" size="small" :step="0.1" :min="0.1" :precision="2"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="批发额" align="center" width="80" prop="tradeTotalAmount">
          <template slot-scope="scope">
            <span>{{scope.row.tradeTotalAmount | accurate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="药品生产批次号" align="center" width="180" prop="batchNumber">
          <template slot-scope="scope">
            <el-input v-model="scope.row.batchNumber" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" width="180" prop="remark">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--采购单据详情结束-->
    <!--药品列表模态框开始-->
    <el-dialog
      :title="titleMedicines"
      :visible.sync="openMedicines"
      width="1100px"
      center
      append-to-body
      :before-close="closeModal"
    >
      <!-- 查询条件开始 -->
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
        <el-form-item label="关键字" prop="keywords">
          <el-input
            v-model="queryParams.keywords"
            placeholder="请输入关键字"
            clearable
            size="small"
            style="width:180px"
          />
        </el-form-item>
        <el-form-item label="药品类型" prop="medicinesType">
          <el-select
            v-model="queryParams.medicinesType"
            placeholder="药品类型"
            clearable
            size="small"
            style="width:180px"
          >
            <el-option
              v-for="dict in medicinesTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="处方类型" prop="prescriptionType">
          <el-select
            v-model="queryParams.prescriptionType"
            placeholder="处方类型"
            clearable
            size="small"
            style="width:180px"
          >
            <el-option
              v-for="dict in prescriptionTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">清空</el-button>
        </el-form-item>
      </el-form>
      <!-- 查询条件结束 -->
      <!-- 药品的数据表格开始 -->
      <el-table ref="medicinesTableList" v-loading="loading" border :data="medicinesTableList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="药品ID" align="center" prop="medicinesId" />
        <el-table-column label="药品名称" align="center" prop="medicinesName" />
        <el-table-column label="药品编号" align="center" prop="medicinesNumber" />
        <el-table-column label="生产厂家" width="280px" align="center" prop="producterId" :formatter="producterFormatter" />
        <el-table-column label="药品类型" align="center" prop="medicinesType" :formatter="medicinesTypeFormatter" />
        <el-table-column label="处方类型" align="center" prop="prescriptionType" :formatter="prescriptionTypeFormatter" />
        <el-table-column label="关键字" align="center" prop="keywords" />
      </el-table>
      <!-- 药品的数据表格结束 -->
      <!-- 分页控件开始 -->
      <el-pagination
        v-show="total>0"
        :current-page="queryParams.pageNum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <!-- 分页控件结束 -->
    </el-dialog>
    <!--药品列表模态框结束-->
  </div>
</template>

<script>
// 引入药品信息api
import { listMedicinesForPage } from '@/api/erp/medicines/medicines'
// 引入供应商API
import { selectAllProvider } from '@/api/erp/provider/provider'
// 引入生产厂家api
import { selectAllProducter } from '@/api/erp/producter/producter'
// 引入api
import { generatePurchaseId } from '@/api/erp/purchase/purchase'
export default {
  name: 'NewPurchase',
  // 过滤器   页面渲染数据之前使用
  filters: {
    accurate(value) {
      // 保留两位小数
      return value.toFixed(2)
    }
  },
  data() {
    return {
      // 遮罩
      loading: false,
      // 是否打开药品的模态框
      openMedicines: false,
      // 药品模态框标题
      titleMedicines: '',
      // 分页总条数
      total: '',
      // 是否已经提交
      isSubmit: false,
      // 查询条件供应商数据
      providerOptions: [],
      // 详情列表生产厂家数据
      producterOptions: [],
      // 药品类型数据
      medicinesTypeOptions: [],
      // 处方类型数据
      prescriptionTypeOptions: [],
      // 入库单据详情列表数据
      purchaseItemList: [],
      // 药品数据列表信息
      medicinesTableList: [],
      // 入库单据数据
      form: {
        purchaseId: undefined, // 入库单据号
        providerId: undefined, // 供应商id
        purchaseTradeTotalAmount: undefined // 一张单据的总批发额
      },
      // 药品列表查询条件
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        keywords: undefined,
        medicinesType: undefined,
        prescriptionType: undefined
      },
      selectMedicines: [] // 药品模态框中选中的数据
    }
  },
  created() {
    // 调用后台生成单据号
    generatePurchaseId().then(res => {
      this.form.purchaseId = res.msg
    })
    // 查询供应商数据，并填充在下拉列表中
    selectAllProvider().then(res => {
      this.providerOptions = res.data
    })
    // 查询生产厂家数据，在详情列表转换
    selectAllProducter().then(res => {
      this.producterOptions = res.data
    })
    // 查询药品类型数据，转换码表
    this.getDataByType('his_medicines_type').then(res => {
      // 将查询到的状态信息保存到当前页面对应的属性中
      this.medicinesTypeOptions = res.data
    })
    // 查询处方类型数据，转换码表
    this.getDataByType('his_prescription_type').then(res => {
      // 将查询到的状态信息保存到当前页面对应的属性中
      this.prescriptionTypeOptions = res.data
    })
  },
  methods: {
    // 查询数据列表数据
    getMedicinesList() {
      this.loading = true
      listMedicinesForPage(this.queryParams).then(res => {
        this.medicinesTableList = res.data
        this.total = res.total
        this.loading = false
        this.$nextTick(() => {
          // 根据详情列表数据，在点击添加药品时，进行数据的反选
          // 因为关闭添加药品模态框的时候，会清除选中数据
          // 这时候只需要设置好哪些需要选中即可
          this.medicinesTableList.filter(r1 => {
            this.purchaseItemList.filter(r2 => {
              if (parseInt(r1.medicinesId) === parseInt(r2.medicinesId)) {
                this.$refs.medicinesTableList.toggleRowSelection(r1, true)
              }
            })
          })
        })
      })
    },
    // 添加药品模态框
    handleAddMedicines() {
      this.openMedicines = true
      this.titleMedicines = '选择要添加的药品信息'
      this.getMedicinesList()
    },
    // 批量设置模态框
    handleBatchSet() {
    },
    // 暂存
    handleSubmit() {
    },
    // 提交审核
    handleSubmitAndAudit() {
    },
    // 删除一行入库详情数据,当前删除行的索引和行数据
    handleDelete(index, row) {
      this.purchaseItemList.splice(index, 1)
    },
    // 转换生产厂家信息
    producterFormatter(row) {
      let name = ''
      this.producterOptions.filter(item => {
        if (parseInt(item.producterId) === parseInt(row.producterId)) {
          name = item.producterName
        }
      })
      return name
    },
    medicinesTypeFormatter(row) {
      return this.transferDictCode(this.medicinesTypeOptions, row.medicinesType)
    },
    prescriptionTypeFormatter(row) {
      return this.transferDictCode(this.prescriptionTypeOptions, row.prescriptionType)
    },
    // 查询操作
    handleQuery() {
      // 执行实际的查询方法
      // 因为输入的查询条件实时与queryParams动态绑定
      this.getMedicinesList()
    },
    // 清空查询条件操作
    resetQuery() {
      // 清空查询数据
      this.resetForm('queryForm')
      // 重新查询数据列表,相当于执行一次无查询条件的查询操作,如果不调用这个方法,那么清空操作后,数据列表不会同步改变
      this.getMedicinesList()
    },
    // 改变数据列表第一列多选框选中状态所触发的方法,selection为选择的内容
    handleSelectionChange(selection) {
      this.selectMedicines = selection
      this.selectMedicines.filter(m1 => {
        let flag = false
        // 判断purchaseItemList里面有没有已选择的ID
        this.purchaseItemList.filter(purch => {
          if (m1.medicinesId === purch.medicinesId) {
            flag = true
          }
        })
        // 如果没有，就加入purchaseItemList
        if (!flag) {
          // 放到purchaseItemList对象是selection深度clone
          this.purchaseItemList.push(JSON.parse(JSON.stringify(m1)))
        }
      })
      // 剔除里面不用的属性，添加需要的属性
      this.purchaseItemList.filter(m => {
        this.$delete(m, 'status')
        this.$delete(m, 'medicinesStockNum')
        this.$delete(m, 'medicinesStockDangerNum')
        this.$delete(m, 'createTime')
        this.$delete(m, 'updateTime')
        this.$delete(m, 'createBy')
        this.$delete(m, 'updateBy')

        this.$set(m, 'purchaseNumber', m.purchaseNumber ? m.purchaseNumber : 1)
        this.$set(m, 'tradePrice', m.tradePrice ? m.tradePrice : 0.00)
        this.$set(m, 'tradeTotalAmount', m.tradeTotalAmount ? m.tradeTotalAmount : 0.00)
        this.$set(m, 'batchNumber', m.batchNumber ? m.batchNumber : '')
        this.$set(m, 'remark', m.remark ? m.remark : '')
      })
    },
    // 改变每页显示条数的时候触发
    handleSizeChange(val) {
      // 更新每页显示条数
      this.queryParams.pageSize = val
      // 重新查询
      this.getMedicinesList()
    },
    // 当前页改变时触发(前一页,点击某一页,下一页,跳转某一页)
    handleCurrentChange(val) {
      // 更新需要显示的第几页数
      this.queryParams.pageNum = val
      // 重新查询
      this.getMedicinesList()
    },
    // 关闭药品模态框需要清空数据
    closeModal(done) {
      this.resetQuery()
      done()
    }
  }
}
</script>

<style scoped>
 .box-card{
   padding: 0px;
   margin: 0px;
   margin-bottom: 8px;
 }
</style>
