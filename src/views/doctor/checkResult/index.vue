<template>
  <div class="app-container">
    <!--查询条件开始-->
    <el-card class="box-card">
      <el-form ref="queryForm" label-width="88px" :model="queryParams">
        <!--prop：如果设置了rule，则会匹配prop来进行验证-->
        <el-form-item label="挂号单据id" prop="registrationId">
          <el-input v-model="queryParams.registrationId" type="text" size="small" clearable style="width: 300px" placeholder="请输入挂号单据id"></el-input>
        </el-form-item>
        <el-form-item label="检查项目" prop="checkItemIds">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="queryParams.checkItemIds" @change="handleCheckItemChange">
            <el-checkbox v-for="checkItem in checkItemOptions" :label="checkItem.checkItemId" :key="checkItem.checkItemId">
              {{checkItem.checkItemName}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!--查询条件结束-->
    <!--数据表格开始 -->
    <el-card class="box-card">
      <el-table v-loading="loading" border :data="checkItemTableList" highlight-current-row @current-change="handleCurrentChange">
        <!--el-table-column:每一行中的每一列
          prop:对应从:data中取出的数据
          align:对齐方式
          label:列名
          show-overflow-tooltip:默认情况下数据过长不够显示的时候是换行显示,如果需要单行显示,可以使用这个,并且当鼠标移动到此处时会显示实际内容的提示信息
        -->
        <el-table-column label="序号" align="center" type="index" width="50" />
        <el-table-column label="详情Id" prop="itemId" align="center" width="210"/>
        <el-table-column label="名称" prop="itemName" align="center"/>
        <el-table-column label="单价（元）" prop="price" align="center">
          <template slot-scope="scope">
            {{scope.row.price}}元
          </template>
        </el-table-column>
        <el-table-column label="数量" prop="num" align="center"/>
        <el-table-column label="金额（元）" prop="amount" align="center">
          <template slot-scope="scope">
            {{scope.row.amount}}元
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" align="center"/>
        <el-table-column label="状态" prop="status" align="center" :formatter="statusFormatter"/>
      </el-table>
    </el-card>
    <!--数据表格结束 -->
    <!--检查栏目开始-->
    <el-card class="box-card" v-if="currentRow != null">
      <el-form label-position="left" label-width="120px" inline class="demo-table-expand">
        <el-form-item label="挂号单号：">
          <span>1</span>
        </el-form-item>
        <el-form-item label="患者姓名：">
          <span>1</span>
        </el-form-item>
        <el-form-item label="处方Id：">
          <span>1</span>
        </el-form-item>
        <el-form-item label="创建时间：">
          <span>1</span>
        </el-form-item>
        <el-button type="primary" style="width: 100%" icon="el-icon-plus">开始检查</el-button>
      </el-form>
    </el-card>
    <!--检查栏目结束-->
  </div>
</template>

<script>
import { selectAllCheckItem } from '@/api/system/checkItem/checkItem'
import { queryNeedCheckItem } from '@/api/doctor/checkResult/checkResult'

export default {
  name: 'Index',
  data() {
    return {
      // 遮罩
      loading: false,
      // 查询条件
      queryParams: {
        registrationId: undefined, // 挂号单据Id
        checkItemIds: [] // 选中的检查项目类别
      },
      // 可用的检查项目
      checkItemOptions: [],
      // 是否为半选状态
      isIndeterminate: false,
      // 是否全选
      checkAll: false,
      // 未发药的已支付的检查项详情数据
      checkItemTableList: [],
      // 支付详情状态
      itemStatusOptions: [],
      // 数据表格当前选中行
      currentRow: null
    }
  },
  created() {
    // 加载所有可用的检查项目
    selectAllCheckItem().then(res => {
      this.checkItemOptions = res.data
    })
    this.getDataByType('his_order_details_status').then(res => {
      // 将查询到的状态信息保存到当前页面对应的属性中
      this.itemStatusOptions = res.data
    })
    this.getCheckItemList()
  },
  methods: {
    // 查询未发药的检查项详情信息
    getCheckItemList() {
      this.loading = true
      queryNeedCheckItem(this.queryParams).then(res => {
        this.loading = false
        this.checkItemTableList = res.data
        this.msgSuccess('查询检查项详情信息成功')
      }).catch(() => {
        this.loading = false
        this.msgError('查询检查项详情信息出错')
      })
    },
    // 查询操作
    handleQuery() {
      // 执行实际的查询方法
      // 因为输入的查询条件实时与queryParams动态绑定
      this.getCheckItemList()
    },
    // 清空查询条件操作
    resetQuery() {
      // 清空查询数据
      this.resetForm('queryForm')
      this.checkAll = false
      // 重新查询数据列表,相当于执行一次无查询条件的查询操作,如果不调用这个方法,那么清空操作后,数据列表不会同步改变
      this.getCheckItemList()
    },
    // 检查项目全选触发方法
    handleCheckAllChange(val) {
      this.queryParams.checkItemIds = val ? this.checkItemOptions.map(item => item.checkItemId) : []
      this.isIndeterminate = false
    },
    // 查询条件中切换选中检查项目的触发方法
    handleCheckItemChange(value) {
      const checkedCount = value.length
      // 判断是否全部选择了
      this.checkAll = checkedCount === this.checkItemOptions.length
      // 选中数量大于0小于全部时，为半选状态
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkItemOptions.length
    },
    statusFormatter(row) {
      return this.transferDictCode(this.itemStatusOptions, row.status)
    },
    // 数据表格选中触发
    handleCurrentChange(val) {
      this.currentRow = val
    }
  }
}
</script>

<style scoped>
  .box-card {
    padding: 0px;
    margin: 0px;
    margin-bottom: 8px;
  }
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
