<template>
  <div v-loading="loading" class="app-container">
    <!--选择门诊和急诊选项开始-->
    <el-card style="margin-bottom:5px;text-align: center">
      <el-radio-group v-model="schedulingType" @change="changeSchedulingType">
        <!--schedulingTypeOption中保存的值为 1 2，这里的单选框组匹配的值是和label值一样即可
            所以这里设置：label="s.dictValue"  然后默认绑定的v-model是1，这样就可以默认选中了
        -->
        <el-radio-button
          v-for="s in schedulingTypeOptions"
          :key="s.dictValue"
          :label="s.dictValue"
          :value="s.dictValue">
          {{s.dictLabel}}
        </el-radio-button>
      </el-radio-group>
    </el-card>
    <!--选择门诊和急诊选项结束-->
    <!--整个卡片开始
        划分为一行，宽度不同的两列
    -->
    <el-row :gutter="5">
      <el-col :span="8">
        <!--左侧患者信息卡片开始-->
        <el-card>
          <el-form ref="form" :model="patientAllObj.patientObj" :inline="true" label-width="88px">
            <el-form-item label="患者姓名" prop="name">
              <!--不可编辑，自动导入信息-->
              <el-input
                v-model="patientAllObj.patientObj.name"
                placeholder="请输入患者姓名"
                :disabled="true"
                style="width:100%"
                size="small"
              >
                <!--按钮，查看患者信息，并选择信息载入-->
                <!--输入框后置内容，只对 type="text" 有效-->
                <el-button slot="append" icon="el-icon-user-solid" @click="viewRegistration" />
              </el-input>
            </el-form-item>
            <el-form-item label="身份证号" prop="idCard">
              <el-input
                v-model="patientAllObj.patientObj.idCard"
                placeholder="请输入身份证号"
                :disabled="true"
                style="width:100%"
                size="small"
              />
            </el-form-item>
            <el-form-item label="患者电话" prop="phone">
              <el-input
                v-model="patientAllObj.patientObj.phone"
                placeholder="请输入患者电话"
                style="width:100%"
                :disabled="true"
                size="small"
              />
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="patientAllObj.patientObj.sex" :disabled="true">
                <el-radio
                  v-for="d in sexOptions"
                  :key="d.dictValue"
                  :label="d.dictValue"
                  :value="d.dictValue"
                >{{ d.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="出生日期" prop="birthday" :disabled="true">
              <el-input
                v-model="patientAllObj.patientObj.birthday"
                placeholder="请选择出生日期"
                style="width:100%"
                :disabled="true"
                size="small"
              />
            </el-form-item>
            <!--年龄根据出生年月进行自动计算得出-->
            <el-form-item label="患者年龄" prop="age">
              <el-input
                v-model="patientAllObj.patientObj.age"
                placeholder="请输入患者年龄"
                :disabled="true"
                style="width:100%"
                size="small"
              />
            </el-form-item>
            <el-form-item label="患者地址" prop="address">
              <el-input
                v-model="patientAllObj.patientObj.address"
                placeholder="请输入患者地址"
                style="width:100%"
                size="small"
                :disabled="true"
                type="textarea"
                :autosize="{minRows:2,maxRows:4}"
                maxlength="30"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="过敏信息" prop="allergyInfo">
              <!--最大长度为100，最小2行，最大4行
                  show-word-limit 显示当前字数和总限制字数
              -->
              <el-input
                v-model="patientAllObj.patientObj.allergyInfo"
                placeholder="请输入过敏信息"
                type="textarea"
                :autosize="{minRows:2,maxRows:4}"
                maxlength="100"
                :disabled="true"
                show-word-limit
                style="width:100%"
                size="small"
              />
            </el-form-item>
          </el-form>
          <!--患者档案信息和病历信息选项卡开始-->
          <el-tabs type="card" :stretch="true">
            <el-tab-pane label="患者档案">
              <!--isFinal表示是否完善信息：如果没有档案信息则isFinal为0，否则为1-->
              <div v-if="patientAllObj.patientObj.isFinal==='1'">
                <div class="item">
                  紧急联系人:<span v-text="patientAllObj.patientFileObj.emergencyContactName" />
                </div>
                <div class="item">
                  紧急联系人电话:<span v-text="patientAllObj.patientFileObj.emergencyContactPhone" />
                </div>
                <div class="item">
                  关系: <span v-text="patientAllObj.patientFileObj.emergencyContactRelation" />
                </div>
                <div class="item">
                  左耳听力:<span v-text="patientAllObj.patientFileObj.leftEarHearing" />
                </div>
                <div class="item">
                  右耳听力:<span v-text="patientAllObj.patientFileObj.rightEarHearing" />
                </div>
                <div class="item">
                  左眼视力:<span v-text="patientAllObj.patientFileObj.leftVision" />
                </div>
                <div class="item">
                  右眼视力:<span v-text="patientAllObj.patientFileObj.rightVision" />
                </div>
                <div class="item">
                  身高:<span v-text="patientAllObj.patientFileObj.height" />
                </div>
                <div class="item">
                  体重:<span v-text="patientAllObj.patientFileObj.weight" />
                </div>
                <div class="item">
                  血型:<span v-text="patientAllObj.patientFileObj.bloodType" />
                </div>
                <div class="item">
                  个人史:<span v-text="patientAllObj.patientFileObj.personalInfo" />
                </div>
                <div class="item">
                  家族史:<span v-text="patientAllObj.patientFileObj.familyInfo" />
                </div>
                <div class="item">
                  档案创建时间:<span v-text="patientAllObj.patientFileObj.createTime" />
                </div>
                <div class="item">
                  档案更新时间:<span v-text="patientAllObj.patientFileObj.updateTime" />
                </div>
              </div>
              <div v-else style="text-align:center">
                暂无患者档案信息
              </div>
            </el-tab-pane>
            <!--这里的病历信息是根据患者id查询出来的，可以查询出来不止一个-->
            <el-tab-pane label="病历信息">
              <div v-if="patientAllObj.careHistoryObjList.length > 0">
                <!--折叠面板  according  手风琴模式展开  同时只能显示一个-->
                <el-collapse accordion>
                  <el-collapse-item v-for="(item,index) in patientAllObj.careHistoryObjList" :key="index">
                    <!--这里是折叠的标题显示内容   展示就诊部门和就诊时间-->
                    <template slot="title">
                      就诊部门:【{{ item.deptName }}】 就诊时间:{{ item.careTime }}
                    </template>
                    <!--下面是展开后会显示的内容-->
                    <div class="item">
                      主诉:{{ item.caseTitle }}
                    </div>
                    <div class="item">
                      发病日期:{{ item.caseDate }}
                    </div>
                    <div class="item">
                      诊断信息:{{ item.caseResult }}
                    </div>
                    <div class="item">
                      医生建议:{{ item.doctorTips }}
                    </div>
                    <div class="item">
                      备注:{{ item.remark }}
                    </div>
                    <div class="item">
                      接诊类型:{{ item.receiveType==='0'?'初诊':'复诊' }}
                    </div>
                    <div class="item">
                      是否传染:{{ item.isContagious==='0'?'否':'是' }}
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
              <div v-else style="text-align:center">
                暂无患者病历信息
              </div>
            </el-tab-pane>
          </el-tabs>
          <!--患者档案信息和病历信息选项卡结束-->
        </el-card>
        <!--左侧患者信息卡片结束-->
      </el-col>
      <el-col :span="16">
        <!--右侧顶部病历和处方按钮卡片开始-->
        <el-card>
          <el-row :gutter="5">
            <el-col :span="12">
              挂号单号：
              <span v-if="careHistory.registrationId === undefined" style="color: red;">选择患者后显示</span>
              <span v-else style="color: red;">{{careHistory.registrationId}}</span>
              <br/>
              病历编号：
              <span v-if="careHistory.chId === undefined" style="color: red;">保存病历后显示</span>
              <span v-else style="color: blue;">{{careHistory.chId}}</span>
            </el-col>
            <el-col :span="12" style="text-align: right">
              <el-button type="primary" icon="el-icon-check" :disabled="careHistory.registrationId === undefined" @click="handleSaveCareHistory">保存病历</el-button>
              <el-button type="danger" icon="el-icon-finished" :disabled="careHistory.registrationId === undefined" @click="handleVisitComplete">完成就诊</el-button>
            </el-col>
          </el-row>
        </el-card>
        <!--右侧顶部病历和处方按钮卡片结束-->
        <!--病历和处方信息开始-->
        <el-card style="margin-top: 5px;">
          <el-tabs :v-model="careActiveName" type="card">
            <!--这里的病历信息是根据挂号单号查询出来的，一个挂号单号对应一个病历信息-->
            <el-tab-pane label="病历">
              <!-- 病例表单开始 -->
              <el-card>
                <el-form ref="form" :model="careHistory" :inline="true" label-width="88px">
                  <el-form-item label="发病日期" prop="caseDate">
                    <el-date-picker
                      v-model="careHistory.caseDate"
                      value-format="yyyy-MM-dd"
                      size="small"
                    />
                  </el-form-item>
                  <el-form-item label="接诊类型" prop="receiveType">
                    <el-select
                      v-model="careHistory.receiveType"
                      placeholder="接诊类型"
                      size="small"
                    >
                      <el-option
                        v-for="dict in receiveTypeOptions"
                        :key="dict.dictValue"
                        :label="dict.dictLabel"
                        :value="dict.dictValue"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="是否传染" prop="isContagious">
                    <el-select
                      v-model="careHistory.isContagious"
                      placeholder="是否传染"
                      size="small"
                    >
                      <el-option
                        v-for="dict in isContagiousOptions"
                        :key="dict.dictValue"
                        :label="dict.dictLabel"
                        :value="dict.dictValue"
                      />
                    </el-select>
                  </el-form-item>
                </el-form>
                <el-form ref="form" :model="careHistory" label-width="88px">
                  <el-form-item label="主诉" :inline="false" prop="caseTitle">
                    <el-input
                      v-model="careHistory.caseTitle"
                      type="textarea"
                      :autosize="{ minRows: 4, maxRows: 6}"
                      placeholder="请输入主诉"
                      style="width:100%"
                      maxlength="100"
                      show-word-limit
                      size="small"
                    />
                  </el-form-item>
                  <el-form-item label="诊断信息" :inline="false" prop="caseResult">
                    <el-input
                      v-model="careHistory.caseResult"
                      type="textarea"
                      :autosize="{ minRows: 4, maxRows: 6}"
                      placeholder="请输入诊断信息"
                      style="width:100%"
                      maxlength="200"
                      show-word-limit
                      size="small"
                    />
                  </el-form-item>
                  <el-form-item label="医生建议" :inline="false" prop="doctorTips">
                    <el-input
                      v-model="careHistory.doctorTips"
                      type="textarea"
                      :autosize="{ minRows: 4, maxRows: 6}"
                      placeholder="请输入医生建议"
                      style="width:100%"
                      maxlength="300"
                      show-word-limit
                      size="small"
                    />
                  </el-form-item>
                  <el-form-item label="备注" :inline="false" prop="remark">
                    <el-input
                      v-model="careHistory.remark"
                      type="textarea"
                      :autosize="{ minRows: 4, maxRows: 6}"
                      placeholder="请输入备注"
                      style="width:100%"
                      maxlength="200"
                      show-word-limit
                      size="small"
                    />
                  </el-form-item>
                </el-form>
              </el-card>
              <!-- 病例表单结束 -->
            </el-tab-pane>
            <el-tab-pane label="处方">
              <div style="margin:3px;text-align:left">
                <!--保存病历---》存在病历id后才可以点击-->
                <el-button type="success" icon="el-icon-plus" :disabled="careHistory.chId===undefined" @click="handelAddMedicinesOrder">添加药用处方</el-button>
                <el-button type="success" icon="el-icon-plus" :disabled="careHistory.chId===undefined" @click="handelAddCheckItemOrder">添加检查处方</el-button>
              </div>
              <!-- 处方详情开始 -->
              <el-collapse v-if="careOrders.length>0" accordion>
                <el-collapse-item v-for="(item,index) in careOrders" :key="index">
                  <!--设置折叠面板的标题-->
                  <template slot="title">
                    【{{ item.careOrder.coType==='0'?'药用处方':'检查处方' }}】【{{ index+1 }}】【处方总额】:￥{{ item.careOrder.allAmount }}
                  </template>
                  <el-table
                    v-loading="loading"
                    border
                    :data="item.careOrderItems"
                  >
                    <el-table-column label="序号" align="center" type="index" width="50" />
                    <el-table-column :label="item.careOrder.coType==='0'?'药品名称':'项目名称'" align="center" prop="itemName" />
                    <el-table-column label="数量" align="center" prop="num" />
                    <el-table-column label="单价(元)" align="center" prop="price" />
                    <el-table-column label="金额(元)" align="center" prop="amount" />
                    <el-table-column label="备注" align="center" prop="remark" />
                    <el-table-column label="状态" align="center" prop="status" :formatter="orderDetailsStatusFormatter" />
                    <el-table-column label="操作" align="center">
                      <template slot-scope="scope">
                        <!--未支付才可以删除-->
                        <el-button v-show="scope.row.status==='0'" type="text" icon="el-icon-delete" size="mini" @click="handleCareOrderItemDeleteByItemId(scope.row)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-collapse-item>
              </el-collapse>
              <!-- 处方详情结束 -->
            </el-tab-pane>
          </el-tabs>
        </el-card>
        <!--病历和处方信息结束-->
      </el-col>
    </el-row>
    <!--整个卡片结束-->
    <!--选择患者信息的模态框开始-->
    <el-dialog
      title="请选择挂号患者"
      :visible.sync="openRegistration"
      width="1000px"
      center
      :close-on-click-modal="false"
      append-to-body
    >
      <el-tabs v-model="activeName" :stretch="true" type="card" @tab-click="handleRegistrationTabClick">
        <el-tab-pane label="待就诊列表" name="t1">
          <el-table v-loading="tableLoading" border :data="toBeSeenRegistration">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="right" inline class="demo-table-expand">
                  <el-form-item label="挂号ID">
                    <span>{{ scope.row.registrationId }}</span>
                  </el-form-item>
                  <el-form-item label="患者ID">
                    <span>{{ scope.row.patientId }}</span>
                  </el-form-item>
                  <el-form-item label="挂号员">
                    <span>{{ scope.row.createBy }}</span>
                  </el-form-item>
                  <el-form-item label="挂号时间">
                    <span>{{ scope.row.createTime }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="患者姓名" align="center" prop="patientName" />
            <el-table-column label="流水编号" align="center" prop="registrationNumber" />
            <el-table-column label="挂号类型" align="center" prop="schedulingType" :formatter="schedulingTypeFormatter"/>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="success" icon="el-icon-check" size="mini" @click="handleVisit(scope.row)">接诊</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="就诊中列表" name="t2">
          <el-table v-loading="tableLoading" border :data="visitingRegistration">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="right" inline class="demo-table-expand">
                  <el-form-item label="挂号ID">
                    <span>{{ scope.row.registrationId }}</span>
                  </el-form-item>
                  <el-form-item label="患者ID">
                    <span>{{ scope.row.patientId }}</span>
                  </el-form-item>
                  <el-form-item label="挂号员">
                    <span>{{ scope.row.createBy }}</span>
                  </el-form-item>
                  <el-form-item label="挂号时间">
                    <span>{{ scope.row.createTime }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="患者姓名" align="center" prop="patientName" />
            <el-table-column label="流水编号" align="center" prop="registrationNumber" />
            <el-table-column label="挂号类型" align="center" prop="schedulingType" :formatter="schedulingTypeFormatter" />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="success" icon="el-icon-check" size="mini" @click="handleLoading(scope.row)">载入</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="就诊完成列表" name="t3">
          <el-table v-loading="tableLoading" border :data="visitCompletedRegistration">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="right" inline class="demo-table-expand">
                  <el-form-item label="挂号ID">
                    <span>{{ scope.row.registrationId }}</span>
                  </el-form-item>
                  <el-form-item label="患者ID">
                    <span>{{ scope.row.patientId }}</span>
                  </el-form-item>
                  <el-form-item label="挂号员">
                    <span>{{ scope.row.createBy }}</span>
                  </el-form-item>
                  <el-form-item label="挂号时间">
                    <span>{{ scope.row.createTime }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="患者姓名" align="center" prop="patientName" />
            <el-table-column label="流水编号" align="center" prop="registrationNumber" />
            <el-table-column label="挂号类型" align="center" prop="schedulingType" :formatter="schedulingTypeFormatter" />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="success" icon="el-icon-check" size="mini" @click="handleLoading(scope.row)">载入</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!--选择患者信息的模态框结束-->
    <!--添加药用处方和检查处方弹出层开始-->
    <el-dialog
      :title="title"
      :visible.sync="openAddOrderItem"
      width="1000px"
      center
      :close-on-click-modal="false"
      append-to-body
    >
      <div style="margin:3px;text-align:right">
        【{{ submitCareOrder.careOrder.coType==='0'?'药用':'检查' }}】处方总额:￥<span style="color:red">{{ submitCareOrder.careOrder.allAmount }}</span>
        <el-button style="margin-left:15px" type="success" icon="el-icon-plus" :disabled="submitCareOrder.careOrderItems.length===0" @click="handleSaveOrderItem">确定添加</el-button>
      </div>
      <el-table
        border
        :data="submitCareOrder.careOrderItems"
        :row-class-name="tableRowClassName"
      >
        <el-table-column label="序号" align="center" type="index" width="50" />
        <el-table-column :label="submitCareOrder.careOrder.coType==='0'?'药品名称':'项目名称'" align="center" prop="itemName" />
        <el-table-column label="数量" width="180px" align="center" prop="num">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.num"
              size="small"
              :min="1"
              @change="handleCareOrderItemNumChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="单价(元)" align="center" prop="price" />
        <el-table-column label="金额(元)" align="center" prop="amount" />
        <el-table-column label="备注" align="center" prop="remark">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.remark"
              size="small"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-delete" size="mini" @click="handleCareOrderItemDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" size="mini" style="width:100%;margin-top:2px" @click="handleOpenAddOrderItemDrawer">添加【{{ submitCareOrder.careOrder.coType==='0'?'药品':'检查' }}】项 </el-button>
    </el-dialog>
    <!--添加药用处方和检查处方弹出层结束-->
    <!-- 药品列表的抽屉开始 -->
    <!--direction：抽屉的打开方向 rtl   right to left 从右向左-->
    <el-drawer
      :visible.sync="openDrawerMedicines"
      direction="rtl"
      append-to-body
    >
      <h2 align="center">药品列表</h2>
      <el-form ref="queryItemForm" :model="queryItemFormParams" label-width="68px">
        <el-form-item label="关键字" prop="keywords">
          <el-input
            v-model="queryItemFormParams.keywords"
            placeholder="请输入关键字"
            clearable
            size="small"
            style="width:180px"
          />
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleMedicinesFormQuery">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetItemFormQuery">重置</el-button>
        </el-form-item>

        <el-table
          v-loading="drawerLoading"
          height="600px"
          border
          :data="tableItemList"
          @selection-change="handleMedicinesSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="药品ID" align="center" prop="medicinesId" />
          <el-table-column label="药品名称" align="center" prop="medicinesName" />
          <el-table-column label="关键字" align="center" prop="keywords" />
          <el-table-column label="库存量" align="center" prop="medicinesStockNum" />
          <el-table-column label="单位" align="center">
            <template slot-scope="scope">
              {{ scope.row.conversion }}/ {{ scope.row.unit }}
            </template>
          </el-table-column>
        </el-table>
        <!-- 数据表格结束 -->
        <!-- 分页控件开始 -->
        <el-pagination
          v-show="total>0"
          :current-page="queryItemFormParams.pageNum"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="queryItemFormParams.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="total"
          @size-change="handleMedicinesSizeChange"
          @current-change="handleMedicinesCurrentChange"
        />
        <el-form-item>
          <div style="text-align:center">
            <el-button type="primary" icon="el-icon-check" size="mini" @click="hanldeAddCareItem">添加并关闭</el-button>
          </div>
        </el-form-item>
      </el-form>
      <!-- 分页控件结束 -->
    </el-drawer>
    <!-- 药品列表的抽屉结束 -->
    <!-- 检查项目的抽屉开始 -->
    <el-drawer
      :visible.sync="openDrawerCheckItem"
      direction="rtl"
      append-to-body
    >
      <h2 align="center">检查项目列表</h2>
      <el-form ref="queryItemForm" :model="queryItemFormParams" label-width="68px">
        <el-form-item label="关键字" prop="keywords">
          <el-input
            v-model="queryItemFormParams.keywords"
            placeholder="请输入关键字"
            clearable
            size="small"
            style="width:180px"
          />
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleCheckItemFormQuery">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetItemFormQuery">重置</el-button>
        </el-form-item>

        <el-table
          v-loading="drawerLoading"
          height="600px"
          border
          :data="tableItemList"
          @selection-change="handleCheckItemSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="项目ID" align="center" prop="checkItemId" />
          <el-table-column label="项目名称" align="center" prop="checkItemName" />
          <el-table-column label="关键字" align="center" prop="keywords" />
          <el-table-column label="项目单价" align="center" prop="unitPrice" />
          <el-table-column label="单位" align="center" prop="unit" />
        </el-table>
        <!-- 数据表格结束 -->
        <!-- 分页控件开始 -->
        <el-pagination
          v-show="total>0"
          :current-page="queryItemFormParams.pageNum"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="queryItemFormParams.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="total"
          @size-change="handleCheckItemSizeChange"
          @current-change="handleCheckItemCurrentChange"
        />
        <!--分页控件结束-->
        <el-form-item>
          <div style="text-align:center">
            <el-button type="primary" icon="el-icon-check" size="mini" @click="hanldeAddCareItem">添加并关闭</el-button>
          </div>
        </el-form-item>
      </el-form>

    </el-drawer>
    <!-- 检查项目的抽屉结束 -->
  </div>
</template>

<script>
import { queryToBeSeenRegistration, queryVisitingRegistration, queryVisitCompleteRegistration,
  receivePatient, getPatientAllMessageByPatientId, saveCareHistory,
  getCareHistoryByRegistrationId, queryOrdersByChId, getCareHistoryListByPatientId } from '@/api/doctor/care/care'
import { listCheckItemForPage } from '@/api/system/checkItem/checkItem'
import { listMedicinesForPage } from '@/api/erp/medicines/medicines'
export default {
  name: 'Index',
  data() {
    return {
      // 遮罩层
      loading: false,
      // 页面选项卡  门诊和急诊的默认值
      schedulingType: '1',
      // 就诊类型的字典数据 门诊|急诊
      schedulingTypeOptions: [],
      // 就诊时段的字典数据  上午、下午、晚上
      subsectionTypeOptions: [],
      // 性别的字典数据
      sexOptions: [],
      // 接诊类型字典数据
      receiveTypeOptions: [],
      // 是否传染字典数据
      isContagiousOptions: [],
      // 处方详情的状态字典数据
      orderDetailsStatusOptions: [],
      // 患者全部信息
      patientAllObj: {
        patientObj: {
          name: undefined, // 患者姓名
          idCard: undefined, // 身份证号
          phone: undefined, // 患者电话
          sex: undefined, // 性别
          birthday: undefined, // 出生日期
          age: undefined, // 年龄
          address: undefined, // 患者地址
          allergyInfo: undefined // 过敏信息
        }, // 患者信息
        patientFileObj: {}, // 患者档案信息
        careHistoryObjList: [] // 患者病历信息
      },
      // 选择患者信息的模态框遮罩层
      openRegistration: false,
      // 选中的就诊状态的选项卡
      activeName: 't1',
      // 病历|处方选项卡
      careActiveName: 'c1',
      // 就诊列表的遮罩层
      tableLoading: false,
      // 待就诊列表数据
      toBeSeenRegistration: [],
      // 就诊中列表数据
      visitingRegistration: [],
      // 就诊完成列表数据
      visitCompletedRegistration: [],
      // 病历信息，最终保存到病历信息表中数据
      careHistory: {
        // 当前就诊中的挂号单ID
        registrationId: undefined,
        chId: undefined,
        caseDate: this.moment(new Date()).format('YYYY-MM-DD'), // 默认值当前时间
        receiveType: '0',
        isContagious: '0',
        caseTitle: undefined,
        caseResult: undefined,
        doctorTips: undefined,
        remark: undefined,
        patientId: undefined,
        patientName: undefined
      },
      // 处方和处方项目详细信息
      careOrders: [],
      // 药用处方和检查处方模态框开启
      openAddOrderItem: false,
      // 提交的处方及处方详情信息
      submitCareOrder: {
        careOrder: {
          allAmount: 0.00,
          patientId: undefined,
          patientName: undefined,
          coType: '0' // 默认为药用处方
        },
        careOrderItems: []
      },
      // 药品和检查处方模态框的标题
      title: '',
      // 药品和检查项目抽屉的遮罩
      drawerLoading: false,
      // 药品或检查项目表格的数据
      tableItemList: [],
      // 抽屉里面选中的数据
      selectItemList: [],
      // 抽屉里面数据的总条数
      total: 0,
      // 是否打开药品列表的抽屉
      openDrawerMedicines: false,
      // 是否打开检查项目列表的抽屉
      openDrawerCheckItem: false,
      // 药品和检查项目抽屉的查询条件
      queryItemFormParams: {
        pageNum: 1,
        pageSize: 10,
        keywords: undefined
      }
    }
  },
  created() {
    // 获取就诊类型字典数据
    this.getDataByType('his_scheduling_type').then(res => {
      this.schedulingTypeOptions = res.data
    })
    // 获取就诊时段字典数据
    this.getDataByType('his_subsection_type').then(res => {
      this.subsectionTypeOptions = res.data
    })
    // 性别的字典数据
    this.getDataByType('sys_user_sex').then(res => {
      this.sexOptions = res.data
    })
    // 接诊类型的字典数据
    this.getDataByType('his_receive_type').then(res => {
      this.receiveTypeOptions = res.data
    })
    // 是否传染的字典数据
    this.getDataByType('his_contagious_status').then(res => {
      this.isContagiousOptions = res.data
    })
    //  加载处方详情的状态字典数据
    this.getDataByType('his_order_details_status').then(res => {
      this.orderDetailsStatusOptions = res.data
    })
  },
  methods: {
    // 切换门诊和急诊的方法
    changeSchedulingType(value) {
      this.schedulingType = value
    },
    // 载入患者信息按钮--打开就诊患者弹出层
    viewRegistration() {
      this.activeName = 't1'
      this.openRegistration = true
      // 默认查询待就诊数据
      this.toBeSeenRegistrationData()
    },
    // 查询待就诊数据
    toBeSeenRegistrationData() {
      this.tableLoading = true
      queryToBeSeenRegistration(this.schedulingType).then(res => {
        this.toBeSeenRegistration = res.data
        this.tableLoading = false
      }).catch(() => {
        this.msgError('查询失败')
        this.tableLoading = false
      })
    },
    // 查询就诊中数据
    visitingRegistrationData() {
      this.tableLoading = true
      queryVisitingRegistration(this.schedulingType).then(res => {
        this.visitingRegistration = res.data
        this.tableLoading = false
      }).catch(() => {
        this.msgError('查询失败')
        this.tableLoading = false
      })
    },
    // 查询就诊完成数据
    visitCompletedRegistrationData() {
      this.tableLoading = true
      queryVisitCompleteRegistration(this.schedulingType).then(res => {
        this.visitCompletedRegistration = res.data
        this.tableLoading = false
      }).catch(() => {
        this.msgError('查询失败')
        this.tableLoading = false
      })
    },
    // 切换就诊状态选项卡
    handleRegistrationTabClick(value, event) {
      if (value.name === 't1') {
        this.toBeSeenRegistrationData()
      } else if (value.name === 't2') {
        this.visitingRegistrationData()
      } else {
        this.visitCompletedRegistrationData()
      }
    },
    // 翻译挂号类型
    schedulingTypeFormatter(row) {
      return this.transferDictCode(this.schedulingTypeOptions, row.schedulingType)
    },
    // 翻译处方详情状态
    orderDetailsStatusFormatter(row) {
      return this.transferDictCode(this.orderDetailsStatusOptions, row.status)
    },
    // 接诊方法
    handleVisit(row) {
      this.careHistory.registrationId = row.registrationId
      const patientId = row.patientId
      // 接诊，更新挂号的状态为就诊中并写入接诊的医生信息
      this.loading = true
      receivePatient(this.careHistory.registrationId).then(res => {
        this.msgSuccess('接诊成功')
        // 根据患者ID查询患者信息档案信息 病历信息
        getPatientAllMessageByPatientId(patientId).then(res => {
          this.patientAllObj.patientObj = res.data.patient
          this.patientAllObj.patientObj.age = this.getAge(res.data.patient.birthday)
          this.patientAllObj.patientFileObj = res.data.patientFile
          this.patientAllObj.careHistoryObjList = res.data.careHistoryList
          this.openRegistration = false
          this.loading = false
        }).catch(() => {
          this.msgError('查询患者信息失败')
          this.loading = false
        })
      }).catch(() => {
        this.msgError('接诊失败')
        this.loading = false
      })
    },
    // 载入数据
    handleLoading(row) {
      this.careHistory.registrationId = row.registrationId
      const patientId = row.patientId
      this.loading = true
      // 根据患者ID查询患者信息档案信息 病历信息
      getPatientAllMessageByPatientId(patientId).then(res => {
        this.msgSuccess('载入成功')
        this.patientAllObj.patientObj = res.data.patient
        this.patientAllObj.patientObj.age = this.getAge(res.data.patient.birthday)
        this.patientAllObj.patientFileObj = res.data.patientFile
        this.patientAllObj.careHistoryObjList = res.data.careHistoryList
        this.openRegistration = false
        this.loading = false
        // 查询当前挂号单之前对应的病例信息
      }).catch(() => {
        this.msgError('载入失败')
        this.loading = false
      })
      // 还需要根据挂号单ID查询上次的病历信息
      this.getCareHistoryDataByRegistrationId(row.registrationId)
    },
    // 根据挂号单id查询病历信息
    getCareHistoryDataByRegistrationId(registrationId) {
      this.loading = true
      getCareHistoryByRegistrationId(registrationId).then(res => {
        if (res.data != null) {
          this.careHistory = res.data
          // 如果有数据，根据病历ID查询处方和处方项目详细信息
          this.getCareOrdersByChId(res.data.chId)
        } else {
          // 重置数据，比如一开始查了一个有病历和处方的患者数据，然后重新查询一个没有病历和处方的患者信息
          // 不进行重置信息的话，上一个患者的数据还会依旧显示
          this.resetCareHistoryAndCareOrders(registrationId)
        }
        this.loading = false
      }).catch(() => {
        this.msgError('查询病历失败')
        this.loading = false
      })
    },
    // 根据病历ID查询处方信息
    getCareOrdersByChId(chId) {
      this.loading = true
      queryOrdersByChId(chId).then(res => {
        this.careOrders = res.data
        this.loading = false
      }).catch(() => {
        this.msgError('查询处方详情失败')
        this.loading = false
      })
    },
    // 重置右边的病历和处方详情数据
    resetCareHistoryAndCareOrders(registrationId) {
      this.careHistory = {
        // 当前就诊中的挂号单ID
        registrationId: registrationId,
        chId: undefined,
        caseDate: this.moment(new Date()).format('YYYY-MM-DD'), // 默认值当前时间
        receiveType: '0',
        isContagious: '0',
        caseTitle: undefined,
        caseResult: undefined,
        doctorTips: undefined,
        remark: undefined,
        patientId: undefined,
        patientName: undefined
      }
      this.careOrders = []
    },
    // 保存病历
    handleSaveCareHistory() {
      if (!this.careHistory.registrationId) {
        this.msgError('请选择挂号患者')
        return
      }
      // 封装数据
      this.careHistory.patientId = this.patientAllObj.patientObj.patientId
      this.careHistory.patientName = this.patientAllObj.patientObj.name
      this.loading = true
      saveCareHistory(this.careHistory).then(res => {
        this.msgSuccess('保存病历成功')
        this.loading = false
        this.careHistory.chId = res.data.chId
        // 重新查询一下患者全部信息
        // 改成根据患者id只查询对应患者的全部病历信息，然后更新careHistroyObjList即可
        getCareHistoryListByPatientId(this.careHistory.patientId).then(res => {
          this.patientAllObj.careHistoryObjList = res.data
        }).catch(() => {
          this.msgError('查询患者历史病历信息出错')
        })
      }).catch(() => {
        this.msgError('保存病历失败')
        this.loading = false
      })
    },
    // 添加药用处方
    handelAddMedicinesOrder() {
      // 设置处方类型为药用处方
      this.submitCareOrder.careOrder.coType = '0'
      // 设置模态框标题
      this.title = '添加【药用】处方'
      // 打开模态框
      this.openAddOrderItem = true
      // 清空处方项目
      this.submitCareOrder.careOrderItems = []
      // 重置处方总额
      this.submitCareOrder.careOrder.allAmount = 0.00
    },
    // 添加检查处方
    handelAddCheckItemOrder() {
      // 设置处方类型为检查处方
      this.submitCareOrder.careOrder.coType = '1'
      this.title = '添加【检查】处方'
      this.openAddOrderItem = true
      this.submitCareOrder.careOrderItems = []
      // 重置处方总额
      this.submitCareOrder.careOrder.allAmount = 0.00
    },
    // 处方项目删除
    handleCareOrderItemDeleteByItemId(row) {
    },
    // 药药用处方和检查处方的模态框中的保存添加的药用或者检查处方信息
    handleSaveOrderItem() {
      if (this.submitCareOrder.careOrderItems.length === 0) {
        this.msgError('添加处方详情')
        return
      }
      this.submitCareOrder.careOrder.patientId = this.careHistory.patientId
      this.submitCareOrder.careOrder.patientName = this.careHistory.patientName
      this.submitCareOrder.careOrder.chId = this.careHistory.chId
      console.log(this.submitCareOrder)
    },
    // 药用处方和检查处方的模态框中删除已选择的处方项目
    handleCareOrderItemDelete(row) {
      this.submitCareOrder.careOrderItems.splice(row.index, 1)
      this.computeOrderItemAllAmount()
    },
    // 打开选择药品或者选择检查项目的抽屉
    handleOpenAddOrderItemDrawer() {
      if (this.submitCareOrder.careOrder.coType === '0') {
        // 打开药口列表抽屉
        this.openDrawerMedicines = true
        // 重置选择药品或者检查项目的查询条件
        this.resetItemFormQuery()
        // 调用获取药品信息的列表方法
        this.getMedicinesList()
      } else {
        // 打开检查项目的抽屉
        this.openDrawerCheckItem = true
        this.resetItemFormQuery()
        // 调用获取检查项目的列表方法
        this.getCheckItemList()
      }
    },
    // 加载药品数据
    getMedicinesList() {
      this.tableItemList = []
      this.drawerLoading = true
      listMedicinesForPage(this.queryItemFormParams).then(res => {
        this.tableItemList = res.data
        this.total = res.total
        this.drawerLoading = false
      }).catch(() => {
        this.drawerLoading = false
        this.msgError('查询药品失败')
      })
    },
    // 加载检查项目数据
    getCheckItemList() {
      this.tableItemList = []
      this.drawerLoading = true
      listCheckItemForPage(this.queryItemFormParams).then(res => {
        this.tableItemList = res.data
        this.total = res.total
        this.drawerLoading = false
      }).catch(() => {
        this.drawerLoading = false
        this.msgError('查询检查项目失败')
      })
    },
    // 重置抽屉的查询条件
    resetItemFormQuery() {
      this.queryItemFormParams = {
        pageNum: 1,
        pageSize: 10,
        keywords: undefined
      }
      // 因为药品列表和检查列表是同一个重置方法，需要判断然后决定调用哪个查询数据的api
      if (this.submitCareOrder.careOrder.coType === '0') {
        this.getMedicinesList()
      } else {
        this.getCheckItemList()
      }
    },
    // 监听药品或检查项目弹出层的数量的变化
    handleCareOrderItemNumChange(row) {
      row.amount = row.num * row.price
      this.computeOrderItemAllAmount()
    },
    // 计算当前处方详情的总价
    computeOrderItemAllAmount() {
      this.submitCareOrder.careOrder.allAmount = 0.00
      this.submitCareOrder.careOrderItems.filter(item => {
        this.submitCareOrder.careOrder.allAmount +=
          (item.num * item.price)
      })
    },
    // 抽屉检查项目数据表格的多选择框选择时触发
    handleCheckItemSelectionChange(selection) {
      this.selectItemList = selection
    },
    // 抽屉检查项目分页pageSize变化时触发
    handleCheckItemSizeChange(val) {
      this.queryItemFormParams.pageSize = val
      // 重新查询
      this.getCheckItemList()
    },
    // 抽屉检查项目点击上一页  下一页，跳转到哪一页面时触发
    handleCheckItemCurrentChange(val) {
      this.queryItemFormParams.pageNum = val
      // 重新查询
      this.getCheckItemList()
    },
    // 搜索检查项目的方法
    handleCheckItemFormQuery() {
      this.queryItemFormParams.pageNum = 1
      this.getCheckItemList()
    },
    // 抽屉药品数据表格的多选择框选择时触发
    handleMedicinesSelectionChange(selection) {
      this.selectItemList = selection
    },
    // 抽屉药品分页pageSize变化时触发
    handleMedicinesSizeChange(val) {
      this.queryItemFormParams.pageSize = val
      // 重新查询
      this.getMedicinesList()
    },
    // 抽屉药品点击上一页  下一页，跳转到哪一页面时触发
    handleMedicinesCurrentChange(val) {
      this.queryItemFormParams.pageNum = val
      // 重新查询
      this.getMedicinesList()
    },
    // 搜索药品的方法
    handleMedicinesFormQuery() {
      this.queryItemFormParams.pageNum = 1
      this.getMedicinesList()
    },
    // 点击药品或检查项目抽屉页面的添加并关闭按钮
    hanldeAddCareItem() {
      const coType = this.submitCareOrder.careOrder.coType
      if (this.selectItemList.length === 0) {
        this.msgError('请选择【' + (coType === '0' ? '药品' : '检查项目') + '】')
        return
      }
      if (coType === '0') { // 药品
        this.selectItemList.filter(item => {
          const obj = {
            itemRefId: item.medicinesId,
            itemName: item.medicinesName,
            itemType: coType,
            num: 1,
            price: item.prescriptionPrice,
            amount: 1 * item.prescriptionPrice,
            remark: '请按说明服用'
          }
          let flag = false// 默认里面没有加
          this.submitCareOrder.careOrderItems.filter(i => {
            if (i.itemRefId === obj.itemRefId) {
              i.num = i.num + 1
              flag = true// 说明之前加过
            }
          })
          if (!flag) {
            this.submitCareOrder.careOrderItems.push(obj)
          }
          this.openDrawerMedicines = false
        })
      } else { // 检查项目
        this.selectItemList.filter(item => {
          const obj = {
            itemRefId: item.checkItemId,
            itemName: item.checkItemName,
            itemType: coType,
            num: 1,
            price: item.unitPrice,
            amount: 1 * item.unitPrice,
            remark: '按要求检查'
          }
          let flag = false// 默认里面没有加
          this.submitCareOrder.careOrderItems.filter(i => {
            if (i.itemRefId === obj.itemRefId) {
              i.num = i.num + 1
              flag = true// 说明之前加过
            }
          })
          if (!flag) {
            this.submitCareOrder.careOrderItems.push(obj)
          }
          this.openDrawerCheckItem = false
        })
        // 计算总价
      }
      this.computeOrderItemAllAmount()
    },
    // 把弹出层的表格的数据加上index
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
    },
    // 完成就诊
    handleVisitComplete() {
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
  .item{
    font-size: 14px;
    margin-bottom: 8px;
  }
</style>
