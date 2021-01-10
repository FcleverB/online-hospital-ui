<!--字典类型页面-->
<template>
  <div class="app-container">
    <!--查询条件开始-->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="患者姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入患者姓名"
          clearable
          size="small"
          style="width:140px"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
          clearable
          size="small"
          style="width:140px"
        />
      </el-form-item>
      <el-form-item label="身份证号" prop="idCard">
        <el-input
          v-model="queryParams.idCard"
          placeholder="请输入身份证号"
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
        <el-button type="primary" icon="el-icon-plus" size="mini" :disabled="!single" @click="handleViewFile">查看档案</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="!single" @click="handleViewCareHistory">查看就诊信息</el-button>
      </el-col>
    </el-row>
    <!--操作栏按钮结束-->
    <!--数据列表开始-->
    <el-table v-loading="loading" border :data="patientTableList" @selection-change="handleSelectionChange">
      <!--el-table-column:每一行中的每一列
        prop:对应从:data中取出的数据
        align:对齐方式
        label:列名
        show-overflow-tooltip:默认情况下数据过长不够显示的时候是换行显示,如果需要单行显示,可以使用这个,并且当鼠标移动到此处时会显示实际内容的提示信息
      -->
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="姓名" prop="name" align="center" />
      <el-table-column label="手机号" prop="phone" align="center"/>
      <el-table-column label="身份证号" prop="idCard" align="center"/>
      <el-table-column label="出生年月" prop="birthday" align="center"/>
      <!--年龄根据出生年月来计算得出-->
      <el-table-column label="年龄" prop="age" align="center" :formatter="calculateAgeFormatter"/>
      <el-table-column label="性别" prop="sex" align="center" :formatter="sexFormatter"/>
      <el-table-column label="是否完善信息" prop="isFinal" align="center" :formatter="isFinalFormatter"/>
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
    <!--档案模态框开始-->
    <el-dialog
      :title="fileTitle"
      :visible.sync="openFile"
      width="1000px"
      center
      append-to-body
    >
      <el-form label-position="left" label-width="120px" inline class="demo-table-expand">
        <el-form-item label="ID:">
          <span v-text="patientObj.patientId" />
        </el-form-item>
        <el-form-item label="姓名:">
          <span v-text="patientObj.name" />
        </el-form-item>
        <el-form-item label="身份证号:">
          <span v-text="patientObj.idCard" />
        </el-form-item>
        <el-form-item label="电话:">
          <span v-text="patientObj.phone" />
        </el-form-item>
        <el-form-item label="患者性别:">
          <span v-text="patientObj.sex" />
        </el-form-item>
        <el-form-item label="出生年月:">
          <span v-text="patientObj.birthday" />
        </el-form-item>
        <el-form-item label="地址信息:">
          <span v-text="patientObj.address" />
        </el-form-item>
        <el-form-item label="过敏信息:">
          <span v-text="patientObj.allergyInfo" />
        </el-form-item>
        <el-form-item label="是否完善信息:">
          <span v-text="patientObj.isFinal" />
        </el-form-item>
        <el-form-item label="最后登录ip:">
          <span v-text="patientObj.lastLoginIp" />
        </el-form-item>
        <el-form-item label="最后登录时间:">
          <span v-text="patientObj.lastLoginTime" />
        </el-form-item>
        <el-form-item label="创建时间:">
          <span v-text="patientObj.createTime" />
        </el-form-item>
        <el-form-item label="更新时间:">
          <span v-text="patientObj.updateTime" />
        </el-form-item>
        <el-form-item label="紧急联系人:">
          <span v-text="patientFileObj.emergencyContactName" />
        </el-form-item>
        <el-form-item label="紧急联系人电话:">
          <span v-text="patientFileObj.emergencyContactPhone" />
        </el-form-item>
        <el-form-item label="关系:">
          <span v-text="patientFileObj.emergencyContactRelation" />
        </el-form-item>
        <el-form-item label="左耳听力:">
          <span v-text="patientFileObj.leftEarHearing" />
        </el-form-item>
        <el-form-item label="右耳听力:">
          <span v-text="patientFileObj.rightEarHearing" />
        </el-form-item>
        <el-form-item label="左眼视力:">
          <span v-text="patientFileObj.leftVision" />
        </el-form-item>
        <el-form-item label="右眼视力:">
          <span v-text="patientFileObj.rightVision" />
        </el-form-item>
        <el-form-item label="身高:">
          <span v-text="patientFileObj.height" />
        </el-form-item>
        <el-form-item label="体重:">
          <span v-text="patientFileObj.weight" />
        </el-form-item>
        <el-form-item label="血型:">
          <span v-text="patientFileObj.bloodType" />
        </el-form-item>
        <el-form-item label="个人史:">
          <span v-text="patientFileObj.personalInfo" />
        </el-form-item>
        <el-form-item label="家族史:">
          <span v-text="patientFileObj.familyInfo" />
        </el-form-item>
        <el-form-item label="档案创建时间:">
          <span v-text="patientFileObj.createTime" />
        </el-form-item>
        <el-form-item label="档案更新时间:">
          <span v-text="patientFileObj.updateTime" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFile">取 消</el-button>
      </span>
    </el-dialog>
    <!--档案模态框结束-->
    <!--就诊信息模态框开始-->
    <!--就诊信息模态框结束-->
  </div>
