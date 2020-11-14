<!--字典数据页面-->
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
      <el-form-item label="字典类型" prop="dictType">
        <!--input输入框
          v-model:指定与queryParams中哪个属性进行动态绑定
          placeholder:输入框内默认填充的数据,获得焦点后消失
          clearable:是否可以一键清除
          size:输入框大小,影响内容大小
        -->
        <!--select下拉框-->
        <el-select
          v-model="queryParams.dictType"
          placeholder="请选择字典类型"
          clearable
          size="small"
          style="width:140px"
        >
          <!--下拉框内容,遍历dictTypeOptions属性,这里面保存了查询到的所有的字典类型数据
            key:唯一标注
            label:标签
            value:实际存储的值
          -->
          <el-option
            v-for="dict in dictTypeOptions"
            :key="dict.dictType"
            :label="dict.dictName"
            :value="dict.dictType"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="字典标签" prop="dictLabel">
        <el-input
          v-model="queryParams.dictLabel"
          placeholder="请输入字典标签"
          clearable
          size="small"
          style="width:140px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <!--select下拉框-->
        <el-select
          v-model="queryParams.status"
          placeholder="字典状态"
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
      <el-form-item>
        <!--查询和清空按钮-->
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">清空</el-button>
      </el-form-item>
    </el-form>
    <!--查询条件结束-->
    <!--操作栏按钮开始-->
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
    <el-table v-loading="loading" border :data="dictDataTableList" @selection-change="handleSelectionChnage">
      <!--el-table-column:每一行中的每一列
        prop:对应从:data中取出的数据
        align:对齐方式
        label:列名
        show-overflow-tooltip:默认情况下数据过长不够显示的时候是换行显示,如果需要单行显示,可以使用这个,并且当鼠标移动到此处时会显示实际内容的提示信息
      -->
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="字典编码" prop="dictCode" align="center" />
      <el-table-column label="字典标签" prop="dictLabel" align="center" />
      <el-table-column label="字典键值" prop="dictValue" align="center" />
      <el-table-column label="字典排序" prop="dictSort" align="center" />
      <!--formatter:用于按照指定要求来格式化此处需要显示的值,显示在列表中的数据是经过statusFormatter处理后的内容-->
      <el-table-column label="状态" prop="status" align="center" :formatter="statusFormatter" />
      <el-table-column label="备注" prop="remark" align="center" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" prop="createTime" align="center" width="180" />
      <el-table-column label="操作" align="center">
        <!--字典类型  slot-scope="scope" 来取得作用域插槽:data绑定的数据-->
        <template slot-scope="scope">
          <!--传递该条数据到具体处理方法中-->
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--数据列表结束-->
    <!--分页控件开始-->
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
    <!--分页控件结束-->
    <!--新增和修改模态框开始-->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      center
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="form.dictType" :disabled="true" size="small" />
        </el-form-item>
        <el-form-item label="数据标签" prop="dictLabel">
          <el-input v-model="form.dictLabel" placeholder="请输入数据标签" clearable size="small" />
        </el-form-item>
        <el-form-item label="数据键值" prop="dictValue">
          <el-input v-model="form.dictValue" placeholder="请输入数据键值" clearable size="small" />
        </el-form-item>
        <el-form-item label="排序显示" prop="dictSort">
          <!--el-input-number
              计数器 这里设置了最小为0，低于0之后无法减少
              步进为1
          -->
          <el-input-number v-model="form.dictSort" placeholder="请输入数据键值" clearable size="small" :min="0" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
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
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
    <!--新增和修改模态框结束-->
  </div>
</template>

