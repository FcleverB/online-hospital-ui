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
    <el-table v-loading="loading" :data="tableData" border :span-method="spanMethod">
      <el-table-column prop="userId" label="医生Id" align="center" :formatter="userFormatter"></el-table-column>
      <el-table-column prop="deptId" label="科室Id" align="center" width="80px" :formatter="deptFormatter"></el-table-column>
      <el-table-column prop="subsectionType" label="时间/日期" align="center" :formatter="subsectionTypeFormatter"></el-table-column>
      <el-table-column prop="schedulingType[0]" :label="labelNames[0]" align="center" :formatter="schedulingTypeDay1Formatter"></el-table-column>
      <el-table-column prop="schedulingType[1]" :label="labelNames[1]" align="center" :formatter="schedulingTypeDay2Formatter"></el-table-column>
      <el-table-column prop="schedulingType[2]" :label="labelNames[2]" align="center" :formatter="schedulingTypeDay3Formatter"></el-table-column>
      <el-table-column prop="schedulingType[3]" :label="labelNames[3]" align="center" :formatter="schedulingTypeDay4Formatter"></el-table-column>
      <el-table-column prop="schedulingType[4]" :label="labelNames[4]" align="center" :formatter="schedulingTypeDay5Formatter"></el-table-column>
      <el-table-column prop="schedulingType[5]" :label="labelNames[5]" align="center" :formatter="schedulingTypeDay6Formatter"></el-table-column>
      <el-table-column prop="schedulingType[6]" :label="labelNames[6]" align="center" :formatter="schedulingTypeDay7Formatter"></el-table-column>
      <el-table-column label="操作" align="center">
        <!--slot-scope="scope" 取到当前单元格-->
        <template slot-scope="scope">
          <!--传递该条数据到具体处理方法中-->
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleEdit(scope.row.userId)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--排班列表结束-->
    <!--编辑排班信息模态框开始-->
    <!--dialog:对话框
      title:模态框标题
      visible.sync:表示是否显示
      center:居中
      append-to-body:如果需要在一个对话框内部嵌套另一个对话框，需要使用append-to-body属性
    -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1200px"
      center
      append-to-body
    >
      <el-table v-loading="loading" :data="editTableData" border>
        <el-table-column prop="subsectionType" label="时间/日期" align="center" :formatter="subsectionTypeFormatter"></el-table-column>
        <el-table-column prop="schedulingType[0]" :label="labelNames[0]" align="center">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.schedulingType[0]"
              placeholder="请选择排班类型"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in schedulingTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="schedulingType[1]" :label="labelNames[1]" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.schedulingType[1]">
              <el-option
                v-for="dict in schedulingTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="schedulingType[2]" :label="labelNames[2]" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.schedulingType[2]">
              <el-option
                v-for="dict in schedulingTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="schedulingType[3]" :label="labelNames[3]" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.schedulingType[3]">
              <el-option
                v-for="dict in schedulingTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="schedulingType[4]" :label="labelNames[4]" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.schedulingType[4]">
              <el-option
                v-for="dict in schedulingTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="schedulingType[5]" :label="labelNames[5]" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.schedulingType[5]">
              <el-option
                v-for="dict in schedulingTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="schedulingType[6]" :label="labelNames[6]" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.schedulingType[6]">
              <el-option
                v-for="dict in schedulingTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
    <!--编辑排班信息模态框结束-->
  </div>
</template>

