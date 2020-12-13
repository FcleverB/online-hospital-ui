<!--字典类型页面-->
<template>
  <div class="app-container">
    <!--查询条件开始-->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="药品名称" prop="medicinesName">
        <el-input
          v-model="queryParams.medicinesName"
          placeholder="请输入药品名称"
          clearable
          size="small"
          style="width:140px"
        />
      </el-form-item>
      <el-form-item label="关键字" prop="keywords">
        <el-input
          v-model="queryParams.keywords"
          placeholder="请输入关键字"
          clearable
          size="small"
          style="width:140px"
        />
      </el-form-item>
      <el-form-item label="药品类型" prop="medicinesType">
        <el-select
          v-model="queryParams.medicinesType"
          placeholder="请选择药品类型"
          clearable
          size="small"
          style="width:140px"
        >
          <el-option
            v-for="dict in medicinesTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="生产厂家" prop="producterId">
        <el-select
          v-model="queryParams.producterId"
          placeholder="请选择生产厂家"
          clearable
          size="small"
          style="width:200px"
        >
          <el-option
            v-for="dict in producterOptions"
            :key="dict.producterId"
            :label="dict.producterName"
            :value="dict.producterId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="处方类型" prop="prescriptionType">
        <el-select
          v-model="queryParams.prescriptionType"
          placeholder="请选择处方类型"
          clearable
          size="small"
          style="width:140px"
        >
          <el-option
            v-for="dict in prescriptionTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          size="small"
          style="width:140px"
        >
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
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="!single" @click="handleUpdate">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="!multiple" @click="handleDelete">批量删除</el-button>
      </el-col>
    </el-row>
    <!--操作栏按钮结束-->
    <!--数据列表开始-->
    <el-table v-loading="loading" border :data="medicinesTableList" @selection-change="handleSelectionChange">
      <!--el-table-column:每一行中的每一列
        prop:对应从:data中取出的数据
        align:对齐方式
        label:列名
        show-overflow-tooltip:默认情况下数据过长不够显示的时候是换行显示,如果需要单行显示,可以使用这个,并且当鼠标移动到此处时会显示实际内容的提示信息
      -->
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="单位">
              <span>{{ props.row.unit }}</span>
            </el-form-item>
            <el-form-item label="库存量">
              <span>{{ props.row.medicinesStockNum }}</span>
            </el-form-item>
            <el-form-item label="预警值">
              <span>{{ props.row.medicinesStockDangerNum }}</span>
            </el-form-item>
            <el-form-item label="换算量">
              <span>{{ props.row.conversion }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="药品ID" prop="medicinesId" align="center" />
      <el-table-column label="药品名称" prop="medicinesName" align="center"/>
      <el-table-column label="药品编号" prop="medicinesNumber" align="center"/>
      <el-table-column label="生产厂家" prop="producterId" width="250px" align="center" :formatter="producterFormatter"/>
      <el-table-column label="药品类型" prop="medicinesType" align="center" :formatter="medicinesTypeFormatter"/>
      <el-table-column label="处方类型" prop="prescriptionType" align="center" :formatter="prescriptionTypeFormatter"/>
      <el-table-column label="关键字" prop="keywords" align="center"/>
      <el-table-column label="处方价格" prop="prescriptionPrice" align="center"/>
      <el-table-column label="状态" prop="status" align="center" :formatter="statusFormatter" />
      <el-table-column label="操作" align="center">
        <!--slot-scope="scope" 取到当前单元格-->
        <template slot-scope="scope">
          <!--传递该条数据到具体处理方法中-->
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdateStock(scope.row)">调整库存</el-button>
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
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="药品名称" prop="medicinesName">
              <el-input v-model="form.medicinesName" style="width:240px" placeholder="请输入药品名称" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="药品编码" prop="medicinesNumber">
              <el-input v-model="form.medicinesNumber" style="width:240px" placeholder="请输入药品编码" clearable size="small" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="关键字" prop="keywords">
              <el-input v-model="form.keywords" style="width:240px" placeholder="请输入关键字" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位" prop="unit">
              <el-input v-model="form.unit" style="width:240px" placeholder="请输入单位" clearable size="small" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="换算量" prop="conversion">
              <el-input v-model="form.conversion" style="width:240px" placeholder="请输入换算量" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处方价格" prop="prescriptionPrice">
              <el-input-number v-model="form.prescriptionPrice" style="width:240px" placeholder="请输入处方价格" size="small" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="库存量" prop="medicinesStockNum">
              <el-input-number v-model="form.medicinesStockNum" style="width:240px" placeholder="请输入库存量" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预警值" prop="medicinesStockDangerNum">
              <el-input-number v-model="form.medicinesStockDangerNum" style="width:240px" placeholder="请输入预警值" size="small" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status" style="width:240px">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                  :value="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="药品类型" prop="medicinesType">
              <el-select
                v-model="form.medicinesType"
                style="width:240px"
                placeholder="药品类型"
                size="small"
              >
                <el-option
                  v-for="dict in medicinesTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="处方类型" prop="prescriptionType">
              <el-select
                v-model="form.prescriptionType"
                style="width:240px"
                placeholder="处方类型"
                size="small"
              >
                <el-option
                  v-for="dict in prescriptionTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产厂家" prop="producterId">
              <el-select
                v-model="form.producterId"
                style="width:240px"
                placeholder="生产厂家"
                size="small"
              >
                <el-option
                  v-for="d in producterOptions"
                  :key="d.producterId"
                  :label="d.producterName"
                  :value="d.producterId"
                />
              </el-select>
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
  </div>
</template>

<script>
// 引入生产厂家api，查询所有可用的生产厂家信息
import { selectAllProducter } from '@/api/erp/producter/producter'
// 引入药品信息相关api
import { updateMedicines, listMedicinesForPage, deleteMedicinesByIds, getMedicinesById, addMedicines, updateMedicinesStock } from '@/api/erp/medicines/medicines'
export default {
  name: 'Medicines',
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
      medicinesTableList: [],
      // 模态框的标题
      title: '',
      // 是否显示模态框
      open: false,
      // 查询条件中状态的码表(正常,停用)
      statusOptions: [],
      // 查询条件中药品类型的码表
      medicinesTypeOptions: [],
      // 查询条件中药品类型的码表
      producterOptions: [],
      // 查询条件中处方类型的码表
      prescriptionTypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1, // 默认第一页
        pageSize: 10, // 每页默认10条
        medicinesName: undefined, // 药品名称
        keywords: undefined, // 关键字
        medicinesType: undefined, // 药品类型
        producterId: undefined, // 药品
        prescriptionType: undefined, // 处方类型
        status: undefined // 状态
      },
      // 表单数据(添加和修改的模态框中的数据)
      form: {},
      // 表单校验(前端校验,失去焦点就会触发)
      // 给对应属性添加必填校验之后,会在label处显示*号
      rules: {
        medicinesName: [
          { required: true, message: '药品名称不能为空', trigger: 'blur' }
        ],
        keywords: [
          { required: true, message: '查询关键字不能为空', trigger: 'blur' }
        ],
        prescriptionPrice: [
          { required: true, message: '处方价格不能为空', trigger: 'blur' }
        ],
        medicinesStockDangerNum: [
          { required: true, message: '预警值不能为空', trigger: 'blur' }
        ],
        medicinesType: [
          { required: true, message: '药品类型不能为空', trigger: 'blur' }
        ],
        prescriptionType: [
          { required: true, message: '处方类型不能为空', trigger: 'blur' }
        ],
        producterId: [
          { required: true, message: '生产厂家不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  // 生命周期,钩子函数  在实例创建完成后被立即调用
  created() {
    // 使用全局的根据字典类型查询字典数据的方法来获取查询条件中的状态信息
    this.getDataByType('sys_normal_disable').then(res => {
      // 将查询到的状态信息保存到当前页面对应的属性中
      this.statusOptions = res.data
    })
    // 药品类型
    this.getDataByType('his_medicines_type').then(res => {
      this.medicinesTypeOptions = res.data
    })
    // 药品  需要调用药品API
    selectAllProducter().then(res => {
      this.producterOptions = res.data
    })
    // 处方类型
    this.getDataByType('his_prescription_type').then(res => {
      this.prescriptionTypeOptions = res.data
    })
    // 最后查询列表
    // 加载页面时,需要进行初始化数据,调用查询数据列表的方法
    this.getMedicinesList()
  },
  methods: {
    // 查询数据列表数据
    getMedicinesList() {
      // 打开遮罩
      this.loading = true
      // 调用分页查询的api方法
      // listForPage(this.queryParams).then(res => {
      // 通过addDateRange封装起始时间和结束时间
      listMedicinesForPage(this.queryParams).then(res => {
        // 将分页数据传递给数据类表绑定的data数据
        this.medicinesTableList = res.data
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
      this.getMedicinesList()
    },
    // 清空查询条件操作
    resetQuery() {
      // 清空查询数据
      this.resetForm('queryForm')
      // 重新查询数据列表,相当于执行一次无查询条件的查询操作,如果不调用这个方法,那么清空操作后,数据列表不会同步改变
      this.getMedicinesList()
    },
    // 添加操作,打开添加模态框
    handleAdd() {
      // 打开模态框
      this.open = true
      // 重置表单
      this.reset()
    },
    // 修改操作,打开修改模态框
    handleUpdate(row) {
      // 如果是点击数据列表上方的修改按钮时，是不会传递row数据的
      // 如果是点击每行记录后面的修改链接时可以拿到row数据
      // 如果row.medicinesId为undefined，那么就表示点击的是修改按钮，因此要ids的第一个数据就是选中的要修改的数据
      // 然后将该medicinesId作为查询条件向后台发送请求即可
      // const medicinesId = row.medicinesId === undefined ? this.ids[0] : row.medicinesId
      // 下面这种方式，如果是点击修改按钮得到的数据，那么medicinesId是一个仅有一个值的数组，传递到后台也可以匹配参数
      // js利用|| 或者 && 简便赋值方式
      const medicinesId = row.medicinesId || this.ids
      // 打开模态框
      this.open = true
      // 重置表单
      this.reset()
      // 根据id查询对应字典类型，并填充到form中
      // 这里通过id查询到的数据是一整条数据，填充到了form中，并不影响
      // getDictTypeById(row.medicinesId).then(res => {
      getMedicinesById(medicinesId).then(res => {
        this.form = res.data
        // 数据要在下拉框回显，需要时int类型，但是后台返回的是String
        this.form.producterId = parseInt(res.data.producterId)
      })
      // 优化点，row已经是一整条数据了，为啥还要走后台查询呢？
      // this.form = row
    },
    handleUpdateStock(row) {
      this.$prompt('请输入调整后的库存量', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        updateMedicinesStock(row.medicinesId, value).then(() => {
          this.msgSuccess('调整库存量成功')
          this.getMedicinesList()
        })
      }).catch(() => {
        this.msgInfo('取消调整操作')
      })
    },
    // 删除操作(含批量)
    handleDelete(row) {
      // 根据row.medicinesId是否为undefined来判断是批量删除还是单个删除
      // const medicinesId = row.medicinesId === undefined ? this.ids : row.medicinesId
      // const medicinesId = row.medicinesId === undefined ? this.ids[0] : row.medicinesId
      // 下面这种方式，如果是点击删除按钮得到的数据，那么medicinesId是一个含有多个值的数组，传递到后台也可以匹配参数
      // js利用|| 或者 && 简便赋值方式
      const medicinesId = row.medicinesId || this.ids
      // 确认框显示
      this.$confirm('此操作将永久删除该药品信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 开启遮罩
        this.loading = true
        // 调用api执行删除操作
        deleteMedicinesByIds(medicinesId).then(res => {
          // 关闭遮罩
          this.loading = false
          // 操作成功提示
          this.msgSuccess('删除成功')
          // 重新查询数据列表
          this.getMedicinesList()
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
      this.ids = selection.map(item => item.medicinesId)
    },
    // 转换字典数据(code值与实际显示值)
    statusFormatter(row) {
      return this.transferDictCode(this.statusOptions, row.status)
    },
    medicinesTypeFormatter(row) {
      return this.transferDictCode(this.medicinesTypeOptions, row.medicinesType)
    },
    producterFormatter(row) {
      let name = ''
      this.producterOptions.filter(item => {
        if (parseInt(item.producterId) === parseInt(row.producterId)) {
          name = item.producterName
        }
      })
      return name
    },
    prescriptionTypeFormatter(row) {
      return this.transferDictCode(this.prescriptionTypeOptions, row.prescriptionType)
    },
    // 改变每页显示条数的时候触发
    handleSizeChange(val) {
      // 更新每页显示条数
      this.queryParams.pageSize = val
      // 重新查询
      this.getMedicinesList()
    },
    // 当前页改变时触发(前一页,点击某一页,下一页,跳转某一页)
    handleCurrentChange(val) {
      // 更新需要显示的第几页数
      this.queryParams.pageNum = val
      // 重新查询
      this.getMedicinesList()
    },
    // 模态框  保存按钮
    /**
     * 因为新增和修改操作都是打开同一个模态框
     * 因此点击保存按钮时，需要区分执行的是新增操作还是修改操作
     *    个人想法：根据this.form.medicinesId来区分
     *              如果this.form.medicinesId不存在那么就是新增，因为medicinesId会在后台生成
     *               否则为修改操作
     */
    handleSubmit() {
      // 打开遮罩
      this.loading = true
      if (this.form.medicinesId === undefined) {
        // 添加操作
        // 表单前端校验，如果不通过就不会执行后端方法
        this.$refs['form'].validate((valid) => {
          if (valid) { // 通过校验
            // 调用保存字典类型的api，调用引入的api不可以使用this.xxx,因为不是当前页面的方法
            addMedicines(this.form).then(res => {
              // 显示保存成功的消息,调用全局消息
              this.msgSuccess('保存成功')
              // 关闭遮罩
              this.loading = false
              // 列表数据重新查询
              this.getMedicinesList()
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
            updateMedicines(this.form).then(res => {
              // 显示修改成功的消息,调用全局消息
              this.msgSuccess('修改成功')
              // 关闭遮罩
              this.loading = false
              // 列表数据重新查询
              this.getMedicinesList()
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
      this.form = {
        medicinesId: undefined,
        medicinesName: undefined,
        medicinesNumber: undefined,
        unit: undefined,
        conversion: undefined,
        prescriptionPrice: 0,
        medicinesStockDangerNum: 0,
        medicinesType: undefined,
        prescriptionType: undefined,
        keywords: undefined,
        medicinesStockNum: 0,
        status: '0'
      }
      // 重置表单,对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.resetForm('form')
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
