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
    <!--操作栏按钮结束-->
    <!--数据列表开始-->
    <!--数据列表结束-->
    <!--分页控件开始-->
    <!--分页控件结束-->
    <!--新增和修改模态框开始-->
    <!--新增和修改模态框结束-->
  </div>
</template>

<script>
import { listForPage, addDictData, updateDictData, deleteDictDataByIds, getDictDataById } from '@/api/system/dict/data'
import { getDictTypeById, selectAllDictType } from '@/api/system/dict/type'
export default {
  name: 'Data',
  data() {
    return {
      // 遮罩层
      loading: false,
      // 数据列表首列，勾选的id集合
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
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
      // 对查询参数中对应字典类型进行绑定即可，created方法中，不用单独设置变量了
      // defaultDictType: undefined,
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
    this.getDictDataList()
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
      // 保存查询到的状态信息
      // this.defaultDictType = res.data.dictType
      // 下拉框中默认选中
      this.queryParams.dictType = res.data.dictType
    })
    // 查询所有的字典类型，填充在查询条件中的字典类型下拉框内
    selectAllDictType().then(res => {
      // 保存所有字典类型数据
      this.dictTypeOptions = res.data
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
      // 重新查询数据列表,相当于执行一次无查询条件的查询操作,如果不调用这个方法,那么清空操作后,数据列表不会同步改变
      this.getDictDataList()
    }
  }
}
</script>

<style scoped>

</style>
