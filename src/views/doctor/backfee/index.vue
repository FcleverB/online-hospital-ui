<template>
  <div class="app-container" v-loading="loading" :element-loading-text="loadingText">
    <!--查询条件开始-->
    <el-form ref="queryForm" label-width="88px" :inline="true" :model="queryParams">
      <!--prop：如果设置了rule，则会匹配prop来进行验证-->
      <el-form-item label="挂号单据id" prop="registrationId">
        <el-input v-model="queryParams.registrationId" type="text" size="small" clearable style="width: 300px" placeholder="请输入挂号单据id"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
      </el-form-item>
    </el-form>
    <!--查询条件结束-->
    <!--病历|处方|处方详情信息开始-->
    <div v-if="careHistory.registrationId !== undefined">
      <!--病历信息开始-->
      <el-card class="box-card">
        <el-form label-position="left" label-width="120px" inline class="demo-table-expand">
          <el-form-item label="挂号单号:">
            <span v-text="careHistory.registrationId" />
          </el-form-item>
          <el-form-item label="医生姓名:">
            <span v-text="careHistory.userName" />
          </el-form-item>
          <el-form-item label="科室名称:">
            <span v-text="careHistory.deptName" />
          </el-form-item>
          <el-form-item label=" 患者姓名:">
            <span v-text="careHistory.patientName" />
          </el-form-item>
          <el-form-item label="就诊时间:">
            <span v-text="careHistory.careTime" />
          </el-form-item>
          <el-form-item label="主诉:">
            <span v-text="careHistory.caseTitle" />
          </el-form-item>
          <el-form-item label="诊断信息:">
            <span v-text="careHistory.caseResult" />
          </el-form-item>
          <el-form-item label="医生建议:">
            <span v-text="careHistory.doctorTips" />
          </el-form-item>
        </el-form>
      </el-card>
      <!--病历信息结束-->
      <!--操作按钮开始-->
      <el-card class="box-card">
        <el-button type="success" size="small" icon="el-icon-check" @click="handleSelectAll">全选</el-button>
        <el-button type="info" size="small" icon="el-icon-close" @click="handleUnSelectAll">取消全选</el-button>
        <el-button type="primary" size="small" icon="el-icon-money" @click="handleBackWithCash">现金退费</el-button>
        <el-button type="primary" size="small" icon="el-icon-bank-card" @click="handleBackWithAliPay">支付宝退费</el-button>
        <span style="margin-left:20px">订单总额:<span style="color:red;margin-left:20px">￥{{ allAmount }}</span></span>
      </el-card>
      <!--操作按钮结束-->
      <!--处方和详情信息开始-->
      <el-card class="box-card">
        <el-collapse v-if="careOrders.length > 0" v-model="activeNames">
          <!--遍历处方列表-->
          <el-collapse-item v-for="(item,index) in careOrders" :key="index" :name="index">
            <!--折叠面板的标题-->
            <template slot="title">
              【{{ item.coType==='0'?'药用处方':'检查处方' }}】【{{ index+1 }}】【处方总额】:￥{{ item.allAmount }}
            </template>
            <!--：data中的数据是每个处方列表下的所有处方详情-->
            <!--指定 Table 组件的 row-class-name 属性来为 Table 中的某一行添加 class，表明该行处于某种状态。-->
            <!--$event等同于不传值的内容，可以获取到每个table中勾选的内容，传递coId是为了区分是哪个处方-->
            <el-table
              ref="refTable"
              v-loading="loading"
              border
              :data="item.careOrderItems"
              :row-class-name="tableRowClassName"
              @selection-change="handleCareOrderItemSelectionChange($event,item.coId)"
            >
              <!--可选框-->
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="序号" align="center" type="index" width="50" />
              <el-table-column :label="item.coType==='0'?'药品名称':'项目名称'" align="center" prop="itemName" />
              <el-table-column label="数量" align="center" prop="num" />
              <el-table-column label="单价(元)" align="center" prop="price" />
              <el-table-column label="金额(元)" align="center" prop="amount" />
              <el-table-column label="备注" align="center" prop="remark" />
              <el-table-column label="状态" align="center" prop="status" :formatter="statusFormatter" />
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <!--处方和详情信息结束-->
    </div>
    <!--病历|处方|处方详情信息结束-->
  </div>
</template>

<script>
import { getChargedAllCareByRegistrationId } from '@/api/doctor/backfee/backfee'

