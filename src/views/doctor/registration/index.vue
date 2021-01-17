<template>
  <div class="app-container">
    <!--患者信息搜索开始-->
    <el-card class="box-card">
      <el-form ref="queryForm" :model="patientParams" label-width="70px">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="patientParams.idCard" placeholder="请输入患者身份证号" clearable size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button type="primary" class="el-icon-refresh" size="small" @click="handleIdCardQuery">加载身份证号</el-button>
              <el-button type="warning" class="el-icon-refresh" size="small" @click="handleIdCardQuery">加载患者信息</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!--患者信息搜索结束-->
    <!--根据身份证号自动匹配患者信息数据栏目开始-->
    <el-card class="box-card">
      <el-form ref="form" :model="patientParams" :rules="rules" :inline="true" label-width="88px">
        <el-form-item label="身份证号" prop="idCard">
          <el-input
            v-model="patientParams.idCard"
            placeholder="请输入身份证号"
            clearable
            size="small"
            style="width:200px"
          />
        </el-form-item>
        <el-form-item label="患者姓名" prop="name">
          <el-input
            v-model="patientParams.name"
            placeholder="请输入患者姓名"
            clearable
            size="small"
            style="width:200px"
          />
        </el-form-item>
        <el-form-item label="患者电话" prop="phone">
          <el-input
            v-model="patientParams.phone"
            placeholder="请输入患者电话"
            clearable
            size="small"
            style="width:200px"
          />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="patientParams.sex">
            <el-radio
              v-for="d in sexOptions"
              :key="d.dictValue"
              :label="d.dictValue"
              :value="d.dictValue"
            >{{ d.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker
            v-model="patientParams.birthday"
            size="small"
            style="width:200px"
            value-format="yyyy-MM-dd"
            type="date"
          />
        </el-form-item>
        <el-form-item label="患者年龄" prop="age">
          <el-input
            v-model="patientParams.age"
            :readonly="true"
            placeholder="请输入患者年龄"
            clearable
            size="small"
            style="width:200px"
          />
        </el-form-item>
        <el-form-item label="地址信息" prop="address">
          <el-input
            v-model="patientParams.address"
            placeholder="请输入地址信息"
            clearable
            style="width:500px"
            size="small"
          />
        </el-form-item>
      </el-form>
    </el-card>
    <!--根据身份证号自动匹配患者信息数据栏目结束-->
    <!--挂号类别开始-->
    <el-card class="box-card">
      <el-row>
        <el-col :span="12">
          <!--单选框组   用来显示挂号项目的类别-->
          <el-radio-group v-model="queryDeptParams.regItemId" @change="registeredItemChange">
            <el-radio-button
              v-for="d in regItemOptions"
              :key="d.regItemId"
              :label="d.regItemId"
              :value="d.regItemId">
              {{ d.regItemName }}
            </el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="12">
          <div style="float:right">
            <span style="margin-right: 25px">挂号费:￥{{ queryDeptParams.regItemFee }}</span>
            <el-button type="danger" icon="el-icon-search" :disabled="!single" size="small" @click="handleRegistration">挂号收费</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <!--挂号类别结束-->
    <!--科室列表开始-->
    <el-card>
      <el-form ref="queryDeptForm" :model="queryDeptParams" :rules="deptRules" :inline="true" label-width="90px">
        <el-form-item label="所属科室" prop="deptId">
          <el-select
            v-model="queryDeptParams.deptId"
            placeholder="请选择所属科室"
            clearable
            size="small"
            style="width:200px"
          >
            <el-option
              v-for="d in deptOptions"
              :key="d.deptId"
              :label="d.deptName"
              :value="d.deptId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="挂号类型" prop="schedulingType">
          <el-select
            v-model="queryDeptParams.schedulingType"
            placeholder="请选择挂号类型"
            clearable
            size="small"
            style="width:200px"
            disabled
          >
            <el-option
              v-for="dict in schedulingTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="挂号时段" prop="subsectionType">
          <el-select
            v-model="queryDeptParams.subsectionType"
            placeholder="请选择挂号时段"
            clearable
            size="small"
            style="width:200px"
          >
            <el-option
              v-for="dict in subsectionTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="挂号日期" prop="schedulingDay">
          <el-date-picker
            v-model="queryDeptParams.schedulingDay"
            size="small"
            style="width:240px"
            value-format="yyyy-MM-dd"
            type="date"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleDeptQuery">搜索</el-button>
          <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetDeptQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 科室数据表格开始 -->
      <el-table v-loading="deptLoading" border :data="deptTableList" highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="科室ID" align="center" prop="deptId" />
        <el-table-column label="科室名称" align="center" prop="deptName" />
        <el-table-column label="当前号数" align="center" prop="regNumber" />
      </el-table>
      <!-- 科室数据表格结束 -->
    </el-card>
    <!--科室列表结束-->
  </div>
</template>

<script>
import { listDeptForScheduling, getPatientByIdCard } from '@/api/doctor/registration'
import { selectAllDept } from '@/api/system/dept/dept'
import { selectAllRegisteredItem } from '@/api/system/registeredItem/registeredItem'

export default {
  name: 'Registration',
  data() {
    return {
      // 身份证号查询参数
      patientParams: {
        idCard: undefined, // 身份证号
        name: undefined,
        birthday: undefined,
        address: undefined,
        age: undefined,
        sex: undefined,
        phone: undefined
      },
      // 患者信息加载遮罩层
      patientLoading: false,
      // 科室数据加载遮罩
      deptLoading: false,
      // 选中的科室id集合
      ids: [],
      // 单个
      single: false,
      // 性别选择下拉框
      sexOptions: [],
      // 科室类别
      deptOptions: [],
      // 挂号类型
      schedulingTypeOptions: [],
      // 挂号时段
      subsectionTypeOptions: [],
      // 挂号项目类别
      regItemOptions: [],
      // 有号部门的查询条件
      queryDeptParams: {
        deptId: undefined,
        schedulingType: '1',
        subsectionType: '1',
        schedulingDay: this.getNowDate(),
        regItemId: undefined, // 默认值选门诊
        regItemFee: undefined
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: '患者姓名不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3|4|5|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        idCard: [
          { required: true, message: '身份证号不能为空', trigger: 'blur' }
        ]
      },
      deptRules: {
        schedulingType: [
          { required: true, message: '挂号类型不能为空', trigger: 'change' }
        ],
        subsectionType: [
          { required: true, message: '挂号时段不能为空', trigger: 'change' }
        ],
        schedulingDay: [
          { required: true, message: '挂号日期不能为空', trigger: 'change' }
        ]
      },
      // 科室数据
      deptTableList: []
    }
  },
  created() {
    // 查询性别
    this.getDataByType('sys_user_sex').then(res => {
      this.sexOptions = res.data
    })
    // 科室类别
    selectAllDept().then(res => {
      this.deptOptions = res.data
    })
    // 挂号类型
    this.getDataByType('his_scheduling_type').then(res => {
      this.schedulingTypeOptions = res.data
    })
    // 挂号时段
    this.getDataByType('his_subsection_type').then(res => {
      this.subsectionTypeOptions = res.data
    })
    // 查询挂号项目类别
    selectAllRegisteredItem().then(res => {
      this.regItemOptions = res.data
      // 设置默认值及默认值对应的挂号费用
      this.queryDeptParams.regItemId = this.regItemOptions[0].regItemId
      this.queryDeptParams.regItemFee = this.regItemOptions[0].regItemFee
    })
    // 加载科室数据
    this.getDeptForScheduling()
  },
  watch: {
    patientParams: {
      handler: function() {
        if (this.patientParams.birthday !== undefined) {
          this.patientParams.age = this.getAge(this.patientParams.birthday)
        }
      },
      deep: true
    }
  },
  methods: {
    // 获取yyyy-MM-dd格式的时间
    getNowDate() {
      // 获取系统时间
      const date = new Date()
      // 得到年月日，月份要加一
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      // 判断月小于10要拼接0
      if (month < 10) {
        month = '0' + month
      }
      // 判断日小于10要拼接0
      if (day < 10) {
        day = '0' + day
      }
      // 组合成yyyy-MM-dd返回
      return year + '-' + month + '-' + day
    },
    // 根据身份证号查询患者信息
    handleIdCardQuery() {
      this.patientLoading = true
      if (this.patientParams.idCard === undefined) {
        this.msgInfo('请先输入合法的身份证号')
      } else {
        getPatientByIdCard(this.patientParams.idCard).then(res => {
          // 给加载的患者信息对象赋值
          this.patientParams = res.data
          this.patientParams.age = this.getAge(res.data.birthday)
          this.patientLoading = false
        }).catch(() => {
          this.patientLoading = false
          // 无法根据指定身份证号加载数据的时候清空
          this.patientParams = {
            idCard: undefined, // 身份证号
            name: undefined,
            birthday: undefined,
            address: undefined,
            age: undefined,
            sex: undefined,
            phone: undefined
          }
        })
      }
    },
    // 切换挂号类型时触发的方法
    registeredItemChange(id) {
      // 从集合中筛选，根据传递的挂号项目id进行匹配
      this.regItemOptions.filter(item => {
        // id匹配成功
        if (id === item.regItemId) {
          // 将查询条件对象中的挂号项目id切换为对应的id
          this.queryDeptParams.regItemId = item.regItemId
          // 将查询条件对象中的挂号项目费用切换为对应的费用
          this.queryDeptParams.regItemFee = item.regItemFee
        }
      })
      // 如果挂号类型是门诊  门诊+病例本的时候，下面的挂号类型切换为门诊
      // 如果挂号类型是急诊  急诊+病例本的时候，下面的挂号类型切换为急诊
      if (id === 1 || id === 2) {
        this.queryDeptParams.schedulingType = '1'
      } else {
        this.queryDeptParams.schedulingType = '2'
      }
      // 重新查询有号的部门
      this.getDeptForScheduling()
    },
    // 执行挂号收费的方法
    handleRegistration() {
      //
    },
    // 科室列表查询按钮
    // 查询
    handleDeptQuery() {
      this.patientLoading = true
      this.$refs['queryDeptForm'].validate((valid) => {
        if (valid) {
          this.getDeptForScheduling()
          this.patientLoading = false
        } else {
          this.msgError('数据校验不通过')
          this.patientLoading = false
        }
      })
    },
    // 重置
    resetDeptQuery() {
      this.resetForm('queryDeptForm')
      this.getDeptForScheduling()
    },
    // 表格选择中行事件
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.deptId)
      this.single = selection.length === 1
    },
    // 查询科室数据列表
    getDeptForScheduling() {
      this.deptLoading = true
      listDeptForScheduling(this.queryDeptParams).then(res => {
        this.deptTableList = res.data
        this.deptLoading = false
      }).catch(() => {
        this.msgError('加载科室数据列表出错')
        this.deptLoading = false
      })
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
</style>
