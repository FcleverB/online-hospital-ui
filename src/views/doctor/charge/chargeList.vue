<!--字典类型页面-->
<template>
  <div class="app-container">
    <!--查询条件开始-->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="90px">
      <el-form-item label="支付订单号" prop="orderId">
        <el-input
          v-model="queryParams.orderId"
          placeholder="请输入支付订单号"
          clearable
          size="small"
          style="width:140px"
        />
      </el-form-item>
      <el-form-item label="患者姓名" prop="patientName">
        <el-input
          v-model="queryParams.patientName"
          placeholder="请输入患者姓名"
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
    <!--数据列表开始-->
    <el-table v-loading="loading" border :data="chargeTableList">
      <!--el-table-column:每一行中的每一列
        prop:对应从:data中取出的数据
        align:对齐方式
        label:列名
        show-overflow-tooltip:默认情况下数据过长不够显示的时候是换行显示,如果需要单行显示,可以使用这个,并且当鼠标移动到此处时会显示实际内容的提示信息
      -->
      <el-table-column label="支付订单号" prop="orderId" align="center" width="220"/>
      <el-table-column label="挂号单号" prop="registrationId" align="center"/>
      <el-table-column label="患者姓名" prop="patientName" align="center"/>
      <el-table-column label="订单总金额" prop="orderAmount" align="center">
        <template slot-scope="scope">
          {{scope.row.orderAmount}}元
        </template>
      </el-table-column>
      <el-table-column label="支付类型" prop="payType" align="center" :formatter="payTypeFormatter"/>
      <el-table-column label="订单状态" prop="orderStatus" align="center" :formatter="orderStatusFormatter"/>
      <el-table-column label="创建时间" prop="createTime" align="center"/>
      <el-table-column label="操作" align="center" width="260px">
        <!--slot-scope="scope" 取到当前单元格-->
        <template slot-scope="scope">
          <!--传递该条数据到具体处理方法中-->
          <el-button type="text" icon="el-icon-view" size="mini" @click="handleView(scope.row)">查看详情</el-button>
          <el-button v-if="scope.row.orderStatus === '0'" type="text" icon="el-icon-shopping-cart-2" size="mini" @click="handlePayWithCase(scope.row)">现金收费</el-button>
          <el-button v-if="scope.row.orderStatus === '0'" type="text" icon="el-icon-shopping-cart-2" size="mini" @click="handlePayWithZfb(scope.row)">支付宝收费</el-button>
        </template>
      </el-table-column>
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
    <!--查看详情页面开始-->
    <el-dialog
      v-loading="loading"
      :title="title"
      :visible.sync="openDetail"
      width="1200px"
      center
      append-to-body
      >
      <el-table v-loading="itemLoading" border :data="chargeItemTableList">
        <!--el-table-column:每一行中的每一列
          prop:对应从:data中取出的数据
          align:对齐方式
          label:列名
          show-overflow-tooltip:默认情况下数据过长不够显示的时候是换行显示,如果需要单行显示,可以使用这个,并且当鼠标移动到此处时会显示实际内容的提示信息
        -->
        <el-table-column label="详情Id" prop="itemId" align="center" width="210"/>
        <el-table-column label="处方Id" prop="coId" align="center" width="210"/>
        <el-table-column label="名称" prop="itemName" align="center"/>
        <el-table-column label="价格" prop="itemPrice" align="center">
          <template slot-scope="scope">
            {{scope.row.itemPrice}}元
          </template>
        </el-table-column>
        <el-table-column label="数量" prop="itemNum" align="center"/>
        <el-table-column label="金额" prop="itemAmount" align="center">
          <template slot-scope="scope">
            {{scope.row.itemAmount}}元
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="itemType" align="center" :formatter="itemTypeFormatter"/>
        <el-table-column label="状态" prop="status" align="center" :formatter="statusFormatter"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeModel">关 闭</el-button>
      </span>
    </el-dialog>
    <!--查看详情页面结束-->
    <!--支付宝支付二维码模态框开始-->
    <el-dialog
      :title="title"
      :visible.sync="openPay"
      center
      :close-on-click-modal="false"
      :before-close="handleClose"
      append-to-body
    >
      <el-form label-position="left" label-width="120px" inline class="demo-table-expand">
        <el-card>
          <el-form-item label="订单号：">
            <span>{{payObj.orderId}}</span>
          </el-form-item>
          <el-form-item label="总金额：">
            <span>{{payObj.allAmount}}</span>
          </el-form-item>
        </el-card>
      </el-form>
      <div style="text-align: center">
        <vue-qr class="vue-qr" :text="payObj.payUrl" :size="200"></vue-qr>
        <div>
          请使用支付宝扫码支付
        </div>
      </div>
    </el-dialog>
    <!--支付宝支付二维码模态框结束-->
  </div>
