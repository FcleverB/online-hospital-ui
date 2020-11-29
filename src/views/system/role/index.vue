<!--字典类型页面-->
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
      <el-form-item label="角色名称" prop="roleName">
        <!--input输入框
          v-model:指定与queryParams中哪个属性进行动态绑定
          placeholder:输入框内默认填充的数据,获得焦点后消失
          clearable:是否可以一键清除
          size:输入框大小,影响内容大小
        -->
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入角色名称"
          clearable
          size="small"
          style="width:140px"
        />
      </el-form-item>
      <el-form-item label="角色码值" prop="roleCode">
        <el-input
          v-model="queryParams.roleCode"
          placeholder="请输入角色码值"
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
    </el-row>
    <!--操作栏按钮结束-->
    <!--数据列表开始-->
    <!--el-table:数据列表
      v-loading:v-loading在接口未请求到数据之前，显示加载中，直到请求到数据后消失
      border:表示有边框
      data:数据列表中显示的数据从哪获取
      @selection-change:当选择项发生变化时会触发该事件
    -->
    <el-table v-loading="loading" border :data="roleTableList" @selection-change="handleSelectionChnage">
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
      <!--formatter:用于按照指定要求来格式化此处需要显示的值,显示在列表中的数据是经过statusFormatter处理后的内容-->
      <el-table-column label="显示顺序" prop="roleSort" align="center" width="100"/>
      <el-table-column label="状态" prop="status" align="center" width="100" :formatter="statusFormatter" />
      <el-table-column label="备注" prop="remark" align="center" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" prop="createTime" align="center" width="180" />
      <el-table-column label="操作" align="center">
        <!--slot-scope="scope" 取到当前单元格-->
        <template slot-scope="scope">
          <!--传递该条数据到具体处理方法中-->
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
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
      width="500px"
      center
      append-to-body
    >
      <!--添加和修改的表单
        rules:做表单数据前端校验
        label-width:标签宽度(文字)
      -->
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" clearable size="small" />
        </el-form-item>
        <el-form-item label="角色码值" prop="roleCode">
          <el-input v-model="form.roleCode" placeholder="请输入角色码值" clearable size="small" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="roleSort">
          <el-input-number v-model="form.roleSort" size="small" :min="0"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <!--单选框-->
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              :value="dict.dictValue"
            >{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入字典备注" clearable size="small" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
    <!--新增和修改模态框结束-->
  </div>
</template>

<script>
// 引入字典类型相关api
import { listRoleForPage, addRole, updateRole, deleteRoleByIds, getRoleById } from '@/api/system/role/role'
export default {
  name: 'Role',
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
      // 数据列表中数据
      roleTableList: [],
      // 模态框的标题
      title: '',
      // 是否显示模态框
      open: false,
      // 查询条件中状态的码表(正常,停用)
      statusOptions: [],
      // 查询条件中选择的日期范围数据
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1, // 默认第一页
        pageSize: 10, // 每页默认10条
        roleName: undefined, // 角色名称
        roleCode: undefined, // 角色码值
        status: undefined // 字典类型的状态
      },
      // 表单数据(添加和修改的模态框中的数据)
      form: {},
      // 表单校验(前端校验,失去焦点就会触发)
      // 给对应属性添加必填校验之后,会在label处显示*号
      rules: {
        // 字典名称
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleCode: [
          { required: true, message: '角色码值不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  // 生命周期,钩子函数  在实例创建完成后被立即调用
  created() {
    // 加载页面时,需要进行初始化数据,调用查询数据列表的方法
    this.getRoleList()
    // 使用全局的根据字典类型查询字典数据的方法来获取查询条件中的状态信息
    this.getDataByType('sys_normal_disable').then(res => {
      // 将查询到的状态信息保存到当前页面对应的属性中
      this.statusOptions = res.data
    })
  },
  methods: {
    // 查询数据列表数据
    getRoleList() {
      // 打开遮罩
      this.loading = true
      // 调用分页查询的api方法
      // listRoleForPage(this.queryParams).then(res => {
      // 通过addDateRange封装起始时间和结束时间
      listRoleForPage(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        // 将分页数据传递给数据类表绑定的data数据
        this.roleTableList = res.data
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
      this.getRoleList()
    },
    // 清空查询条件操作
    resetQuery() {
      // 清空查询数据
      this.resetForm('queryForm')
      // 清空查询条件中选择的日期数据
      this.dateRange = []
      // 重新查询数据列表,相当于执行一次无查询条件的查询操作,如果不调用这个方法,那么清空操作后,数据列表不会同步改变
      this.getRoleList()
    },
    // 添加操作,打开添加模态框
    handleAdd() {
      // 打开模态框
      this.open = true
      // 设置标题
      this.title = '添加角色信息'
      // 重置表单
      this.reset()
    },
    // 修改操作,打开修改模态框
    handleUpdate(row) {
      // 如果是点击数据列表上方的修改按钮时，是不会传递row数据的
      // 如果是点击每行记录后面的修改链接时可以拿到row数据
      // 如果row.roleId为undefined，那么就表示点击的是修改按钮，因此要ids的第一个数据就是选中的要修改的数据
      // 然后将该roleId作为查询条件向后台发送请求即可
      // const roleId = row.roleId === undefined ? this.ids[0] : row.roleId
      // 下面这种方式，如果是点击修改按钮得到的数据，那么roleId是一个仅有一个值的数组，传递到后台也可以匹配参数
      // js利用|| 或者 && 简便赋值方式
      const roleId = row.roleId || this.ids
      // 打开模态框
      this.open = true
      // 设置标题
      this.title = '添加角色信息'
      // 重置表单
      this.reset()
      // 根据id查询对应字典类型，并填充到form中
      // 这里通过id查询到的数据是一整条数据，填充到了form中，并不影响
      // getRoleById(row.roleId).then(res => {
      getRoleById(roleId).then(res => {
        this.form = res.data
      })
      // 优化点，row已经是一整条数据了，为啥还要走后台查询呢？
      // this.form = row
    },
    // 删除操作(含批量)
    handleDelete(row) {
      // 根据row.roleId是否为undefined来判断是批量删除还是单个删除
      // const roleId = row.roleId === undefined ? this.ids : row.roleId
      // const roleId = row.roleId === undefined ? this.ids[0] : row.roleId
      // 下面这种方式，如果是点击删除按钮得到的数据，那么roleId是一个含有多个值的数组，传递到后台也可以匹配参数
      // js利用|| 或者 && 简便赋值方式
      const roleId = row.roleId || this.ids
      // 确认框显示
      this.$confirm('此操作将永久删除该角色信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 开启遮罩
        this.loading = true
        // 调用api执行删除操作
        deleteRoleByIds(roleId).then(res => {
          // 关闭遮罩
          this.loading = false
          // 操作成功提示
          this.msgSuccess('删除成功')
          // 重新查询数据列表
          this.getRoleList()
        })
      }).catch(() => {
        // 关闭遮罩
        this.loading = false
        // 操作失败提示
        this.msgInfo('取消删除操作')
      })
    },
    // 改变数据列表第一列多选框选中状态所触发的方法,selection为选择的内容
    handleSelectionChnage(selection) {
      // selection保存着勾选的一条数据，以数组形式存储，对象为一个单位
      this.single = selection.length === 1
      this.multiple = selection.length > 1
      // 保存勾选的数据的id  item表示取出数组中一个数据，然后获取到该条数据的id，遍历完成后，ids拿到所有勾选的id
      this.ids = selection.map(item => item.roleId)
    },
    // 转换字典数据(code值与实际显示值)
    statusFormatter(row) {
      return this.transferDictCode(this.statusOptions, row.status)
    },
    // 改变每页显示条数的时候触发
    handleSizeChange(val) {
      // 更新每页显示条数
      this.queryParams.pageSize = val
      // 重新查询
      this.getRoleList()
    },
    // 当前页改变时触发(前一页,点击某一页,下一页,跳转某一页)
    handleCurrentChange(val) {
      // 更新需要显示的第几页数
      this.queryParams.pageNum = val
      // 重新查询
      this.getRoleList()
    },
    // 模态框  保存按钮
    /**
     * 因为新增和修改操作都是打开同一个模态框
     * 因此点击保存按钮时，需要区分执行的是新增操作还是修改操作
     *    个人想法：根据this.form.roleId来区分
     *              如果this.form.roleId不存在那么就是新增，因为roleId会在后台生成
     *               否则为修改操作
     */
    handleSubmit() {
      // 打开遮罩
      this.loading = true
      if (this.form.roleId === undefined) {
        // 添加操作
        // 表单前端校验，如果不通过就不会执行后端方法
        this.$refs['form'].validate((valid) => {
          if (valid) { // 通过校验
            // 调用保存字典类型的api，调用引入的api不可以使用this.xxx,因为不是当前页面的方法
            addRole(this.form).then(res => {
              // 显示保存成功的消息,调用全局消息
              this.msgSuccess('保存成功')
              // 关闭遮罩
              this.loading = false
              // 列表数据重新查询
              this.getRoleList()
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
            updateRole(this.form).then(res => {
              // 显示修改成功的消息,调用全局消息
              this.msgSuccess('修改成功')
              // 关闭遮罩
              this.loading = false
              // 列表数据重新查询
              this.getRoleList()
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
        roleId: undefined,
        roleName: undefined,
        roleCode: undefined,
        roleSort: 0,
        status: '0', // 默认选中正常状态
        remark: undefined
      }
      // 重置表单,对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.resetForm('form')
    }
  }
}
</script>

<style scoped>

</style>
