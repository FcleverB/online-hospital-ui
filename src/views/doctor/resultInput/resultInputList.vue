<!--字典类型页面-->
<template>
  <div class="app-container">
    <!--查询条件开始-->
    <el-form ref="queryForm" label-width="88px" inline :model="queryParams">
      <!--prop：如果设置了rule，则会匹配prop来进行验证-->
      <el-form-item label="挂号单据id" prop="registrationId">
        <el-input v-model="queryParams.registrationId" type="text" size="small" clearable style="width: 300px" placeholder="请输入挂号单据id" />
      </el-form-item>
      <el-form-item label="患者姓名" prop="patientName">
        <el-input v-model="queryParams.patientName" type="text" size="small" clearable style="width: 300px" placeholder="请输入患者姓名" />
      </el-form-item>
      <el-form-item label="检查项目" prop="checkItemIds">
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;" />
        <el-checkbox-group v-model="queryParams.checkItemIds" @change="handleCheckItemChange">
          <el-checkbox v-for="checkItem in checkItemOptions" :key="checkItem.checkItemId" :label="checkItem.checkItemId">
            {{ checkItem.checkItemName }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!--查询条件结束-->
    <!--数据列表开始-->
    <el-table v-loading="loading" border :data="checkResultTableList">
      <!--el-table-column:每一行中的每一列
        prop:对应从:data中取出的数据
        align:对齐方式
        label:列名
        show-overflow-tooltip:默认情况下数据过长不够显示的时候是换行显示,如果需要单行显示,可以使用这个,并且当鼠标移动到此处时会显示实际内容的提示信息
      -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="检查项目Id">
              <span>{{ props.row.checkItemId }}</span>
            </el-form-item>
            <el-form-item label="患者Id">
              <span>{{ props.row.patientId }}</span>
            </el-form-item>
            <el-form-item label="创建者">
              <span>{{ props.row.createBy }}</span>
            </el-form-item>
            <el-form-item label="是否录入检查结果">
              <span>{{ props.row.resultStatus === '0' ? '检查中' : '检查完成' }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="检查单号" prop="itemId" align="center" />
      <el-table-column label="挂号单号" prop="registrationId" align="center" />
      <el-table-column label="检查项目名称" prop="checkItemName" align="center" />
      <el-table-column label="患者姓名" prop="patientName" width="250px" align="center" />
      <el-table-column label="价格（元）" prop="price" width="250px" align="center" />
      <el-table-column label="创建时间" prop="createTime" width="250px" align="center" />
      <el-table-column label="操作" align="center">
        <!--slot-scope="scope" 取到当前单元格-->
        <template slot-scope="scope">
          <!--传递该条数据到具体处理方法中-->
          <el-button v-if="scope.row.resultStatus === '1'" type="text" icon="el-icon-view" size="mini"  @click="lookDetail(scope.row)">查看详情</el-button>
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
    <!--检查结果录入模态框开始-->
    <el-dialog
      :title="title"
      :visible.sync="open"
      center
      close-on-click-modal
      append-to-body
      width="1000px"
    >
      <el-form ref="form" label-width="120px">
        <el-form-item label="检查结果" prop="resultMsg">
          {{ currentResult.resultMsg }}
        </el-form-item>
        <el-form-item label="检查附件上传">
<!--          <div v-for="(item,index) in currentResult.resultImg" :key="index">-->
<!--            <img :src="item.url" />-->
<!--          </div>-->
          <!--传递到后台的对象名称 name="mf"-->
          <el-upload
            :action="uploadPath"
            disabled
            :file-list="currentResult.resultImg"
            :on-preview="handlePictureCardPreview"
            list-type="picture"
            name="mf"
          >
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClose">关 闭</el-button>
      </span>
    </el-dialog>
    <!--检查结果录入模态框结束-->
    <!--图片预览开始-->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <!--图片预览结束-->
  </div>
</template>

<script>
import { queryAllCheckResultForPage } from '@/api/doctor/checkResult/checkResult'
import { selectAllCheckItem } from '@/api/system/checkItem/checkItem'

export default {
  name: 'ResultInput',
  data() {
    return {
      // 是否启用遮罩层,请求后台时出现进度条(如果请求响应很快的话,可能看不到)
      // 体现在页面上就是一个页面中心一个转圈的显示
      loading: false,
      // 分页数据总条数
      total: 0,
      // 数据列表中数据(字典类型)
      checkResultTableList: [],
      // 检查项目
      checkItemOptions: [],
      // 模态框的标题
      title: '',
      // 是否显示模态框
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1, // 默认第一页
        pageSize: 10, // 每页默认10条
        registrationid: undefined, // 挂号单据id
        checkItemIds: [], // 检查项目Id集合
        patientName: undefined // 患者姓名
      },
      // 是否为半选状态
      isIndeterminate: false,
      // 是否全选
      checkAll: false,
      // 详情数据
      currentResult: {
        resultMsg: undefined,
        resultImg: []
      },
      // 预览URL
      dialogImageUrl: undefined,
      // 是否显示预览模态框
      dialogVisible: false,
      // 上传路径
      uploadPath: undefined,
    }
  },
  // 生命周期,钩子函数  在实例创建完成后被立即调用
  created() {
    // 加载所有可用的检查项目
    selectAllCheckItem().then(res => {
      this.checkItemOptions = res.data
    })
    // 最后查询列表
    // 加载页面时,需要进行初始化数据,调用查询数据列表的方法
    this.getCheckList()
    // 文件上传的路径
    this.uploadPath = process.env.VUE_APP_BASE_API + '/system/upload/doUploadImage'
  },
  methods: {
    // 查询数据列表数据
    getCheckList() {
      // 打开遮罩
      this.loading = true
      // 调用分页查询的api方法
      // listForPage(this.queryParams).then(res => {
      // 通过addDateRange封装起始时间和结束时间
      queryAllCheckResultForPage(this.queryParams).then(res => {
        // 将分页数据传递给数据类表绑定的data数据
        this.checkResultTableList = res.data
        // 查询到数据了,就要显示分页了
        this.total = res.total
        this.msgSuccess('查询检查中项目数据成功')
        // 关闭遮罩
        this.loading = false
      })
    },
    // 查询操作
    handleQuery() {
      // 执行实际的查询方法
      // 因为输入的查询条件实时与queryParams动态绑定
      this.getCheckList()
    },
    // 清空查询条件操作
    resetQuery() {
      // 清空查询数据
      this.resetForm('queryForm')
      this.checkAll = false
      this.isIndeterminate = false
      // 重新查询数据列表,相当于执行一次无查询条件的查询操作,如果不调用这个方法,那么清空操作后,数据列表不会同步改变
      this.getCheckList()
    },
    // 改变每页显示条数的时候触发
    handleSizeChange(val) {
      // 更新每页显示条数
      this.queryParams.pageSize = val
      // 重新查询
      this.getCheckList()
    },
    // 当前页改变时触发(前一页,点击某一页,下一页,跳转某一页)
    handleCurrentChange(val) {
      // 更新需要显示的第几页数
      this.queryParams.pageNum = val
      // 重新查询
      this.getCheckList()
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
    // 查看结果
    lookDetail(row) {
      this.title = '查看【' + row.patientName + '】的检查结果'
      this.open = true
      this.currentResult.resultMsg = row.resultMsg
      if (row.resultImg !== '' || row.resultImg !== undefined) {
        // json串转为JSON对象
        this.currentResult.resultImg = JSON.parse(row.resultImg)
      }
    },
    // 模态框  取消按钮
    handleClose() {
      // 设置open为false,表示关闭模态框
      this.open = false
      // 重置
      this.currentResult = {
        resultMsg: undefined,
        resultImg: []
      }
    },
    // 文件预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
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