<script>
import { listForPage, addDictData, updateDictData, deleteDictDataByIds, getDictDataById } from '@/api/system/dict/data'
import {
  addDictType,
  deleteDictTypeByIds,
  getDictTypeById,
  selectAllDictType,
  updateDictType
} from '@/api/system/dict/type'
export default {
  name: 'Data',
  data() {
    return {
      // 遮罩层
      loading: false,
      // 数据列表首列，勾选的id集合
      ids: [],
      // 非单个禁用
      single: false,
      // 非多个禁用
      multiple: false,
      // 总条数
      total: 0,
      // 字典数据表格数据
      dictDataTableList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 所有字典类型数据
      dictTypeOptions: [],
      // 默认查询的类型,点击某个字典类型进入到类型详情页面中，会在查询条件中默认选中该字典类型
      defaultDictType: undefined,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dictLabel: undefined, // 字典数据值（中文）
        dictType: undefined, // 所属的字典类型
        status: undefined // 状态
      },
      // 表单数据（新增和修改模态框）
      form: {},
      // 表单校验
      rules: {
        dictLabel: [
          { required: true, message: '数据标签不能为空', trigger: 'blur' }
        ],
        dictValue: [
          { required: true, message: '数据键值不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  // 生命周期,钩子函数  在实例创建完成后被立即调用
  created() {
    // 加载页面时,需要进行初始化数据,调用查询数据列表的方法
    // 查询操作不能放在最开始，因为查询条件中默认要选中点击进入时的字典类型，所以加载页面时的查询应该是查询指定字典类型的对应字典数据，应该往后放
    // this.getDictDataList()
    // 使用全局的根据字典类型查询字典数据的方法来获取查询条件中的状态信息
    this.getDataByType('sys_normal_disable').then(res => {
      // 将查询到的状态信息保存到当前页面对应的属性中
      this.statusOptions = res.data
    })
    // 进入该页面时，会在路由中携带所点击的字典类型id，可以根据此来进行显示默认内容，并且在查询条件中字典类型下拉框默认选中对应类型
    // js利用|| 或者 && 简便赋值方式
    const dictId = this.$route.params && this.$route.params.dictId // 路由传参
    // 根据字典类型id获取对应的字典类型,为了在查询条件中的字典类型中进行默认选中
    getDictTypeById(dictId).then(res => {
      // 保存查询到的字典类型
      this.defaultDictType = res.data.dictType
      // 下拉框中默认选中
      this.queryParams.dictType = res.data.dictType
    })
    // 查询所有的字典类型，填充在查询条件中的字典类型下拉框内
    selectAllDictType().then(res => {
      // 保存所有字典类型数据
      this.dictTypeOptions = res.data
      // 加载数据，对应字典类型的数据
      this.getDictDataList()
    })
  },
  methods: {
    // 查询数据列表数据
    getDictDataList() {
      // 打开遮罩
      this.loading = true
      // 调用分页查询的api方法
      listForPage(this.queryParams).then(res => {
        // 将分页数据传递给数据类表绑定的data数据
        this.dictDataTableList = res.data
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
      this.getDictDataList()
    },
    // 清空查询条件操作
    resetQuery() {
      // 清空查询数据
      this.resetForm('queryForm')
      // 设置查询条件中的默认选中字典类型依旧是点击进入时的类型
      this.queryParams.dictType = this.defaultDictType
      // 重新查询数据列表,相当于执行一次无查询条件的查询操作,如果不调用这个方法,那么清空操作后,数据列表不会同步改变
      this.getDictDataList()
    },
    // 添加操作,打开添加模态框
    handleAdd() {
      // 打开模态框
      this.open = true
      // 重置表单   重新初始化值并清空校验提示
      this.reset()
      // 上下两步顺序不能反，先重置后赋值
      // 设置字典类型默认选中的值
      this.form.dictType = this.defaultDictType
    },
    // 修改操作,打开修改模态框
    handleUpdate(row) {
      // 如果是点击数据列表上方的修改按钮时，是不会传递row数据的
      // 如果是点击每行记录后面的修改链接时可以拿到row数据
      // 如果row.dictCode为undefined，那么就表示点击的是修改按钮，因此要ids的第一个数据就是选中的要修改的数据
      // 然后将该dictId作为查询条件向后台发送请求即可
      // const dictCode = row.dictCode === undefined ? this.ids[0] : row.dictCode
      // 下面这种方式，如果是点击修改按钮得到的数据，那么dictId是一个仅有一个值的数组，传递到后台也可以匹配参数
      // js利用|| 或者 && 简便赋值方式
      const dictCode = row.dictCode || this.ids
      // 打开模态框
      this.open = true
      // 重置表单
      this.reset()
      // 根据id查询对应字典类型，并填充到form中
      // 这里通过id查询到的数据是一整条数据，填充到了form中，并不影响
      // getDictDataById(row.dictId).then(res => {
      getDictDataById(dictCode).then(res => {
        this.form = res.data
      })
      // 优化点，row已经是一整条数据了，为啥还要走后台查询呢？
      // this.form = row
    },
    // 删除操作(含批量)
    handleDelete(row) {
      // 根据row.dictId是否为undefined来判断是批量删除还是单个删除
      // const dictId = row.dictId === undefined ? this.ids : row.dictId
      // const dictId = row.dictId === undefined ? this.ids[0] : row.dictId
      // 下面这种方式，如果是点击删除按钮得到的数据，那么dictId是一个含有多个值的数组，传递到后台也可以匹配参数
      // js利用|| 或者 && 简便赋值方式
      const dictCode = row.dictCode || this.ids
      // 确认框显示
      this.$confirm('此操作将永久删除该字典数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 开启遮罩
        this.loading = true
        // 调用api执行删除操作
        deleteDictDataByIds(dictCode).then(res => {
          // 关闭遮罩
          this.loading = false
          // 操作成功提示
          this.msgSuccess('删除成功')
          // 重新查询数据列表
          this.getDictDataList()
        })
      }).catch(() => {
        // 关闭遮罩
        this.loading = false
        // 操作失败提示
        this.msgInfo('取消删除操作')
      })
    },
    // 重置表单
    reset() {
      // 设置初始值
      this.form = {
        dictCode: undefined, // 字典数据主键
        dictLable: undefined, // 字典数据标签，中文值
        dictValue: undefined, // 字典数据键值  数字
        dictType: undefined, // 字典数据对应的类型
        status: '0', // 默认状态 正常
        dictSort: 0, // 默认排序号  0
        remark: undefined // 备注
      }
      // 重置表单,对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.resetForm('form')
    },
    // 改变数据列表第一列多选框选中状态所触发的方法,selection为选择的内容
    handleSelectionChnage(selection) {
      // selection保存着勾选的一条数据，以数组形式存储，对象为一个单位
      this.single = selection.length === 1
      this.multiple = selection.length > 1
      // 保存勾选的数据的id  item表示取出数组中一个数据，然后获取到该条数据的id，遍历完成后，ids拿到所有勾选的id
      this.ids = selection.map(item => item.dictCode)
    },
    // 改变每页显示条数的时候触发
    handleSizeChange(val) {
      // 更新每页显示条数
      this.queryParams.pageSize = val
      // 重新查询
      this.getDictDataList()
    },
    // 当前页改变时触发(前一页,点击某一页,下一页,跳转某一页)
    handleCurrentChange(val) {
      // 更新需要显示的第几页数
      this.queryParams.pageNum = val
      // 重新查询
      this.getDictDataList()
    },
    // 转换字典数据(code值与实际显示值)
    statusFormatter(row) {
      return this.transferDictCode(this.statusOptions, row.status)
    },
    // 模态框  保存按钮
    /**
     * 因为新增和修改操作都是打开同一个模态框
     * 因此点击保存按钮时，需要区分执行的是新增操作还是修改操作
     *    个人想法：根据this.form.dictId来区分
     *              如果this.form.dictId不存在那么就是新增，因为dictId会在后台生成
     *               否则为修改操作
     */
    handleSubmit() {
      // 打开遮罩
      this.loading = true
      if (this.form.dictCode === undefined) {
        // 添加操作
        // 表单前端校验，如果不通过就不会执行后端方法
        this.$refs['form'].validate((valid) => {
          if (valid) { // 通过校验
            // 调用保存字典类型的api，调用引入的api不可以使用this.xxx,因为不是当前页面的方法
            addDictData(this.form).then(res => {
              // 显示保存成功的消息,调用全局消息
              this.msgSuccess('保存成功')
              // 关闭遮罩
              this.loading = false
              // 列表数据重新查询
              this.getDictDataList()
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
            updateDictData(this.form).then(res => {
              // 显示修改成功的消息,调用全局消息
              this.msgSuccess('修改成功')
              // 关闭遮罩
              this.loading = false
              // 列表数据重新查询
              this.getDictDataList()
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
    }
  }
}
</script>

<style scoped>

</style>
