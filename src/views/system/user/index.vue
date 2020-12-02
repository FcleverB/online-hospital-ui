<!--用户管理页面-->
<template>
  <div class="app-container">
    <!--查询条件开始-->
    <!--
      ref:
      model:绑定查询条件部分的数据绑定,与queryParams有关,点击查询按钮时,将查询参数传递到后台
      inline:变为行内域
      label-width:设置每个标签的宽度,指定在el-form上时,其直接子标签form-item会继承该值
    -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="所属科室" prop="deptId">
        <!--select下拉框-->
        <el-select
          v-model="queryParams.deptId"
          placeholder="请选择科室"
          clearable
          size="small"
          style="width:140px"
        >
          <!--下拉框内容,遍历statusOptions属性,这里面保存了查询的状态的码表
            key:唯一标注
            label:标签
            value:实际存储的值
          -->
          <el-option
            v-for="dict in deptOptions"
            :key="dict.deptId"
            :label="dict.deptName"
            :value="dict.deptId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用户名称" prop="userName">
        <!--input输入框
          v-model:指定与queryParams中哪个属性进行动态绑定
          placeholder:输入框内默认填充的数据,获得焦点后消失
          clearable:是否可以一键清除
          size:输入框大小,影响内容大小
        -->
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名称"
          clearable
          size="small"
          style="width:140px"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
          clearable
          size="small"
          style="width:140px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <!--select下拉框-->
        <el-select
          v-model="queryParams.status"
          placeholder="状态"
          clearable
          size="small"
          style="width:140px"
        >
          <!--下拉框内容,遍历statusOptions属性,这里面保存了查询的状态的码表
            key:唯一标注
            label:标签
            value:实际存储的值
          -->
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <!--date-picker:日期选择框
          value-format:日期格式
          type:类型,这里是可以选取范围数据
          range-separator:分隔符,页面显示中会把开始日期和结束日期用该符号分割开
          start-placeholder:第一个空的默认显示内容
          end-placeholder:第二个空的默认显示内容
        -->
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width:280px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
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
    <!--el-row:表示一行数据
      gutter:每一栏之间的间隔
    -->
    <el-row :gutter="10" style="margin-bottom: 8px;">
      <!--el-col:表示一列
        span:指定该列所占的宽度,最大指定为24
      -->
      <el-col :span="1.5">
        <!--新增按钮:尺寸mini-->
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <!--修改按钮:只有在选中一条记录的时候,才会处于可用状态-->
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="!single" @click="handleUpdate">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <!--删除按钮,只要有选中数据就可用,不管一条还是多条-->
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="!multiple" @click="handleDelete">批量删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-refresh" size="mini" :disabled="!single" @click="handleAssign">分配角色</el-button>
      </el-col>
      <el-col :span="1.5">
        <!--重置密码  多选-->
        <el-button type="info" icon="el-icon-refresh" size="mini" @click="resetPassword">重置密码</el-button>
      </el-col>
    </el-row>
    <!--操作栏按钮结束-->
    <!--数据列表开始-->
    <!--el-table:数据列表
      v-loading:v-loading在接口未请求到数据之前，显示加载中，直到请求到数据后消失
      border:表示有边框
      data:数据列表中显示的数据从哪获取
      @selection-change:当选择项发生变化时会触发该事件
    -->
    <el-table v-loading="loading" border :data="userTableList" @selection-change="handleSelectionChange">
      <!--el-table-column:每一行中的每一列
        prop:对应从:data中取出的数据
        align:对齐方式
        label:列名
        show-overflow-tooltip:默认情况下数据过长不够显示的时候是换行显示,如果需要单行显示,可以使用这个,并且当鼠标移动到此处时会显示实际内容的提示信息
      -->
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="邮箱">
              <span>{{scope.row.email}}</span>
            </el-form-item>
            <el-form-item label="擅长">
              <span>{{scope.row.hobby}}</span>
            </el-form-item>
            <el-form-item label="荣誉">
              <span>{{scope.row.honor}}</span>
            </el-form-item>
            <el-form-item label="简介">
              <span>{{scope.row.introduction}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="用户ID" prop="userId" align="center" width="100"/>
      <el-table-column label="用户名称" prop="userName" align="center" :show-overflow-tooltip="true" />
      <!--部门如何显示-->
      <el-table-column label="所属部门" prop="deptId" align="center" :show-overflow-tooltip="true" :formatter="deptFormatter"></el-table-column>
      <!--formatter:用于按照指定要求来格式化此处需要显示的值,显示在列表中的数据是经过statusFormatter处理后的内容-->
      <el-table-column label="手机号码" prop="phone" align="center" width="110"/>
      <el-table-column label="性别" prop="sex" align="center" width="100" :formatter="sexFormatter"/>
      <el-table-column label="年龄" prop="age" align="center" width="100"/>
      <el-table-column label="是否排班" prop="schedulingFlag" align="center" width="100" :formatter="schedulingFlagFormatter"/>
      <el-table-column label="级别" prop="userRank" align="center" width="100" :formatter="userRankFormatter"/>
      <el-table-column label="学历" prop="background" align="center" width="100" :formatter="backgroundFormatter"/>
      <el-table-column label="状态" prop="status" align="center" width="100" :formatter="statusFormatter" />
      <el-table-column label="创建时间" prop="createTime" align="center" width="180" />
      <el-table-column label="操作" align="center">
        <!--slot-scope="scope" 取到当前单元格-->
        <template slot-scope="scope">
          <!--传递该条数据到具体处理方法中-->
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button v-if="scope.row.userId != 1" type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          <el-button v-if="scope.row.userId != 1" type="text" icon="el-icon-refresh" size="mini" @click="handleAssign(scope.row)">分配角色</el-button>
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
      v-show="total>0"
      :current-page="queryParams.pageNum"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="queryParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--底部分页结束-->
    <!--新增和修改模态框开始-->
    <!--dialog:对话框
      title:模态框标题
      visible.sync:表示是否显示
      center:居中
      append-to-body:如果需要在一个对话框内部嵌套另一个对话框，需要使用append-to-body属性
    -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="800px"
      center
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名称" prop="userName">
              <el-input v-model="form.userName" style="width:240px" placeholder="请输入用户名称" clearable size="small" />
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone" style="width:240px" placeholder="请输入手机号" clearable size="small" />
            </el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属科室" prop="deptId">
              <el-select
                v-model="form.deptId"
                placeholder="所属科室"
                clearable
                size="small"
                style="width:240px"
              >
                <el-option
                  v-for="item in deptOptions"
                  :key="item.deptId"
                  :label="item.deptName"
                  :value="item.deptId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户级别" prop="userRank">
              <el-select
                v-model="form.userRank"
                placeholder="用户级别"
                clearable
                size="small"
                style="width:240px"
              >
                <el-option
                  v-for="item in userRankOptions"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input-number v-model="form.age" clearable size="small" :min="0"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="背景" prop="background">
              <el-select
                v-model="form.background"
                placeholder="学历"
                clearable
                size="small"
                style="width:240px"
              >
                <el-option
                  v-for="item in backgroundOptions"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="form.sex">
                <el-radio
                  v-for="item in sexOptions"
                  :key="item.dictValue"
                  :label="item.dictValue"
                  :value="item.dictValue"
                >{{ item.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="item in statusOptions"
                  :key="item.dictValue"
                  :label="item.dictValue"
                  :value="item.dictValue"
                >{{ item.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否参与排班" prop="schedulingFlag">
              <el-radio-group v-model="form.schedulingFlag">
                <el-radio
                  v-for="item in schedulingFlagOptions"
                  :key="item.dictValue"
                  :label="item.dictValue"
                  :value="item.dictValue"
                >{{ item.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" style="width:240px" placeholder="请输入用户邮箱" clearable size="small" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="擅长" prop="hobby">
              <el-input v-model="form.hobby" type="textarea" placeholder="请输入用户擅长" autosize resize="none"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="荣誉" prop="honor">
              <el-input v-model="form.honor" type="textarea" placeholder="请输入用户相关荣誉" autosize resize="none"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="简介" prop="introduction">
              <el-input v-model="form.introduction" type="textarea" placeholder="请输入用户简介" autosize resize="none"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
    <!--新增和修改模态框结束-->
    <!--分配菜单模态框开始-->
    <el-dialog
      :title="title"
      :visible.sync="assignOpen"
      width="800px"
      center
      append-to-body>
      <el-table ref="roleList" v-loading="loading" border :data="roleTableList" @selection-change="handleRoleSelectionChange">
        <!--el-table-column:每一行中的每一列
          prop:对应从:data中取出的数据
          align:对齐方式
          label:列名
          show-overflow-tooltip:默认情况下数据过长不够显示的时候是换行显示,如果需要单行显示,可以使用这个,并且当鼠标移动到此处时会显示实际内容的提示信息
        -->
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="角色ID" prop="roleId" align="center" width="100"/>
        <el-table-column label="角色名称" prop="roleName" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="角色码值" prop="roleCode" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="备注" prop="remark" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="创建时间" prop="createTime" align="center" width="180" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAssignSave">保 存</el-button>
        <el-button @click="cancelAssign">取 消</el-button>
      </span>
    </el-dialog>
    <!--分配菜单模态框结束-->
  </div>
</template>

<script>
// 引入科室管理api
import { selectAllDept } from '@/api/system/dept/dept'
// 引入用户管理相关api
import { listUserForPage, addUser, updateUser, deleteUserByIds, getUserById, resetPassword,saveUserAndRole } from '@/api/system/user/user'
// 引入角色管理api，获取所有角色信息
import { selectAllRoles, getRoleIdsByUserId } from '@/api/system/role/role'

export default {
  name: 'User',
  data() {
    return {
      // 是否启用遮罩层,请求后台时出现进度条(如果请求响应很快的话,可能看不到)
      // 体现在页面上就是一个页面中心一个转圈的显示
      loading: false,
      // 选中的字典类型的id集合
      ids: [],
      // 选中的角色id集合
      roleIds: [],
      // 判断是否选中了单条记录,进而控制一些页面行为,比如选中了单个可以进行修改操作
      single: false,
      // 判断是否选中了多条记录,进行控制一些页面行为,比如选中了多个可以进行批量删除操作
      multiple: false,
      // 分页数据总条数
      total: 0,
      // 数据列表中数据
      userTableList: [],
      // 模态框的标题
      title: '',
      // 是否显示新增和修改的模态框
      open: false,
      // 是否显示分配菜单模态框
      assignOpen: false,
      // 查询条件中状态的码表(正常,停用)
      statusOptions: [],
      // 性别信息
      sexOptions: [],
      // 是否排班信息
      schedulingFlagOptions: [],
      // 级别信息
      userRankOptions: [],
      // 学历信息
      backgroundOptions: [],
      // 查询条件中部门下拉码表
      deptOptions: [],
      // 查询条件中选择的日期范围数据
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1, // 默认第一页
        pageSize: 10, // 每页默认10条
        deptId: undefined, // 部门id  下拉框显示部门名称
        userName: undefined, // 用户名称
        phone: undefined, // 手机号
        status: undefined // 数据状态
      },
      // 表单数据(添加和修改的模态框中的数据)
      form: {},
      // 表单校验(前端校验,失去焦点就会触发)
      // 给对应属性添加必填校验之后,会在label处显示*号
      // ----------------
      rules: {
        // 字典名称
        deptId: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '角色码值不能为空', trigger: 'blur' }
        ]
      },
      // 角色的数据
      roleTableList: [],
      // 当前选中的用户id
      currentUserId: undefined
    }
  },
  // 生命周期,钩子函数  在实例创建完成后被立即调用
  created() {
    // 使用全局的根据字典类型查询字典数据的方法来获取查询条件中的状态信息
    this.getDataByType('sys_normal_disable').then(res => {
      // 将查询到的状态信息保存到当前页面对应的属性中
      this.statusOptions = res.data
    })
    // 查询部门列表
    selectAllDept().then(res => {
      this.deptOptions = res.data
    })
    // 性别码表
    this.getDataByType('sys_user_sex').then(res => {
      // 将查询到的状态信息保存到当前页面对应的属性中
      this.sexOptions = res.data
    })
    // 查询是否排班信息码表
    this.getDataByType('sys_yes_no').then(res => {
      this.schedulingFlagOptions = res.data
    })
    // 查询级别信息码表
    this.getDataByType('sys_user_level').then(res => {
      // 将查询到的状态信息保存到当前页面对应的属性中
      this.userRankOptions = res.data
    })
    // 查询学历信息码表
    this.getDataByType('sys_user_background').then(res => {
      // 将查询到的状态信息保存到当前页面对应的属性中
      this.backgroundOptions = res.data
    })
    // 顺序一定要注意，先查码表（或者其他），然后再查询列表数据
    // 加载页面时,需要进行初始化数据,调用查询数据列表的方法
    this.getUserList()
  },
  methods: {
    // 查询数据列表数据
    getUserList() {
      // 打开遮罩
      this.loading = true
      // 调用分页查询的api方法
      // listUserForPage(this.queryParams).then(res => {
      // 通过addDateRange封装起始时间和结束时间
      listUserForPage(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        // 将分页数据传递给数据类表绑定的data数据
        this.userTableList = res.data
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
      this.getUserList()
    },
    // 清空查询条件操作
    resetQuery() {
      // 清空查询数据
      this.resetForm('queryForm')
      // 清空查询条件中选择的日期数据
      this.dateRange = []
      // 重新查询数据列表,相当于执行一次无查询条件的查询操作,如果不调用这个方法,那么清空操作后,数据列表不会同步改变
      this.getUserList()
    },
    // 添加操作,打开添加模态框
    handleAdd() {
      // 打开模态框
      this.open = true
      // 设置标题
      this.title = '添加用户信息'
      // 重置表单
      this.reset()
    },
    // 修改操作,打开修改模态框
    handleUpdate(row) {
      // 如果是点击数据列表上方的修改按钮时，是不会传递row数据的
      // 如果是点击每行记录后面的修改链接时可以拿到row数据
      // 如果row.userId为undefined，那么就表示点击的是修改按钮，因此要ids的第一个数据就是选中的要修改的数据
      // 然后将该userId作为查询条件向后台发送请求即可
      // const userId = row.userId === undefined ? this.ids[0] : row.userId
      // 下面这种方式，如果是点击修改按钮得到的数据，那么userId是一个仅有一个值的数组，传递到后台也可以匹配参数
      // js利用|| 或者 && 简便赋值方式
      const userId = row.userId || this.ids
      // 打开模态框
      this.open = true
      // 设置标题
      this.title = '添加用户信息'
      // 重置表单
      this.reset()
      // 根据id查询对应字典类型，并填充到form中
      // 这里通过id查询到的数据是一整条数据，填充到了form中，并不影响
      // getUserById(row.userId).then(res => {
      getUserById(userId).then(res => {
        this.form = res.data
      })
      // 优化点，row已经是一整条数据了，为啥还要走后台查询呢？
      // this.form = row
    },
    // 删除操作(含批量)
    handleDelete(row) {
      // 根据row.userId是否为undefined来判断是批量删除还是单个删除
      // const userId = row.userId === undefined ? this.ids : row.userId
      // const userId = row.userId === undefined ? this.ids[0] : row.userId
      // 下面这种方式，如果是点击删除按钮得到的数据，那么userId是一个含有多个值的数组，传递到后台也可以匹配参数
      // js利用|| 或者 && 简便赋值方式
      const userId = row.userId || this.ids
      // 确认框显示
      this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 开启遮罩
        this.loading = true
        // 调用api执行删除操作
        deleteUserByIds(userId).then(res => {
          // 关闭遮罩
          this.loading = false
          // 操作成功提示
          this.msgSuccess('删除成功')
          // 重新查询数据列表
          this.getUserList()
        }).catch(() => {
          // 按之前的情况来看，出现异常会被通知Notification拦截
          this.loading = false
        })
      }).catch(() => {
        // 关闭遮罩
        this.loading = false
        // 操作失败提示
        this.msgInfo('取消删除操作')
      })
    },
    // 改变数据列表第一列多选框选中状态所触发的方法,selection为选择的内容
    handleSelectionChange(selection) {
      // selection保存着勾选的一条数据，以数组形式存储，对象为一个单位
      this.single = selection.length === 1
      this.multiple = selection.length > 1
      // 保存勾选的数据的id  item表示取出数组中一个数据，然后获取到该条数据的id，遍历完成后，ids拿到所有勾选的id
      this.ids = selection.map(item => item.userId)
    },
    // 角色列表勾选触发
    handleRoleSelectionChange(selection) {
      // 保存勾选的角色数据的id  item表示取出数组中一个数据，然后获取到该条数据的id，遍历完成后，ids拿到所有勾选的id
      this.roleIds = selection.map(item => item.roleId)
    },
    // 转换字典数据(code值与实际显示值)
    statusFormatter(row) {
      return this.transferDictCode(this.statusOptions, row.status)
    },
    // 科室信息（非码表）
    deptFormatter(row) {
      let deptName = ''
      this.deptOptions.filter(item => {
        if (parseInt(item.deptId) === parseInt(row.deptId)) {
          deptName = item.deptName
        }
      })
      // 返回值将被显示出来
      return deptName
    },
    // 性别信息码表
    sexFormatter(row) {
      return this.transferDictCode(this.sexOptions, row.sex)
    },
    // 转换排班信息
    schedulingFlagFormatter(row) {
      return this.transferDictCode(this.schedulingFlagOptions, row.schedulingFlag)
    },
    // 转换级别信息
    userRankFormatter(row) {
      return this.transferDictCode(this.userRankOptions, row.userRank)
    },
    // 装换学历信息
    backgroundFormatter(row) {
      return this.transferDictCode(this.backgroundOptions, row.background)
    },
    // 改变每页显示条数的时候触发
    handleSizeChange(val) {
      // 更新每页显示条数
      this.queryParams.pageSize = val
      // 重新查询
      this.getUserList()
    },
    // 当前页改变时触发(前一页,点击某一页,下一页,跳转某一页)
    handleCurrentChange(val) {
      // 更新需要显示的第几页数
      this.queryParams.pageNum = val
      // 重新查询
      this.getUserList()
    },
    // 模态框  保存按钮
    /**
     * 因为新增和修改操作都是打开同一个模态框
     * 因此点击保存按钮时，需要区分执行的是新增操作还是修改操作
     *    个人想法：根据this.form.userId来区分
     *              如果this.form.userId不存在那么就是新增，因为userId会在后台生成
     *               否则为修改操作
     */
    handleSubmit() {
      // 打开遮罩
      this.loading = true
      if (this.form.userId === undefined) {
        // 添加操作
        // 表单前端校验，如果不通过就不会执行后端方法
        this.$refs['form'].validate((valid) => {
          if (valid) { // 通过校验
            // 调用保存字典类型的api，调用引入的api不可以使用this.xxx,因为不是当前页面的方法
            addUser(this.form).then(res => {
              // 显示保存成功的消息,调用全局消息
              this.msgSuccess('保存成功')
              // 关闭遮罩
              this.loading = false
              // 列表数据重新查询
              this.getUserList()
              // 关闭模态框
              this.open = false
            }).catch(() => {
              // 出现异常的处理方式
              // 已经通过响应拦截器处理了该类型的异常，并显示了提示信息
              // 关闭遮罩
              this.loading = false
            })
          } else {
            this.msgError('数据校验不通过')
            this.loading = false
          }
        })
      } else {
        // 修改操作
        // 表单前端校验，如果不通过就不会执行后端方法
        this.$refs['form'].validate((valid) => {
          if (valid) {
            updateUser(this.form).then(res => {
              // 显示修改成功的消息,调用全局消息
              this.msgSuccess('修改成功')
              // 关闭遮罩
              this.loading = false
              // 列表数据重新查询
              this.getUserList()
              // 关闭模态框
              this.open = false
            }).catch(() => {
              // 出现异常的处理方式
              // 已经通过响应拦截器处理了该类型的异常，并显示了提示信息
              // 关闭遮罩
              this.loading = false
            })
          } else {
            this.msgError('数据校验不通过')
            this.loading = false
          }
        })
      }
    },
    // 模态框  取消按钮
    cancel() {
      // 设置open为false,表示关闭模态框
      this.open = false
    },
    // 重置表单
    reset() {
      // 设置初始值
      this.form = {
        userId: undefined,
        userName: undefined,
        phone: undefined,
        userRank: undefined,
        sex: '0',
        age: 0,
        status: '0',
        email: undefined,
        hobby: undefined,
        honor: undefined,
        introduction: undefined,
        remark: undefined,
        schedulingFlag: '0'
      }
      // 重置表单,对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.resetForm('form')
    },
    resetPassword() {
      const userIds = this.ids
      if (userIds.length === 0) {
        this.msgInfo('请至少选择一个用户进行操作')
      } else {
        this.$confirm('是否确认重置用户ID为:' + userIds + '的密码?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          resetPassword(userIds).then(res => {
            this.msgSuccess('重置成功')
          }).catch(() => {
            this.msgSuccess('重置失败')
          })
        }).catch(() => {
          this.msgInfo('重置已取消')
        })
      }
    },
    // 分配菜单模态框
    handleAssign(row) {
      // 获取要设置角色的用户id
      this.currentUserId = row.userId || this.ids[0]
      // 打开模态框
      this.assignOpen = true
      // 标题
      this.title = '分配角色'
      // 获取所有角色信息，并保存到数组中
      selectAllRoles().then(res1 => {
        this.roleTableList = res1.data
        /**
         * this.$nextTick()
         *    Vue更新DOM的时候是异步执行的。
         *    Vue实现响应式并不是数据发生变化后DOM立即变化，而是按照一定的策略进行DOM更新
         *    在修改数据之后使用nextTick，可以在该方法的回调中获取到最新的DOM
         *    在此处，通过查询所有的角色信息，对roleTableList的数据进行了更新，
         *    然后我们需要继续查询当前选择的用户id来查询该用户已经分配过的角色，然后在
         *    roleTableList中的对应角色数据进行选中，因此要对更新的roleTableList进行
         *    过滤
         */
        // 如果是点击行数据的分配，还需要查询当前用户已经存在的角色，并自动勾选
        this.$nextTick(() => {
          // 根据当前用户id查询该用户所已分配的角色id
          getRoleIdsByUserId(this.currentUserId).then(res2 => {
            res2.data.filter(f1 => {
              this.roleTableList.filter(f2 => {
                if (f1 === f2.roleId) {
                  // 选中表格checkbox
                  this.$refs.roleList.toggleRowSelection(f2, true)
                }
              })
            })
          })
        })
      })
    },
    // 保存分配角色信息
    handleAssignSave() {
      // 获取勾选的角色id数组
      const roleIds = this.roleIds
      // 保存方法
      saveUserAndRole(this.currentUserId, roleIds).then(res => {
        // 显示修改成功的消息,调用全局消息
        this.msgSuccess('分配角色成功')
        // 关闭模态框
        this.assignOpen = false
      }).catch(() => {
        this.msgError('分配角色失败')
      })
    },
    // 取消分配角色操作
    cancelAssign() {
      // 关闭模态框
      this.assignOpen = false
      // 清空角色数据
      this.roleTableList = []
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