</template>

<script>
// 引入患者相关api
import { listPatientForPage, getPatientById, getPatientFileById } from '@/api/doctor/patient'

export default {
  name: 'Patient',
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
      patientTableList: [],
      // 数据列表性别
      sexOptions: [],
      // 数据列表完善信息状态
      msgFinalOptions: [],
      // 档案模态框标题
      fileTitle: '',
      // 档案模态框是否显示
      openFile: false,
      // 就诊信息模态框标题
      historyTitle: '',
      // 就诊信息模态框是否显示
      openHistory: false,
      // 查询参数
      queryParams: {
        pageNum: 1, // 默认第一页
        pageSize: 10, // 每页默认10条
        name: undefined, // 患者姓名
        phone: undefined, // 手机号
        idCard: undefined // 身份证号
      },
      // 患者信息
      patientObj: {},
      // 就诊信息
      patientFileObj: {}
    }
  },
  // 生命周期,钩子函数  在实例创建完成后被立即调用
  created() {
    // 加载码表
    this.getDataByType('sys_user_sex').then(res => {
      this.sexOptions = res.data
    })
    this.getDataByType('his_patient_msg_final').then(res => {
      this.msgFinalOptions = res.data
    })
    // 加载页面时,需要进行初始化数据,调用查询数据列表的方法
    this.getPatientList()
  },
  methods: {
    // 查询数据列表数据
    getPatientList() {
      // 打开遮罩
      this.loading = true
      // 调用分页查询的api方法
      // listForPage(this.queryParams).then(res => {
      // 通过addDateRange封装起始时间和结束时间
      listPatientForPage(this.addDateRange(this.queryParams)).then(res => {
        // 将分页数据传递给数据类表绑定的data数据
        this.patientTableList = res.data
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
      this.getPatientList()
    },
    // 清空查询条件操作
    resetQuery() {
      // 清空查询数据
      this.resetForm('queryForm')
      // 清空查询条件中选择的日期数据
      this.dateRange = []
      // 重新查询数据列表,相当于执行一次无查询条件的查询操作,如果不调用这个方法,那么清空操作后,数据列表不会同步改变
      this.getPatientList()
    },
    // 改变数据列表第一列多选框选中状态所触发的方法,selection为选择的内容
    handleSelectionChange(selection) {
      // selection保存着勾选的一条数据，以数组形式存储，对象为一个单位
      this.single = selection.length === 1
      this.multiple = selection.length > 1
      // 保存勾选的数据的id  item表示取出数组中一个数据，然后获取到该条数据的id，遍历完成后，ids拿到所有勾选的id
      this.ids = selection.map(item => item.patientId)
    },
    // 改变每页显示条数的时候触发
    handleSizeChange(val) {
      // 更新每页显示条数
      this.queryParams.pageSize = val
      // 重新查询
      this.getPatientList()
    },
    // 当前页改变时触发(前一页,点击某一页,下一页,跳转某一页)
    handleCurrentChange(val) {
      // 更新需要显示的第几页数
      this.queryParams.pageNum = val
      // 重新查询
      this.getPatientList()
    },
    handleViewFile() {
      const patientId = this.ids[0]
      this.openFile = true
      this.fileTitle = '查询患者档案信息'
      this.patientFileObj = {}
      this.patientObj = {}
      // 查询患者
      getPatientById(patientId).then(res => {
        this.patientObj = res.data
        const sex = this.patientObj.sex
        const isFinal = this.patientObj.isFinal
        this.patientObj.sex = (sex === '0' ? '男' : sex === '1' ? '女' : '未知')
        this.patientObj.isFinal = isFinal === '0' ? '未完善' : '已完善'
      })
      // 查询档案
      getPatientFileById(patientId).then(res => {
        if (res.data !== null) {
          this.patientFileObj = res.data
        }
      })
    },
    handleViewCareHistory() {
      // 查看就诊信息
    },
    sexFormatter(row) {
      return this.transferDictCode(this.sexOptions, row.sex)
    },
    isFinalFormatter(row) {
      return this.transferDictCode(this.msgFinalOptions, row.isFinal)
    },
    // 根据出生年月计算年龄
    calculateAgeFormatter(row) {
      return 0
    },
    // 模态框  取消按钮
    cancelFile() {
      // 设置open为false,表示关闭模态框
      this.openFile = false
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
