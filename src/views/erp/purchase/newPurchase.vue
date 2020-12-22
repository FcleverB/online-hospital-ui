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
  </div>
</template>

<script>
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
      // 是否已经提交
      isSubmit: false,
      // 查询条件供应商数据
      providerOptions: [],
      // 详情列表生产厂家数据
      producterOptions: [],
      // 入库单据详情列表数据
      purchaseItemList: [
        {
          medicinesId: 1,
          medicinesName: '白芷',
          conversion: 1,
          unit: 'g',
          producterId: 1,
          purchaseNumber: 10,
          tradePrice: 10.00,
          tradeTotalAmount: 100.00,
          batchNumber: '1',
          remark: '备注'
        },
        {
          medicinesId: 2,
          medicinesName: '白芷2',
          conversion: 12,
          unit: 'g',
          producterId: 2,
          purchaseNumber: 102,
          tradePrice: 102.00,
          tradeTotalAmount: 1002.00,
          batchNumber: '12',
          remark: '备注2'
        },
        {
          medicinesId: 3,
          medicinesName: '白芷3',
          conversion: 13,
          unit: 'g',
          producterId: 3,
          purchaseNumber: 103,
          tradePrice: 103.00,
          tradeTotalAmount: 1003.00,
          batchNumber: '13',
          remark: '备注3'
        }
      ],
      // 入库单据数据
      form: {
        purchaseId: undefined, // 入库单据号
        providerId: undefined, // 供应商id
        purchaseTradeTotalAmount: undefined // 一张单据的总批发额
      }
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
  },
  methods: {
    // 添加药品模态框
    handleAddMedicines() {
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
