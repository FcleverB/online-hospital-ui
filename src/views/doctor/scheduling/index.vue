<template>
  <div class="app-container">
    <!--查询条件开始-->
    <!--gutter：分栏之间的间隔-->
    <el-card class="box-card">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
        <el-form-item label="科室名称" prop="deptId">
          <el-select
            v-model="queryParams.deptId"
            placeholder="请选择科室名称"
            clearable
            size="small"
            style="width:140px"
          >
            <el-option
              v-for="dict in deptNameOptions"
              :key="dict.deptId"
              :label="dict.deptName"
              :value="dict.deptId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="医生名称" prop="userId">
          <el-select
            v-model="queryParams.userId"
            placeholder="请选择医生名称"
            clearable
            size="small"
            style="width:200px"
          >
            <el-option
              v-for="dict in userOptions"
              :key="dict.userId"
              :label="dict.userName"
              :value="dict.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <!--查询和清空按钮-->
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">清空</el-button>
        </el-form-item>
        <!--选择的周数 上一周 当前周 下一周-->
        <el-form-item style="float: right">
          <el-button type="success" icon="el-icon-back" size="mini" @click="beforeWeek">上一周</el-button>
          <el-button type="success" icon="el-icon-s-operation" size="mini" @click="currentWeek">当前周</el-button>
          <el-button type="success" icon="el-icon-right" size="mini" @click="nextWeek">下一周</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!--查询条件结束-->
    <!--当前所选排班日期范围开始-->
    <el-card class="box-card">
      <div style="text-align: center">
        <span>{{schedulingDate.startTimeWeek}}</span>--<span>{{schedulingDate.endTimeWeek}}</span>
      </div>
    </el-card>
    <!--当前所选排班日期范围结束-->
    <!--排班列表开始-->
    <el-card class="box-card">
    </el-card>
    <!--排班列表结束-->
  </div>
</template>

<script>
// 引入科室api
import { selectAllDept } from '@/api/system/dept/dept'
import { selectNeedSchedulingUsers } from '@/api/system/user/user'
// 引入用户api
export default {
  name: 'Scheduling',
  data() {
    return {
      // 科室数据，查询条件中的下拉框
      deptNameOptions: [],
      // 医生数据，查询条件中的下拉框
      userOptions: [],
      // 查询参数
      queryParams: {
        deptId: undefined, // 部门id
        userId: undefined, // 医生id
        queryDate: undefined // 查询日期，周的查询条件，上一周，下一周，当前周
      },
      // 当前周的时间范围
      schedulingDate: {
        startTimeWeek: '2020-12-21(周一)',
        endTimeWeek: '2020-12-27(周日)'
      }
    }
  },
  created() {
    // 查询所有科室信息
    selectAllDept().then(res => {
      this.deptNameOptions = res.data
    })
    // 查询所有医生信息（实际用户就是医生）
    selectNeedSchedulingUsers().then(res => {
      this.userOptions = res.data
    })
  },
  methods: {
    // 查询操作
    handleQuery() {
    },
    // 清空查询条件操作
    resetQuery() {
    },
    // 上一周
    beforeWeek() {
    },
    // 当前周
    currentWeek() {
    },
    // 下一周
    nextWeek() {
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