export default {
  name: 'Index',
  data() {
    return {
      // 整体遮罩层
      loading: false,
      // 设置遮罩层文字
      loadingText: '',
      // 查询条件
      queryParams: {
        registrationId: undefined // 挂号单据id
      },
      // 查询出的病历信息
      careHistory: {
        registrationId: undefined,
        userName: undefined,
        deptName: undefined,
        patientName: undefined,
        careTime: undefined,
        caseTitle: undefined,
        caseResult: undefined,
        doctorTips: undefined
      },
      // 处方和处方详情信息
      careOrders: [],
      // 处方详情的状态字典数据his_order_details_status
      statusOptions: [],
      // 所有处方中勾选的已支付的总额
      allAmount: 0.00,
      // 当前选中的所有项目集合
      itemObjs: [],
      // 处方折叠面板展开的名字
      activeNames: []
    }
  },
  created() {
    // 查询处方详情的字典数据
    this.getDataByType('his_order_details_status').then(res => {
      this.statusOptions = res.data
    })
  },
  methods: {
    // 根据挂号单据id查询信息
    handleQuery() {
      const registrationId = this.queryParams.registrationId
      if (registrationId === undefined || registrationId === '') {
        this.msgError('请输入挂号单据id后再执行查询操作！')
        // 清空数据
        this.resetCurrentParams()
        return
      }
      this.loading = true
      this.loadingText = '数据查询中，请稍后......'
      // 清空原有数据
      this.resetCurrentParams()
      // 调用api执行查询操作
      getChargedAllCareByRegistrationId(registrationId).then(res => {
        this.careHistory = res.data.careHistory
        this.careOrders = res.data.careOrders
        this.loading = false
        this.loadingText = ''
        // 动态设置折叠面板的展示数量
        this.careOrders.filter((item, index) => {
          this.activeNames.push(index)
        })
      }).catch(() => {
        this.loading = false
      })
      // 这里不用捕获异常了，抛出后会触发Notication来解决
    },
    // 全选
    handleSelectAll() {
      // 获取到所有的ref为refTable的表格对象
      const tables = this.$refs.refTable
      // 对每个table对象进行遍历操作
      tables.filter(t => {
        // 清除勾选
        t.clearSelection()
        // 该方法为控制全选和非全选，先清空选择，然后调用时，就是全选了
        t.toggleAllSelection()
      })
    },
    // 取消全选
    handleUnSelectAll() {
      const tables = this.$refs.refTable
      tables.filter(t => {
        // 清空勾选的方法
        t.clearSelection()
      })
    },
    // 现金退费
    handleBackWithCash() {
      // 判断是否有勾选处方详情
      if (this.itemObjs.length === 0) {
        this.msgInfo('未选择要退费的处方详情信息，请选择后再退费！')
        return
      }
      // 组装数据
      const orderChargeObj = {
        // 退费订单信息主表
        orderChargeDto: {
          orderAmount: this.allAmount, // 总金额
          chId: this.careHistory.chId, // 病历id
          registrationId: this.careHistory.registrationId, // 挂号单据id
          patientName: this.careHistory.patientName
        },
        // 退费订单详细信息子表
        orderChargeItemDtoList: []
      }
      this.itemObjs.filter(item => {
        const obj = {
          itemId: item.itemId,
          coId: item.coId,
          itemName: item.itemName,
          itemPrice: item.price,
          itemNum: item.num,
          itemType: item.itemType,
          itemAmount: item.amount
        }
        orderChargeObj.orderChargeItemDtoList.push(obj)
      })
      // 发送请求
      this.loading = true
      this.loadingText = '创建订单并现金退费中'
      this.$confirm('是否确定创建订单并现金退费?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送现金退费请求，请求成功时重新查询剩余已支付订单
      }).catch(() => {
        this.msgError('创建订单并现金退费取消')
        this.loading = false
      })
    },
    // 支付宝退费
    handleBackWithAliPay() {
      // 判断是否有勾选处方详情
      if (this.itemObjs.length === 0) {
        this.msgInfo('未选择要退费的处方详情信息，请选择后再退费！')
        return
      }
      // 组装数据
      const orderChargeObj = {
        // 退费订单信息主表
        orderChargeDto: {
          orderAmount: this.allAmount, // 总金额
          chId: this.careHistory.chId, // 病历id
          registrationId: this.careHistory.registrationId, // 挂号单据id
          patientName: this.careHistory.patientName
        },
        // 退费订单详细信息子表
        orderChargeItemDtoList: []
      }
      this.itemObjs.filter(item => {
        const obj = {
          itemId: item.itemId,
          coId: item.coId,
          itemName: item.itemName,
          itemPrice: item.price,
          itemNum: item.num,
          itemType: item.itemType,
          itemAmount: item.amount
        }
        orderChargeObj.orderChargeItemDtoList.push(obj)
      })
      // 发送请求
      this.loading = true
      this.loadingText = '创建订单并支付宝退费中'
      this.$confirm('是否确定创建订单并支付宝退费?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送支付宝退费请求，请求成功时重新查询剩余已支付订单
      }).catch(() => {
        this.msgError('创建订单并支付宝退费取消')
        this.loading = false
      })
    },
    resetCurrentParams() {
      this.careHistory = {}
      this.careOrders = []
    },
    // 监听多个表格的checkbox的选中事件
    handleCareOrderItemSelectionChange(selection, coId) {
      // 判断保存全部勾选数据的对象长度是否为空
      if (this.itemObjs.length === 0) {
        // 如果为空表示是第一次勾选数据触发，直接将勾选的数据保存到itemObjs中即可
        this.itemObjs = selection
      } else {
        // 如果保存勾选数据的对象不为空，表示已经存在了勾选的数据
        // 遍历勾选内容
        for (let i = 0; i < this.itemObjs.length; i++) {
          // 获取遍历的每个对象
          const obj = this.itemObjs[i]
          // 根据处方id进行判断，将itemObjs中所属于该处方id的数据都删除
          if (obj.coId === coId) {
            this.itemObjs.splice(i, 1)
            // 删除了一个元素，后面的元素会前移，因此要先前移一个，for循环会再增加一个，就刚好是前移的第一个元素
            i--
          }
        }
        // 最后再将selection中的数据都添加，因为selection中保存的数据都是一个处方的列表勾选数据
        selection.filter(newItem => {
          this.itemObjs.push(newItem)
        })
      }
      // 调用计算选中的总额
      this.computeAllAmount()
    },
    // //计算选中的总额
    computeAllAmount() {
      this.allAmount = 0
      this.itemObjs.filter(item => {
        this.allAmount += item.amount
      })
    },
    // 翻译处方详情状态
    statusFormatter(row) {
      return this.transferDictCode(this.statusOptions, row.status)
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
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
    width: 50%;/*设置item宽度为一行的一半，这样一行就可以放两个数据了*/
  }
</style>
