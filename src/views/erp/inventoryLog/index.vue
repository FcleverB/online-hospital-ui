<template>
  <div class="app-container">
    <el-tabs v-model="activeName" :stretch="true" @tab-click="handleClick">
      <el-tab-pane label="药品总库存" name="medicinesTab">
        <!--查询条件-->
        <el-form ref="medicinesQueryForm" :model="medicinesQueryParams" :inline="true" label-width="68px">
          <el-form-item label="药品名称" prop="medicinesName">
            <el-input
              v-model="medicinesQueryParams.medicinesName"
              placeholder="请输入药品名称"
              clearable
              size="small"
              style="width:140px"
            />
          </el-form-item>
          <el-form-item label="关键字" prop="keywords">
            <el-input
              v-model="medicinesQueryParams.keywords"
              placeholder="请输入关键字"
              clearable
              size="small"
              style="width:140px"
            />
          </el-form-item>
          <el-form-item label="药品类型" prop="medicinesType">
            <el-select
              v-model="medicinesQueryParams.medicinesType"
              placeholder="请选择药品类型"
              clearable
              size="small"
              style="width:140px"
            >
              <el-option
                v-for="dict in medicinesTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="生产厂家" prop="producterId">
            <el-select
              v-model="medicinesQueryParams.producterId"
              placeholder="请选择生产厂家"
              clearable
              size="small"
              style="width:200px"
            >
              <el-option
                v-for="dict in producterOptions"
                :key="dict.producterId"
                :label="dict.producterName"
                :value="dict.producterId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="处方类型" prop="prescriptionType">
            <el-select
              v-model="medicinesQueryParams.prescriptionType"
              placeholder="请选择处方类型"
              clearable
              size="small"
              style="width:140px"
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
            <!--查询和清空按钮-->
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">清空</el-button>
          </el-form-item>
        </el-form>
        <!--数据列表-->
        <el-table v-loading="loading" border :data="medicinesTableList">
          <!--el-table-column:每一行中的每一列
            prop:对应从:data中取出的数据
            align:对齐方式
            label:列名
            show-overflow-tooltip:默认情况下数据过长不够显示的时候是换行显示,如果需要单行显示,可以使用这个,并且当鼠标移动到此处时会显示实际内容的提示信息
          -->
          <el-table-column label="药品ID" prop="medicinesId" align="center" />
          <el-table-column label="药品名称" prop="medicinesName" align="center"/>
          <el-table-column label="药品编号" prop="medicinesNumber" align="center"/>
          <el-table-column label="关键字" prop="keywords" align="center"/>
          <el-table-column label="生产厂家" prop="producterId" width="250px" align="center" :formatter="producterFormatter"/>
          <el-table-column label="药品类型" prop="medicinesType" align="center" :formatter="medicinesTypeFormatter"/>
          <el-table-column label="处方类型" prop="prescriptionType" align="center" :formatter="prescriptionTypeFormatter"/>
          <el-table-column label="库存量" prop="medicinesStockNum" align="center"/>
          <el-table-column label="预警值" prop="medicinesStockDangerNum" align="center"/>
        </el-table>
        <!--分页-->
        <el-pagination
          v-show="totalMedicines > 0"
          :current-page="medicinesQueryParams.pageNum"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="medicinesQueryParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalMedicines"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-tab-pane>
      <el-tab-pane label="入库信息" name="inventoryLogTab">
        <!--查询条件-->
        <el-form ref="inventoryLogQueryForm" :model="inventoryLogQueryParams" :inline="true" label-width="90px">
          <el-form-item label="入库单据id" prop="purchaseId">
            <el-input
              v-model="inventoryLogQueryParams.purchaseId"
              placeholder="请输入入库单据id"
              clearable
              size="small"
              style="width:150px"
            />
          </el-form-item>
          <el-form-item label="药品名称" prop="medicinesName">
            <el-input
              v-model="inventoryLogQueryParams.medicinesName"
              placeholder="请输入药品名称"
              clearable
              size="small"
              style="width:140px"
            />
          </el-form-item>
          <el-form-item label="药品类型" prop="medicinesType">
            <el-select
              v-model="inventoryLogQueryParams.medicinesType"
              placeholder="请选择药品类型"
              clearable
              size="small"
              style="width:140px"
            >
              <el-option
                v-for="dict in medicinesTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <!--date-picker:日期选择框
              value-format:日期格式
              type:类型,这里是可以选取范围数据
              range-separator:分隔符,页面显示中会把开始日期和结束日期用该符号分割开
              start-placeholder:第一个空的默认显示内容
              end-placeholder:第二个空的默认显示内容
            -->
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
            <!--查询和清空按钮-->
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">清空</el-button>
          </el-form-item>
        </el-form>
        <!--数据列表-->
        <el-table v-loading="loading" border :data="inventoryLogTableList">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="药品ID">
                  <span>{{ props.row.medicinesId }}</span>
                </el-form-item>
                <el-form-item label="入库单据id">
                  <span>{{ props.row.purchaseId }}</span>
                </el-form-item>
                <el-form-item label="规格">
                  <span>{{ props.row.conversion }}{{ props.row.unit }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="入库id" align="center" width="190px" prop="inventoryLogId" />
          <el-table-column label="药品名称" align="center" prop="medicinesName" />
          <el-table-column label="入库数量" align="center" prop="inventoryLogNum" />
          <el-table-column label="批发价" align="center" prop="tradePrice">
            <template slot-scope="scope">
              <span>{{ scope.row.tradePrice|accurate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="批发额" align="center" prop="tradeTotalAmount">
            <template slot-scope="scope">
              <span>{{ scope.row.tradeTotalAmount|accurate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="批次号" align="center" prop="batchNumber" />
          <el-table-column label="生产厂家" width="280px" align="center" prop="producterId" :formatter="producterFormatter" />
          <el-table-column label="药品类型" align="center" prop="medicinesType" :formatter="medicinesTypeFormatter" />
          <el-table-column label="处方类型" align="center" prop="prescriptionType" :formatter="prescriptionTypeFormatter" />
          <el-table-column label="入库时间" width="180px" align="center" prop="createTime" />
        </el-table>
        <!--分页-->
        <el-pagination
          v-show="totalInventoryLog > 0"
          :current-page="inventoryLogQueryParams.pageNum"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="inventoryLogQueryParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalInventoryLog"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// 引入供应商api
import { selectAllProducter } from '@/api/erp/producter/producter'
// 引入药品api
import { listMedicinesForPage } from '@/api/erp/medicines/medicines'
// 引入入库操作api
import { listInventoryLogForPage } from '@/api/erp/inventoryLog/inventoryLog'

export default {
  name: 'Inventory',
  filters: {
    accurate(value) {
      return value.toFixed(2)
    }
  },
  data() {
    return {
      // 标签页--当前选中的标签，根据name匹配
      activeName: 'medicinesTab',
      // 是否启用遮罩层,请求后台时出现进度条(如果请求响应很快的话,可能看不到)
      // 体现在页面上就是一个页面中心一个转圈的显示
      loading: false,
      // 选中的字典类型的id集合
      ids: [],
      // 药品分页数据总条数
      totalMedicines: 0,
      // 入库分页总条数
      totalInventoryLog: 0,
      // 数据列表中药品数据
      medicinesTableList: [],
      // 数据列表中入库信息数据
      inventoryLogTableList: [],
      // 查询条件中药品类型的码表
      medicinesTypeOptions: [],
      // 查询条件中药品类型的码表
      producterOptions: [],
      // 查询条件中处方类型的码表
      prescriptionTypeOptions: [],
      // 药品查询参数
      medicinesQueryParams: {
        pageNum: 1, // 默认第一页
        pageSize: 10, // 每页默认10条
        medicinesName: undefined, // 药品名称
        medicinesType: undefined, // 药品类型
        keywords: undefined, // 关键字
        prescriptionType: undefined, // 处方类型
        producterId: undefined // 生产厂家
      },
      dateRange: [], // 创建时间范围搜索
      // 入库信息查询参数
      inventoryLogQueryParams: {
        pageNum: 1, // 默认第一页
        pageSize: 10, // 每页默认10条
        purchaseId: undefined, // 采购单据id
        medicinesName: undefined, // 药品名称
        medicinesType: undefined, // 药品类型
        producterId: undefined, // 生产厂家id
        prescriptionType: undefined // 处方类型
      }
    }
  },
  // 生命周期,钩子函数  在实例创建完成后被立即调用
  created() {
    // 药品类型
    this.getDataByType('his_medicines_type').then(res => {
      this.medicinesTypeOptions = res.data
    })
    // 药品  需要调用药品API
    selectAllProducter().then(res => {
      this.producterOptions = res.data
    })
    // 处方类型
    this.getDataByType('his_prescription_type').then(res => {
      this.prescriptionTypeOptions = res.data
    })
    // 最后查询列表
    // 加载页面时,需要进行初始化数据,调用查询数据列表的方法
    // 切换到该菜单时，默认显示药品数据
    this.getMedicinesList()
  },
  methods: {
    // 切换标签页触发的方法
    handleClick(tab, event) {
      // 切换标签需要清除跳转前页面的各种数据，重新查询
      if (this.activeName === 'medicinesTab') {
        // 跳转时需要清除前标签页的查询内容
        this.resetForm('inventoryLogQueryForm')
        this.dateRange = []
        this.getMedicinesList()
      } else {
        // 跳转时需要清除前标签页的查询内容
        this.resetForm('medicinesQueryForm')
        this.getInventoryLogList()
      }
    },
    // 查询药品数据列表数据
    getMedicinesList() {
      // 打开遮罩
      this.loading = true
      // 调用分页查询的api方法
      // listForPage(this.queryParams).then(res => {
      // 通过addDateRange封装起始时间和结束时间
      listMedicinesForPage(this.medicinesQueryParams).then(res => {
        // 将分页数据传递给数据类表绑定的data数据
        this.medicinesTableList = res.data
        // 查询到数据了,就要显示分页了
        this.totalMedicines = res.total
        // 关闭遮罩
        this.loading = false
      })
    },
    // 查询库存数据列表数据
    getInventoryLogList() {
      // 打开遮罩
      this.loading = true
      // 调用分页查询的api方法
      // listForPage(this.queryParams).then(res => {
      // 通过addDateRange封装起始时间和结束时间
      listInventoryLogForPage(this.addDateRange(this.inventoryLogQueryParams, this.dateRange)).then(res => {
        // 将分页数据传递给数据类表绑定的data数据
        this.inventoryLogTableList = res.data
        // 查询到数据了,就要显示分页了
        this.totalInventoryLog = res.total
        // 关闭遮罩
        this.loading = false
      })
    },
    // 药品查询操作
    handleQuery() {
      if (this.activeName === 'medicinesTab') {
        this.getMedicinesList()
      } else {
        this.getInventoryLogList()
      }
    },
    // 药品清空查询条件操作
    resetQuery() {
      if (this.activeName === 'medicinesTab') {
        // 清空查询数据
        this.resetForm('medicinesQueryForm')
        // 重新查询数据列表,相当于执行一次无查询条件的查询操作,如果不调用这个方法,那么清空操作后,数据列表不会同步改变
        this.getMedicinesList()
      } else {
        // 清空查询数据
        this.resetForm('inventoryLogQueryForm')
        // 清除日期
        this.dateRange = []
        this.getInventoryLogList()
      }
    },
    // 改变每页显示条数的时候触发
    handleSizeChange(val) {
      if (this.activeName === 'medicinesTab') {
        // 更新每页显示条数
        this.medicinesQueryParams.pageSize = val
        // 重新查询
        this.getMedicinesList()
      } else {
        // 更新每页显示条数
        this.inventoryLogQueryParams.pageSize = val
        this.getInventoryLogList()
      }
    },
    // 当前页改变时触发(前一页,点击某一页,下一页,跳转某一页)
    handleCurrentChange(val) {
      if (this.activeName === 'medicinesTab') {
        // 更新需要显示的第几页数
        this.medicinesQueryParams.pageNum = val
        // 重新查询
        this.getMedicinesList()
      } else {
        // 更新需要显示的第几页数
        this.inventoryLogQueryParams.pageNum = val
        // 更新每页显示条数
        this.inventoryLogQueryParams.pageSize = val
        this.getInventoryLogList()
      }
    },
    medicinesTypeFormatter(row) {
      return this.transferDictCode(this.medicinesTypeOptions, row.medicinesType)
    },
    producterFormatter(row) {
      let name = ''
      this.producterOptions.filter(item => {
        if (parseInt(item.producterId) === parseInt(row.producterId)) {
          name = item.producterName
        }
      })
      return name
    },
    prescriptionTypeFormatter(row) {
      return this.transferDictCode(this.prescriptionTypeOptions, row.prescriptionType)
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