</template>

<script>
// 引入处方收费api
import {
  queryAllOrderChargeForPage,
  queryOrderChargeItemByOrderId,
  payWithCash,
  payWithZfb,
  queryOrderChargeByOrderId
} from '@/api/doctor/charge/charge'
import vueQr from 'vue-qr'

export default {
  name: 'ChargeList',
  components: {
    vueQr
  },
  data() {
    return {
      // 是否启用遮罩层,请求后台时出现进度条(如果请求响应很快的话,可能看不到)
      // 体现在页面上就是一个页面中心一个转圈的显示
      loading: false,
      // 分页数据总条数
      total: 0,
      // 数据列表中数据(字典类型)
      chargeTableList: [],
      // 查询参数
      queryParams: {
        pageNum: 1, // 默认第一页
        pageSize: 10, // 每页默认10条
        orderId: undefined, // 支付订单号
        patientName: undefined // 患者名称
      },
      // 支付类型数据
      payTypeOptions: [],
      // 订单状态数据
      orderStatusOptions: [],
      // 查看详情模态框标题
      title: '',
      // 是否打开模态框
      openDetail: false,
      // 支付详情列表数据
      chargeItemTableList: [],
      // 支付详情类型
      itemTypeOptions: [],
      // 支付详情状态
      itemStatusOptions: [],
      itemLoading: false,
      // 支付对象（创建支付宝订单返回数据）
      payObj: {},
      // 支付宝二维码模态框可见
      openPay: false,
      // 定时轮询
      intervalObj: undefined
    }
  },
  // 生命周期,钩子函数  在实例创建完成后被立即调用
  created() {
    // 使用全局的根据字典类型查询字典数据的方法来获取查询条件中的状态信息
    this.getDataByType('his_order_charge_status').then(res => {
      // 将查询到的状态信息保存到当前页面对应的属性中
      this.orderStatusOptions = res.data
    })
    this.getDataByType('his_pay_type_status').then(res => {
      // 将查询到的状态信息保存到当前页面对应的属性中
      this.payTypeOptions = res.data
    })
    this.getDataByType('his_item_type').then(res => {
      // 将查询到的状态信息保存到当前页面对应的属性中
      this.itemTypeOptions = res.data
    })
    this.getDataByType('his_order_details_status').then(res => {
      // 将查询到的状态信息保存到当前页面对应的属性中
      this.itemStatusOptions = res.data
    })
    // 最后查询列表
    // 加载页面时,需要进行初始化数据,调用查询数据列表的方法
    this.getChargeList()
  },
  methods: {
    // 查询数据列表数据
    getChargeList() {
      // 打开遮罩
      this.loading = true
      // 调用分页查询的api方法
      // listForPage(this.queryParams).then(res => {
      // 通过addDateRange封装起始时间和结束时间
      queryAllOrderChargeForPage(this.queryParams).then(res => {
        // 将分页数据传递给数据类表绑定的data数据
        this.chargeTableList = res.data
        // 查询到数据了,就要显示分页了
        this.total = res.total
        // 关闭遮罩
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 查询操作
    handleQuery() {
      // 执行实际的查询方法
      // 因为输入的查询条件实时与queryParams动态绑定
      this.getChargeList()
    },
    // 清空查询条件操作
    resetQuery() {
      // 清空查询数据
      this.resetForm('queryForm')
      // 重新查询数据列表,相当于执行一次无查询条件的查询操作,如果不调用这个方法,那么清空操作后,数据列表不会同步改变
      this.getChargeList()
    },
    // 改变每页显示条数的时候触发
    handleSizeChange(val) {
      // 更新每页显示条数
      this.queryParams.pageSize = val
      // 重新查询
      this.getChargeList()
    },
    // 当前页改变时触发(前一页,点击某一页,下一页,跳转某一页)
    handleCurrentChange(val) {
      // 更新需要显示的第几页数
      this.queryParams.pageNum = val
      // 重新查询
      this.getChargeList()
    },
    // 码表转换
    payTypeFormatter(row) {
      return this.transferDictCode(this.payTypeOptions, row.payType)
    },
    orderStatusFormatter(row) {
      return this.transferDictCode(this.orderStatusOptions, row.orderStatus)
    },
    itemTypeFormatter(row) {
      return this.transferDictCode(this.itemTypeOptions, row.itemType)
    },
    statusFormatter(row) {
      return this.transferDictCode(this.itemStatusOptions, row.status)
    },
    // 查看详情
    handleView(row) {
      this.openDetail = true
      this.title = '查看' + row.patientName + '的支付订单详情'
      this.itemLoading = true
      // 根据orderId查询对应详情信息
      queryOrderChargeItemByOrderId(row.orderId).then(res => {
        // 将分页数据传递给数据类表绑定的data数据
        this.chargeItemTableList = res.data
        // 关闭遮罩
        this.itemLoading = false
      }).catch(() => {
        this.msgError('加载详情数据失败')
        this.itemLoading = false
      })
    },
    // 详情页关闭
    closeModel() {
      this.openDetail = false
      this.chargeItemTableList = []
    },
    // 现金收费
    handlePayWithCase(row) {
      // 发送请求
      this.loading = true
      this.$confirm('是否确定进行现金支付?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        payWithCash(row.orderId).then(res => {
          this.msgSuccess('现金支付成功')
          this.loading = false
          // 重新查询列表
          this.getChargeList()
        }).catch(() => {
          this.msgError('现金支付失败')
          this.loading = false
        })
      }).catch(() => {
        this.msgError('现金支付取消')
        this.loading = false
      })
    },
    // 支付宝收费
    handlePayWithZfb(row) {
      // 发送请求
      this.loading = true
      this.$confirm('是否确定进行支付宝支付?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        payWithZfb(row.orderId).then(res => {
          this.loading = false
          // 1. 从返回数据中生成二维码,进行支付，会自动调用回调请求
          this.payObj = res.data
          this.openPay = true
          this.title = '请使用支付宝扫码支付'
          const tx = this // 层数套太多容易有问题
          // 2. 定时发送查询该订单的装填，如果支付成功，继续执行，否则抛出提示信息
          tx.intervalObj = setInterval(function() {
            // 根据订单id查询订单信息，看是否已经支付完成
            queryOrderChargeByOrderId(tx.payObj.orderId).then(res => {
              if (res.data.orderStatus === '1') {
                // 支付成功
                // 清空定时器
                clearInterval(tx.intervalObj)
                tx.$notify({
                  title: '支付成功',
                  message: '[' + tx.payObj.orderId + ']对应的订单支付成功',
                  type: 'success'
                })
                // 重新查询列表
                tx.getChargeList()
                // 关闭模态框
                tx.openPay = false
              }
            }).catch(() => {
              // 清空定时器
              clearInterval(tx.intervalObj)
            })
          }, 2000)
        }).catch(() => {
          this.msgError('支付宝支付失败')
          this.loading = false
        })
      }).catch(() => {
        this.msgInfo('支付宝支付取消')
        this.loading = false
      })
    },
    // 支付宝收费页面关闭触发
    handleClose() {
      this.openPay = false
      // 关闭轮询
      clearInterval(this.intervalObj)
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