<script>
// 引入科室api
import { selectAllDept } from '@/api/system/dept/dept'
import { queryUsersNeedScheduling, queryScheduling, saveScheduling } from '@/api/doctor/scheduling'

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
      },
      // 测试数据  医生和科室信息mock数据，该数据假设已经按部门信息进行排序
      tableData: [
        { userId: 2, deptId: 101, subsectionType: '1', schedulingType: ['1', '1', '1', '1', '2', '1', '2'] },
        { userId: 2, deptId: 101, subsectionType: '2', schedulingType: ['1', '2', '1', '1', '1', '1', '1'] },
        { userId: 2, deptId: 101, subsectionType: '3', schedulingType: ['1', '1', '1', '1', '2', '1', '1'] },
        { userId: 3, deptId: 102, subsectionType: '1', schedulingType: ['1', '1', '2', '1', '', '1', '1'] },
        { userId: 3, deptId: 102, subsectionType: '2', schedulingType: ['1', '1', '1', '1', '1', '1', '1'] },
        { userId: 3, deptId: 102, subsectionType: '3', schedulingType: ['1', '1', '1', '1', '1', '1', '1'] },
        { userId: 4, deptId: 103, subsectionType: '1', schedulingType: ['1', '1', '1', '', '1', '1', '2'] },
        { userId: 4, deptId: 103, subsectionType: '2', schedulingType: ['1', '1', '1', '1', '1', '2', '1'] },
        { userId: 4, deptId: 103, subsectionType: '3', schedulingType: ['1', '1', '1', '1', '1', '1', '1'] },
        { userId: 5, deptId: 104, subsectionType: '1', schedulingType: ['1', '2', '1', '1', '1', '1', '1'] },
        { userId: 5, deptId: 104, subsectionType: '2', schedulingType: ['1', '1', '1', '1', '1', '1', '1'] },
        { userId: 5, deptId: 104, subsectionType: '3', schedulingType: ['', '1', '1', '1', '1', '1', '1'] }
      ],
      labelNames: [
        '2020-12-21(周一)',
        '2020-12-22(周二)',
        '2020-12-23(周三)',
        '2020-12-24(周四)',
        '2020-12-25(周五)',
        '2020-12-26(周六)',
        '2020-12-27(周日)'
      ],
      // 遮罩层
      loading: false,
      // 排班列表中时段码表
      subsectionTypeOptions: [],
      // 排班类型码表
      schedulingTypeOptions: [],
      // 模态框是否显示
      open: false,
      // 模态框的标题内容
      title: '',
      // 模态框中的表格数据
      editTableData: []
    }
  },
  computed: {
    groupNum() {
      // 获取医生列表数组
      return new Set(this.tableData.map(o => o.userId))
    }
  },
  created() {
    // 查询所有科室信息
    selectAllDept().then(res => {
      this.deptNameOptions = res.data
    })
    // 查询所有可以排班医生信息（实际用户就是医生）,可以传递科室id,查询指定科室的医生列表
    queryUsersNeedScheduling().then(res => {
      this.userOptions = res.data
    })
    // 码表 排班时段
    this.getDataByType('his_subsection_type').then(res => {
      this.subsectionTypeOptions = res.data
    })
    // 码表 排班类型
    this.getDataByType('his_scheduling_type').then(res => {
      this.schedulingTypeOptions = res.data
    })
    // 查询排班数据  返回值填充到schedulingData tableData labelNames
    this.listScheduling()
  },
  methods: {
    // 查询排班数据
    listScheduling() {
      this.loading = true
      // 调用api
      queryScheduling(this.queryParams).then(res => {
        this.tableData = res.data.tableData
        this.schedulingDate = res.data.schedulingDate
        this.labelNames = res.data.labelNames
        this.loading = false
      })
    },
    // 查询操作
    handleQuery() {
      this.listScheduling()
    },
    // 清空查询条件操作
    resetQuery() {
      // 清空表单
      this.resetForm('queryForm')
      this.listScheduling()
    },
    // 上一周
    beforeWeek() {
      // 将当前周的第一天传递过去，减少一天就可以是上一周了
      this.queryParams.queryDate = this.schedulingDate.startTimeWeek
      this.listScheduling()
    },
    // 当前周
    currentWeek() {
      // 后端会自动获取到当前时间
      this.queryParams.queryDate = undefined
      this.listScheduling()
    },
    // 下一周
    nextWeek() {
      // 将当前周的最后一天传递过去，增加一天就可以是下一周了
      this.queryParams.queryDate = this.schedulingDate.endTimeWeek
      this.listScheduling()
    },
    // 翻译医生id（实际为用户id）
    userFormatter(row) {
      let userName = ''
      this.userOptions.filter(item => {
        if (parseInt(row.userId) === parseInt(item.userId)) {
          userName = item.userName
        }
      })
      return userName
    },
    // 翻译科室
    deptFormatter(row) {
      let deptName = ''
      this.deptNameOptions.filter(item => {
        if (parseInt(row.deptId) === parseInt(item.deptId)) {
          deptName = item.deptName
        }
      })
      return deptName
    },
    // 翻译排班时段
    subsectionTypeFormatter(row) {
      return this.transferDictCode(this.subsectionTypeOptions, row.subsectionType)
    },
    // 翻译排班类型（周一）
    schedulingTypeDay1Formatter(row) {
      return this.transferDictCode(this.schedulingTypeOptions, row.schedulingType[0])
    },
    // 翻译排班类型（周二）
    schedulingTypeDay2Formatter(row) {
      return this.transferDictCode(this.schedulingTypeOptions, row.schedulingType[1])
    },
    // 翻译排班类型（周三）
    schedulingTypeDay3Formatter(row) {
      return this.transferDictCode(this.schedulingTypeOptions, row.schedulingType[2])
    },
    // 翻译排班类型（周四）
    schedulingTypeDay4Formatter(row) {
      return this.transferDictCode(this.schedulingTypeOptions, row.schedulingType[3])
    },
    // 翻译排班类型（周五）
    schedulingTypeDay5Formatter(row) {
      return this.transferDictCode(this.schedulingTypeOptions, row.schedulingType[4])
    },
    // 翻译排班类型（周六）
    schedulingTypeDay6Formatter(row) {
      return this.transferDictCode(this.schedulingTypeOptions, row.schedulingType[5])
    },
    // 翻译排班类型（周日）
    schedulingTypeDay7Formatter(row) {
      return this.transferDictCode(this.schedulingTypeOptions, row.schedulingType[6])
    },
    // 编辑
    handleEdit(userId) {
      // 清空原有模态框列表数据
      this.editTableData = []
      // 获取当前医生名称
      let doctorName = ''
      // 遍历用户数组，根据userId进行匹配
      this.userOptions.filter(item => {
        if (parseInt(item.userId) === parseInt(userId)) {
          doctorName = item.userName
        }
      })
      // 设置模态框标题
      this.title = '修改【' + doctorName + '】排班信息'
      // 打开
      this.open = true
      // 设置模态框中显示的数据
      this.editTableData = this.tableData.filter(o => o.userId === userId)
    },
    // 合并的代码
    spanMethod(data) { // 对于表格数据进行分组合并操作，UI组件回调函数
      const { row, rowIndex, columnIndex } = data
      // 行和列的索引从0开始计数
      if (columnIndex < 2 || columnIndex > 9) { // 医生合并展示区
        const len = this.userGroup(row.userId)
        const lenName = this.userIdLen(row.userId)
        if (rowIndex === lenName) { // 某医生首位部门行
          return {
            rowspan: len,
            colspan: 1
          }
        } else {
          return { // 某医生非首位部门行
            rowspan: 0,
            colspan: 0
          }
        }
      } else { // 排班信息展示区
        return {
          rowspan: 1,
          colspan: 1
        }
      }
    },
    userGroup(userId) {
      // 查找指定用户id（医生id）在列表数据中的个数，这里需要存储排班数据的时候，需要将某个医生上午下午晚上的排班数据按userId升序（或者降序）排序，然后按照subsectionType升序排序放好
      return this.tableData.filter(o => {
        return o.userId === userId
      }).length
      // return this.tableData.filter(o => o.userId === name).length
    },
    userIdLen(userId) { // 根据医生名称获取该医生第一个部门在全量部门中的偏移位置
      const tmp = Array.from(this.groupNum)
      const index = tmp.indexOf(userId) // 某医生在全医生中的偏移位置
      let len = 0
      for (let i = 0; i < index; i++) {
        len += this.userGroup(tmp[i])
      }
      return len
    },
    // 模态框保存确定按钮
    handleSubmit() {
      // 构造要保存的数据
      const form = {
        beginDate: this.schedulingDate.startTimeWeek, // 当前周的开始时间
        data: this.editTableData // 当前周的数据
      }
      this.loading = true
      // 调用api保存
      saveScheduling(form).then(res => {
        this.listScheduling() // 重新加载
        this.loading = false
        this.open = false
        this.msgSuccess('保存成功')
      }).catch(() => {
        this.loading = false
        this.msgError('保存失败')
      })
    },
    // 模态框取消按钮
    cancel() {
      // 关闭模态框
      this.open = false
      // 打开模态框的时候进行了数据的清楚，关闭模态框的时候就不需要清除数据了
      this.msgSuccess('关闭模态框')
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
