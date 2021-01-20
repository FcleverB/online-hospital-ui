<!--字典类型页面-->
<template>
  <div class="app-container">
    <!--查询条件开始-->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="所属科室" prop="deptId">
        <el-select
          v-model="queryParams.deptId"
          placeholder="请选择所属科室"
          clearable
          size="small"
          style="width:140px"
        >
          <el-option
            v-for="dict in deptOptions"
            :key="dict.deptId"
            :label="dict.deptName"
            :value="dict.deptId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="患者名称" prop="patientName">
        <el-input
          v-model="queryParams.patientName"
          placeholder="请输入患者名称"
          clearable
          size="small"
          style="width:140px"
        />
      </el-form-item>
      <el-form-item label="挂号类型" prop="schedulingType">
        <el-select
          v-model="queryParams.schedulingType"
          placeholder="请选择挂号类型"
          clearable
          size="small"
          style="width:140px"
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
          v-model="queryParams.subsectionType"
          placeholder="请选择挂号时段"
          clearable
          size="small"
          style="width:140px"
        >
          <el-option
            v-for="dict in subsectionTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="挂号状态" prop="registrationStatus">
        <el-select
          v-model="queryParams.registrationStatus"
          placeholder="请选择挂号状态"
          clearable
          size="small"
          style="width:140px"
        >
          <el-option
            v-for="dict in registrationStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="就诊日期" prop="visitDate">
        <el-date-picker
          v-model="queryParams.visitDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择就诊日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <!--查询和清空按钮-->
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">清空</el-button>
      </el-form-item>
    </el-form>
    <!--查询条件结束-->
    <!--数据列表开始-->
    <el-table v-loading="loading" border :data="registrationTableList">
      <!--el-table-column:每一行中的每一列
        prop:对应从:data中取出的数据
        align:对齐方式
        label:列名
        show-overflow-tooltip:默认情况下数据过长不够显示的时候是换行显示,如果需要单行显示,可以使用这个,并且当鼠标移动到此处时会显示实际内容的提示信息
      -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="挂号Id：">
              <span>{{ props.row.registrationId }}</span>
            </el-form-item>
            <el-form-item label="挂号员：">
              <span>{{ props.row.createBy }}</span>
            </el-form-item>
            <el-form-item label="创建时间：">
              <span>{{ props.row.createTime }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="患者姓名" prop="patientName" align="center" />
      <el-table-column label="挂号科室" prop="deptId" align="center" :formatter="deptFormatter"/>
      <el-table-column label="接诊医生" prop="userId" align="center" :formatter="userFormatter"/>
      <el-table-column label="挂号费用" prop="registrationAmount" align="center">
        <template slot-scope="scope">
          {{ scope.row.registrationAmount | accurate }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="registrationStatus" align="center" :formatter="registrationStatusFormatter"/>
      <el-table-column label="流水编号" prop="registrationNumber" align="center" width="200px"/>
      <el-table-column label="就诊日期" prop="visitDate" align="center"/>
      <el-table-column label="挂号类型" prop="schedulingType" align="center" :formatter="schedulingTypeFormatter"/>
      <el-table-column label="挂号时段" prop="subsectionType" align="center" :formatter="subsectionTypeFormatter"/>
      <el-table-column label="操作" align="center" width="300px">
        <!--slot-scope="scope" 取到当前单元格-->
        <template slot-scope="scope">
          <!--传递该条数据到具体处理方法中-->
          <el-button v-if="scope.row.registrationStatus === '0'" type="text" icon="el-icon-check" size="mini" @click="doCharge(scope.row)">收费</el-button>
          <el-button v-if="scope.row.registrationStatus === '0'" type="text" icon="el-icon-delete" size="mini" @click="doInvalid(scope.row)">作废</el-button>
          <el-button v-if="scope.row.registrationStatus === '1'" type="text" icon="el-icon-close" size="mini" @click="doReturn(scope.row)">退号</el-button>
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
  </div>
</template>

<script>
// 引入挂号列表相关api
import { queryRegistrationForPage, doInvalid, doReturn, charge } from '@/api/doctor/registration/registration'
import { selectAllDept } from '@/api/system/dept/dept'
import { selectAllUser } from '@/api/system/user/user'
export default {
  name: 'RegistrationList',
  // 过滤器
  filters: {
    accurate(value) {
      return value.toFixed(2)
    }
  },
  data() {
    return {
      // 是否启用遮罩层,请求后台时出现进度条(如果请求响应很快的话,可能看不到)
      // 体现在页面上就是一个页面中心一个转圈的显示
      loading: false,
      // 分页数据总条数
      total: 0,
      // 数据列表中数据(字典类型)
      registrationTableList: [],
      // 科室下拉框
      deptOptions: [],
      // 医生下拉框（用户）
      userOptions: [],
      // 挂号类型
      schedulingTypeOptions: [],
      // 挂号时段
      subsectionTypeOptions: [],
      // 挂号状态
      registrationStatusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1, // 默认第一页
        pageSize: 10, // 每页默认10条
        deptId: undefined, // 所属科室
        patientName: undefined, // 患者名称
        schedulingType: undefined, // 挂号类型
        subsectionType: undefined, // 挂号时段
        registrationStatus: undefined, // 挂号状态
        visitDate: this.moment(new Date()).format('YYYY-MM-DD') // 就诊日期
      }
    }
  },
  // 生命周期,钩子函数  在实例创建完成后被立即调用
  created() {
    // 科室类别
    selectAllDept().then(res => {
      this.deptOptions = res.data
    })
    // 医生下拉框
    selectAllUser().then(res => {
      this.userOptions = res.data
    })
    // 挂号类型
    this.getDataByType('his_scheduling_type').then(res => {
      this.schedulingTypeOptions = res.data
    })
    // 挂号时段
    this.getDataByType('his_subsection_type').then(res => {
      this.subsectionTypeOptions = res.data
    })
    // 挂号状态
    this.getDataByType('his_registration_status').then(res => {
      this.registrationStatusOptions = res.data
    })
    // 加载页面时,需要进行初始化数据,调用查询数据列表的方法
    this.getRegistrationsList()
  },
  methods: {
    // 查询数据列表数据
    getRegistrationsList() {
      // 打开遮罩
      this.loading = true
      // 调用分页查询的api方法
      // listForPage(this.queryParams).then(res => {
      // 通过addDateRange封装起始时间和结束时间
      queryRegistrationForPage(this.queryParams).then(res => {
        // 将分页数据传递给数据类表绑定的data数据
        this.registrationTableList = res.data
        // 查询到数据了,就要显示分页了
        this.total = res.total
        // 关闭遮罩
        this.loading = false
      }).catch(() => {
        this.msgError('获取挂号列表出错')
        this.loading = false
      })
    },
    // 查询操作
    handleQuery() {
      // 执行实际的查询方法
      // 因为输入的查询条件实时与queryParams动态绑定
      this.getRegistrationsList()
    },
    // 清空查询条件操作
    resetQuery() {
      // 清空查询数据
      this.resetForm('queryForm')
      // 重新查询数据列表,相当于执行一次无查询条件的查询操作,如果不调用这个方法,那么清空操作后,数据列表不会同步改变
      this.getRegistrationsList()
    },
    // 科室信息
    deptFormatter(row) {
      let name = ''
      this.deptOptions.filter(item => {
        if (parseInt(item.deptId) === parseInt(row.deptId)) {
          name = item.deptName
        }
      })
      return name
    },
    // 接诊医生信息
    userFormatter(row) {
      let name = ''
      this.userOptions.filter(item => {
        if (parseInt(item.userId) === parseInt(row.userId)) {
          name = item.userName
        }
      })
      return name
    },
    // 挂号状态转换
    registrationStatusFormatter(row) {
      return this.transferDictCode(this.registrationStatusOptions, row.registrationStatus)
    },
    // 挂号类型转换
    schedulingTypeFormatter(row) {
      return this.transferDictCode(this.schedulingTypeOptions, row.schedulingType)
    },
    // 挂号时段转换
    subsectionTypeFormatter(row) {
      return this.transferDictCode(this.subsectionTypeOptions, row.subsectionType)
    },
    // 改变每页显示条数的时候触发
    handleSizeChange(val) {
      // 更新每页显示条数
      this.queryParams.pageSize = val
      // 重新查询
      this.getRegistrationsList()
    },
    // 当前页改变时触发(前一页,点击某一页,下一页,跳转某一页)
    handleCurrentChange(val) {
      // 更新需要显示的第几页数
      this.queryParams.pageNum = val
      // 重新查询
      this.getRegistrationsList()
    },
    // 收费
    doCharge(row) {
      this.loading = true
      const registrationId = row.registrationId
      this.$confirm('是否给挂号Id为【' + registrationId + '】的挂号进行收费?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用收费
        charge(registrationId).then(res => {
          this.msgSuccess('收费成功')
          this.getRegistrationsList()
          this.loading = false
        }).catch(() => {
          this.msgError('收费失败')
          this.loading = false
        })
      }).catch(() => {
        this.msgInfo('取消收费操作')
        this.loading = false
      })
    },
    // 作废
    doInvalid(row) {
      this.loading = true
      const registrationId = row.registrationId
      this.$confirm('是否给挂号Id为【' + registrationId + '】的挂号进行作废?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        doInvalid(registrationId).then(res => {
          this.msgSuccess('作废成功')
          // 重新查询
          this.getRegistrationsList()
          this.loading = false
        }).catch(() => {
          this.msgError('作废失败')
          this.loading = false
        })
      }).catch(() => {
        this.msgInfo('取消作废操作')
        this.loading = false
      })
    },
    // 退号
    doReturn(row) {
      this.loading = true
      const registrationId = row.registrationId
      this.$confirm('是否给挂号Id为【' + registrationId + '】的挂号进行退号?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        doReturn(registrationId).then(res => {
          this.msgSuccess('退号成功')
          // 重新查询
          this.getRegistrationsList()
          this.loading = false
        }).catch(() => {
          this.msgError('退号失败')
          this.loading = false
        })
      }).catch(() => {
        this.msgInfo('取消退号操作')
        this.loading = false
      })
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
