<template>
  <!-- 头部区域 -->
  <div>
    <el-row class="workflow">
      <!-- 头部1 -->
      <el-col :span="24">
        <div>
          <!-- 包一层卡片 -->
          <!-- shadow 属性设置卡片阴影出现的时机 -->
          <el-card
            class="workflow-head-card"
            shadow="never"
            :body-style="{ padding: '10px' }"
          >
            <!--不要单独使用el-col，会有bug，在外层加一层el-row比较保险  -->
            <el-row>
              <!-- 命名空间的下拉框 -->
              <el-col :span="6">
                <div>
                  <span>命名空间：</span>
                  <!-- 下拉框 -->
                  <!-- filterable：带搜索功能 -->
                  <!-- placeholder 默认提示 -->
                  <!-- label 显示内容 -->
                  <!-- value 绑定到v-model的值中 -->
                  <el-select
                    v-model="namespaceValue"
                    filterable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(n, i) in namespaceList"
                      :key="i"
                      :label="n.metadata.name"
                      :value="n.metadata.name"
                    >
                    </el-option>
                  </el-select>
                </div>
              </el-col>
              <!-- 刷新按钮 -->
              <!-- :offset 指定该列在水平方向上的偏移量，即在左侧空出多少个网格单位的宽度。 -->
              <el-col :span="2" :offset="16">
                <div>
                  <!-- plain：指定为朴素按钮 -->
                  <el-button
                    style="border-radius: 2px"
                    icon="Refresh"
                    plain
                    @click="resetNamespace()"
                    >刷新</el-button
                  >
                </div>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-col>
      <!-- 头部2 -->

      <!-- 头部3 -->
      <el-col :span="24">
        <div>
          <el-card
            shadow="never"
            body-style="{padding:'10px'}"
            class="workflow-body-card"
          >
            <el-row :gutter="15">
              <!-- 创建按钮 -->
              <el-col :span="1.5" style="margin-left: -10px">
                <div>
                  <!-- v-loading.fullscreen.lock： 指定全屏加载 -->
                  <el-button
                    icon="Edit"
                    type="primary"
                    style="border-radius: 4px"
                    @click="drawer1 = true"
                    >创建工作流</el-button
                  >
                </div>
              </el-col>
              <!-- 输入框和搜索框 -->
              <el-col :span="10">
                <div>
                  <el-input
                    v-model="input"
                    placeholder="请输入"
                    style="padding-right: 20px; width: 230px"
                  ></el-input>
                  <el-button
                    plain
                    icon="search"
                    type="primary"
                    @click="getWorkflows()"
                    >搜索</el-button
                  >
                </div>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-col>
      <!-- 数据表格 -->
      <el-col :span="24">
        <div>
          <el-card
            shadow="never"
            body-style="{padding:'10px'}"
            class="workflow-body-card"
          >
            <el-table
              :data="workflowList"
              style="width: 100%; fint-size: 12px"
              v-loading="appLoading"
            >
              <!-- align="left"  往左排列 -->
              <el-table-column label="ID" align="left">
                <!-- v-slot 定义一个插槽，用来接父组件的data值 -->
                <template v-slot="scope">
                  <!-- scope.row  表示当前循环项的 metadata 对象中的 name 属性，也就是一行的数据-->
                  <span>{{ scope.row.id }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Workflow" align="left">
                <!-- v-slot 定义一个插槽，用来接父组件的data值 -->
                <template v-slot="scope">
                  <!-- scope.row  表示当前循环项的 metadata 对象中的 name 属性，也就是一行的数据-->
                  <span
                    style="color: rgb(62, 165, 233)"
                    class="workflow-body-workflowname"
                    >{{ scope.row.name }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column label="类型" align="center">
                <!-- v-slot 定义一个插槽，用来接父组件的data值 -->
                <template v-slot="scope">
                  <!-- scope.row  表示当前循环项的 metadata 对象中的 name 属性，也就是一行的数据-->
                  <el-tag type="warning">{{ scope.row.type }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="实例数" align="center">
                <!-- v-slot 定义一个插槽，用来接父组件的data值 -->
                <template v-slot="scope">
                  <!-- scope.row  表示当前循环项的 metadata 对象中的 name 属性，也就是一行的数据-->
                  <span>{{ scope.row.replicas }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Deployment" align="left">
                <!-- v-slot 定义一个插槽，用来接父组件的data值 -->
                <template v-slot="scope">
                  <!-- scope.row  表示当前循环项的 metadata 对象中的 name 属性，也就是一行的数据-->
                  <span>{{ scope.row.deployment }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Service" align="left">
                <!-- v-slot 定义一个插槽，用来接父组件的data值 -->
                <template v-slot="scope">
                  <!-- scope.row  表示当前循环项的 metadata 对象中的 name 属性，也就是一行的数据-->
                  <span>{{ scope.row.service }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Ingress" align="left ">
                <!-- v-slot 定义一个插槽，用来接父组件的data值 -->
                <template v-slot="scope">
                  <!-- scope.row  表示当前循环项的 metadata 对象中的 name 属性，也就是一行的数据-->
                  <span
                    style="color: rgb(62, 165, 233)"
                    class="workflow-body-workflowname"
                    >{{ scope.row.ingress }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column label="创建时间" align="center">
                <template v-slot="scope">
                  <span class="time">{{
                    timeTrans(scope.row.created_at)
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="390">
                <template v-slot="scope">
                  <div>
                    <el-button
                      type="danger"
                      icon="Delete"
                      @click="handleConfirm(scope.row.id)"
                      >删除</el-button
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
        <div>
          <!-- 分页 -->
          <!-- current-page：当前页，跟后端page一致 -->
          <!-- page-size：单页大小，跟后端limit一致 -->
          <!-- :small：一个布尔值，用于控制分页组件的大小，如果设为true，则显示为小号组件。 -->
          <!-- :disabled：一个布尔值，用于禁用分页组件，如果设为true，则分页组件为禁用状态，用户无法进行翻页操作。 -->
          <!-- :background：一个布尔值，用于控制分页组件的背景颜色，如果设为true，则分页组件的背景为灰色。   -->
          <!-- layout：分页的布局，带有什么功能 -->
          <!-- :total：指定总共有多少条数据，用于计算总共有多少页。 -->
          <!-- size-change：单页大小改变后触发 -->
          <!-- current-change：页数改变后触发 -->
          <el-pagination
            :current-page="getWorkflowData.params.page"
            :page-size="getWorkflowData.params.limit"
            :page-sizes="pageList"
            :small="small"
            :disabled="disabled"
            :background="background"
            layout="total, sizes, prev, pager, next, jumper"
            :total="workflowTotal"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>
    <div>
      <!-- 抽屉1 -->
      <el-drawer v-model="drawer1" :before-close="handleClose">
        <!-- <el-drawer v-model="drawer1"> -->
        <!-- 插槽：抽屉标题  -->
        <template #title>
          <el-row :gutter="10">
            <el-col :span="24">
              <div>
                <span style="font-weight: bold; font-size: 18px"
                  >选择工作流类型</span
                >
              </div>
            </el-col>
            <el-col :span="24"> </el-col>
          </el-row>
        </template>
        <template #default>
          <div>
            <!-- <el-card body-style="{padding:'10px'}" shadow="never"> -->
            <!-- finish-status:设置结束步骤的状态 -->
            <el-steps
              :active="stepsActive"
              finish-status="success"
              align-center
            >
              <el-step title="步骤一" description="选择工作流类型" />
              <el-step title="步骤二" description="填写表单" />
              <el-step title="步骤三" description="创建资源" />
            </el-steps>
            <!-- </el-card> -->
          </div>
          <div style="padding-top: 20px">
            <el-card
              shadow="never"
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <el-radio-group
                v-model="createWorkflowData.params.type"
                @change="keysAndVal(createWorkflowData.params.type, '类型')"
              >
                <el-radio label="ClusterIP" style="padding: 25px"
                  >ClusterIP</el-radio
                >
                <el-radio label="NodePort" style="padding: 25px"
                  >NodePort</el-radio
                >
                <el-radio label="Ingress" style="padding: 25px"
                  >Ingress</el-radio
                >
              </el-radio-group>
            </el-card>
          </div>
        </template>
        <template #footer>
          <div style="display: flex; justify-content: flex-end">
            <el-button type="primary" @click="nextDrawer1()">下一步</el-button>
          </div>
        </template>
      </el-drawer>
      <!-- 抽屉2 -->
      <el-drawer
        v-model="drawer2"
        :direction="direction"
        :before-close="handleClose"
      >
        <!-- 插槽：抽屉标题  -->
        <template #header>
          <span style="font-weight: bold; font-size: 18px">填写表单</span>
        </template>
        <!-- 插槽，抽屉body，填写表单属性 -->
        <template #default>
          <div>
            <!-- <el-card body-style="{padding:'10px'}" shadow="never"> -->
            <!-- finish-status:设置结束步骤的状态 -->
            <el-steps
              :active="stepsActive"
              finish-status="success"
              align-center
            >
              <el-step title="步骤一" description="选择工作流类型" />
              <el-step title="步骤二" description="填写表单" />
              <el-step title="步骤三" description="创建资源" />
            </el-steps>
            <!-- </el-card> -->
          </div>
          <!-- type="flex"  布局模式，可选 flex -->
          <!-- justify="center"  flex布局下的水平排列方式 -->
          <el-row type="flex" justify="center" style="padding-top: 20px">
            <el-col :span="20">
              <!-- ref绑定控件后，js中才能用this.$ref获取该控件 -->
              <!-- rules 定义form表单校验规则 -->
              <!-- label-width 限制左侧标题的宽度 -->
              <el-form
                label-width="80px"
                ref="createWorkflow"
                :rules="createWorkflowRules"
                :model="createWorkflow"
              >
                <el-form-item
                  label="名称"
                  prop="name"
                  class="workflow-create-form"
                >
                  <el-input
                    v-model="createWorkflow.name"
                    @blur="keysAndVal(createWorkflow.name, '名称')"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="命名空间"
                  prop="namespace"
                  class="workflow-create-form"
                >
                  <el-select
                    v-model="createWorkflow.namespace"
                    filterable
                    placeholder="请选择"
                    style="width: 100%"
                    @blur="keysAndVal(createWorkflow.namespace, '命名空间')"
                  >
                    <el-option
                      v-for="(item, index) in namespaceList"
                      :key="index"
                      :label="item.metadata.name"
                      :value="item.metadata.name"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="副本数" prop="replicas" style="width: 90%">
                  <el-input-number
                    v-model="createWorkflow.replicas"
                    :min="1"
                    :max="10"
                    style="width: 80%"
                  ></el-input-number>
                  <!-- 弹出框 -->
                  <!-- placement 消息出现的位置 -->
                  <!-- trigger 触发方式 hover表示悬停 -->
                  <!-- content 显示的内容，也可以通过写入默认 slot 修改显示内容 -->
                  <el-popover
                    style="width: 20%"
                    placement="top"
                    :width="100"
                    trigger="hover"
                    content="申请副本数上限为10个"
                  >
                    <template #reference>
                      <el-icon
                        style="width: 2em; font-size: 18px; color: #4795ee"
                        ><WarningFilled
                      /></el-icon>
                    </template>
                  </el-popover>
                </el-form-item>
                <el-form-item
                  label="镜像"
                  prop="image"
                  class="workflow-create-form"
                >
                  <el-input
                    v-model="createWorkflow.image"
                    @blur="keysAndVal(createWorkflow.image, '镜像')"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="标签"
                  prop="label_str"
                  class="workflow-create-form"
                >
                  <!-- placeholder: 用来在输入框显示提示信息 -->
                  <el-input
                    v-model="createWorkflow.label_str"
                    placeholder="示例: project=ms,app=gateway"
                    @blur="keysAndVal(createWorkflow.label_str, '标签')"
                  ></el-input>
                </el-form-item>
                <el-form-item label="资源配额" class="workflow-create-form">
                  <el-select
                    v-model="createWorkflow.resource"
                    style="width: 100%"
                    placeholder="cpu(m)/mem(Mi)"
                    @blur="keysAndVal(createWorkflow.resource, '资源配额')"
                  >
                    <el-option
                      v-for="(data, i) in resources"
                      :key="i"
                      :label="data"
                      :value="data"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="健康检查" class="workflow-create-form">
                  <!-- el-switch 开关按钮 -->
                  <el-switch
                    v-model="createWorkflow.health_check"
                    @change="
                      keysAndVal(createWorkflow.health_check, '健康检查')
                    "
                  />
                </el-form-item>
                <el-form-item label="检查路径" class="workflow-create-form">
                  <el-input
                    v-model="createWorkflow.health_path"
                    @blur="keysAndVal(createWorkflow.health_path, '检查路径')"
                  ></el-input>
                </el-form-item>
                <el-form-item label="Service" class="workflow-create-form-item">
                </el-form-item>
                <el-form-item
                  prop="container_port"
                  label="容器端口"
                  class="workflow-create-form"
                >
                  <el-input
                    v-model="createWorkflow.container_port"
                    placeholder="示例：80"
                    @blur="
                      keysAndVal(createWorkflow.container_port, '容器端口')
                    "
                  ></el-input>
                </el-form-item>
                <el-form-item
                  prop="port"
                  label="Pod端口"
                  class="workflow-create-form"
                >
                  <el-input
                    v-model="createWorkflow.port"
                    @blur="keysAndVal(createWorkflow.port, 'Pod端口')"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  v-if="createWorkflowData.params.type == 'NodePort'"
                  label="NodePort"
                  class="workflow-create-form"
                >
                  <el-input
                    v-model="createWorkflow.node_port"
                    @blur="keysAndVal(createWorkflow.node_port, 'NodePort')"
                  ></el-input>
                </el-form-item>
                <div v-if="createWorkflowData.params.type == 'Ingress'">
                  <el-form-item
                    label="Ingress"
                    class="workflow-create-form-item"
                  >
                  </el-form-item>
                  <el-form-item label="Ing域名" prop="host" style="width: 100%">
                    <el-input
                      v-model="createWorkflow.host"
                      @blur="keysAndVal(createWorkflow.host, 'Ing域名')"
                    ></el-input>
                  </el-form-item>
                  <div
                    v-for="(v, i) in testarr"
                    :key="i"
                    style="background: #f8f8f5"
                  >
                    <div style="height: 10px; background: #ffffff"></div>
                    <div style="height: 10px; background: #f8f8f5"></div>
                    <el-form
                      label-width="80px"
                      ref="createIngressHost"
                      :rules="createWorkflowRules"
                      :model="hostsArr[i]"
                    >
                      <el-form-item
                        label="主机路径"
                        prop="path"
                        style="width: 95%"
                      >
                        <el-input
                          v-model="hostsArr[i].path"
                          @blur="keysAndValIng(hostsArr[i].path, 'Ing域名')"
                        ></el-input>
                      </el-form-item>
                      <el-form-item
                        label="路径类型"
                        prop="path_type"
                        style="width: 95%"
                      >
                        <!-- <el-input v-model="hostsArr[i].path_type"></el-input> -->
                        <el-select
                          v-model="hostsArr[i].path_type"
                          filterable
                          placeholder="请选择"
                          style="width: 100%"
                          @blur="keysAndVal(hostsArr[i].path_type, '路径类型')"
                        >
                          <el-option
                            v-for="(t, i) in createIngress.path_types"
                            :key="i"
                            :label="t"
                            :value="t"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item
                        label="SVC名字"
                        prop="service_name"
                        style="width: 95%"
                      >
                        <!-- @blur: 鼠标失去聚焦触发 -->
                        <el-input
                          v-model="hostsArr[i].service_name"
                          @blur="
                            // getSvcs(hostsArr[i].service_name);
                            keysAndVal(hostsArr[i].service_name, 'SVC名字')
                          "
                        ></el-input>
                      </el-form-item>
                      <el-form-item
                        label="SVC端口"
                        prop="service_port"
                        style="width: 95%"
                      >
                        <el-input
                          v-model="hostsArr[i].service_port"
                          @blur="
                            keysAndVal(hostsArr[i].service_port, 'SVC端口')
                          "
                        ></el-input>
                      </el-form-item>
                    </el-form>
                    <div style="margin-left: 420px">
                      <el-button @click="submitFormRules('createIngressHost')"
                        >添加规则</el-button
                      >
                    </div>
                    <div style="height: 15px"></div>
                  </div>
                </div>
              </el-form>
            </el-col>
          </el-row>
        </template>
        <template #footer>
          <el-button
            @click="
              nextDrawer1();
              stepsActive = 0;
            "
            >上一步</el-button
          >
          <!-- <el-button type="primary" @click="submitForm('createWorkflow')"
          >下一步</el-button
        > -->
          <el-button type="primary" @click="nextDrawer2()">下一步</el-button>
        </template>
      </el-drawer>
      <!-- 抽屉3 -->
      <el-drawer v-model="drawer3" :before-close="handleClose">
        <!-- 插槽：抽屉标题  -->
        <template #title>
          <span style="font-weight: bold; font-size: 18px">创建资源</span>
        </template>
        <template #default>
          <div>
            <!-- <el-card body-style="{padding:'10px'}" shadow="never"> -->
            <!-- finish-status:设置结束步骤的状态 -->
            <el-steps
              :active="stepsActive"
              finish-status="success"
              align-center
            >
              <el-step title="步骤一" description="选择工作流类型" />
              <el-step title="步骤二" description="填写表单" />
              <el-step title="步骤三" description="创建资源" />
            </el-steps>
            <!-- </el-card> -->
          </div>
          <div style="padding-top: 20px">
            <el-card class="box-card">
              <template #header>
                <div class="card-header">
                  <span>资源信息确认</span>
                </div>
              </template>
              <div class="showColor">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-row :gutter="10">
                      <div v-for="(data, index) in keyAndValArr" :key="index">
                        <!-- 展示通用项 -->
                        <div v-for="(v, k) in data" :key="k">
                          <div v-if="v == '检查路径'">
                            <div
                              v-if="createWorkflow.health_check"
                              style="width: 500px; padding-top: 8px"
                            >
                              <el-row>
                                <el-col :span="10">
                                  <span>{{ v }}</span></el-col
                                >
                                <el-col :span="10"
                                  ><span>{{ k }}</span></el-col
                                >
                              </el-row>
                            </div>
                          </div>
                          <div
                            v-else-if="
                              v != '主机路径' &&
                              v != '路径类型' &&
                              v != 'SVC名字' &&
                              v != 'SVC端口'
                            "
                            style="width: 500px; padding-top: 8px"
                          >
                            <el-row>
                              <el-col :span="10">
                                <span>{{ v }}</span></el-col
                              >
                              <el-col :span="10"
                                ><span>{{ k }}</span></el-col
                              >
                            </el-row>
                          </div>
                        </div>
                      </div>
                      <!-- 展示ingress项 -->
                      <div
                        v-if="createWorkflowData.params.type == 'Ingress'"
                        style="padding-top: 20px"
                      >
                        <div style="font-weight: bold">Ing规则</div>
                        <!-- 通过遍历hosts的规则数组来显示字段，有几个数组显示几个字段组 -->
                        <div v-for="(data, i) in hostsArr" :key="i">
                          <div style="width: 500px; padding-top: 8px">
                            <el-row>
                              <el-col :span="10"> <span>主机路径</span></el-col>
                              <el-col :span="10"
                                ><span>{{ hostsArr[i].path }}</span></el-col
                              >
                            </el-row>
                          </div>
                          <div style="width: 500px; padding-top: 8px">
                            <el-row>
                              <el-col :span="10"> <span>路径类型</span></el-col>
                              <el-col :span="10"
                                ><span>{{
                                  hostsArr[i].path_type
                                }}</span></el-col
                              >
                            </el-row>
                          </div>
                          <div style="width: 500px; padding-top: 8px">
                            <el-row>
                              <el-col :span="10"> <span>SVC名字</span></el-col>
                              <el-col :span="10"
                                ><span>{{
                                  hostsArr[i].service_name
                                }}</span></el-col
                              >
                            </el-row>
                          </div>
                          <div style="width: 500px; padding-top: 8px">
                            <el-row>
                              <el-col :span="10"> <span>SVC端口</span></el-col>
                              <el-col :span="10"
                                ><span>{{
                                  hostsArr[i].service_port
                                }}</span></el-col
                              >
                            </el-row>
                          </div>
                        </div>
                      </div>
                    </el-row>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </div>
        </template>
        <template #footer>
          <div style="display: flex; justify-content: flex-end">
            <el-button
              @click="
                nextDrawer3();
                stepsActive = 1;
              "
              >上一步</el-button
            >
            <el-button
              type="primary"
              v-loading.fullscreen.lock="fullscreenLoading"
              @click="
                createWorkflowFunc();
                drawer3 = false;
                stepsActive = 0;
              "
              >确认创建</el-button
            >
            <el-button
              type="warning"
              @click="
                drawer3 = false;
                resetForm('createWorkflow');
                createWorkflowData.params.type == 'Ingress'
                  ? resetForm('createIngressHost')
                  : '';
                createWorkflowData.params.type = '';
              "
              >取消</el-button
            >
          </div>
        </template>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import common from "../common/Config";
import httpClient from "../../utils/request";
import yaml2obj from "js-yaml";
import json2yaml from "json2yaml";
export default {
  data() {
    return {
      //步骤条索引
      stepsActive: 0,
      //工作流类型

      namespaceValue: "",
      namespaceList: [],
      namespaceListUrl: common.k8sNamespaceList,
      input: "",
      drawer1: false,
      drawer2: false,
      drawer3: false,
      direction: "rtl",
      resources: ["250/512", "500/1024", "750/2048", "1000/4096"],
      fullscreenLoading: false,
      createWorkflow: {
        name: "",
        namespace: "",
        replicas: 1,
        image: "",
        resource: "",
        health_check: false,
        health_path: "",
        label_str: "",
        // label: {},
        container_port: "",
        type: "",
        port: "",
        node_port: "",
        host: "",
      },
      //发送请求时的参数
      label_str: "",
      createWorkflowData: {
        url: common.K8sCreateWorkflow,
        params: {
          name: "",
          namespace: "",
          image: "",
          replicas: 0,
          label: {},
          cpu: "",
          memory: "",
          container_port: 0,
          health_check: false,
          health_path: "",
          type: "",
          port: "",
          node_port: 0,
          hosts: {},
        },
      },
      testarr: [1],
      createIngress: {
        name: "",
        namespace: "",
        label_str: "",
        host: "",
        path_types: ["Exact", "Prefix", "ImplementationSpecific"],
      },
      //先将数组里初始化一个对象，保证索引0有key
      hostsArr: [
        {
          path: "",
          path_type: "",
          service_name: "",
          service_port: 0,
        },
      ],
      // 定义el-form规则,只有定义了规则的input前面才会有红点,也就是必填项
      createWorkflowRules: {
        name: [
          {
            required: true,
            message: "请填写名称",
            trigger: "change",
          },
        ],
        image: [
          {
            required: true,
            message: "请填写镜像",
            trigger: "change",
          },
        ],
        namespace: [
          {
            required: true,
            message: "请选择命名空间",
            trigger: "change",
          },
        ],
        resource: [
          {
            required: true,
            message: "请选择配额",
            trigger: "change",
          },
        ],
        label_str: [
          {
            required: true,
            message: "请填写标签",
            trigger: "change",
          },
        ],
        container_port: [
          {
            required: true,
            message: "请填写容器端口",
            trigger: "change",
          },
        ],
        port: [
          {
            required: true,
            message: "请填写Pod端口",
            trigger: "change",
          },
        ],
        ontainer_port: [
          {
            required: true,
            message: "请填写容器端口",
            trigger: "change",
          },
        ],
        host: [
          {
            required: true,
            message: "请填写域名",
            trigger: "change",
          },
        ],
        path: [
          {
            required: true,
            message: "请填写路径",
            trigger: "change",
          },
        ],
        path_type: [
          {
            required: true,
            message: "请填写路径类型",
            trigger: "change",
          },
        ],

        service_name: [
          {
            required: true,
            message: "请填写Svc名字",
            trigger: "change",
          },
        ],
        service_port: [
          {
            required: true,
            message: "请填写Svc端口",
            trigger: "change",
          },
        ],
      },
      //列表
      workflowList: [],
      appLoading: true,
      workflowTotal: 0,
      getWorkflowData: {
        url: common.K8sGetWorkflows,
        params: {
          name: "",
          namespace: "",
          page: 1,
          limit: 10,
        },
      },
      //分页
      currentPage: 1,
      pagesize: 10,
      small: true,
      disabled: false,
      background: true,
      pageList: [10, 20, 30, 40],
      //删除
      deleteWorkflowData: {
        url: common.K8sDeleteWorkflowById,
        params: {
          id: 0,
        },
      },
      //编辑器配置
      cmOptions: common.cmOptions,
      contentYaml: "",
      //用来组装参数键值对的map数组
      keyAndValArr: [],
      keysAndValIngs: {},
    };
  },
  methods: {
    keysAndValIng(key, val) {
      if (key != "") {
        this.keysAndValIngs[key] = val;
        if (val == "SVC端口") {
          this.keysAndVals[this.createWorkflow.host].push(this.keysAndValIngs);
        }
      }
    },
    keysAndVal(key, val) {
      console.log("新增：", key, val);
      let map = {};
      if (key != "" || val == "健康检查") {
        //首先遍历该Map数组
        for (let i in this.keyAndValArr) {
          //遍历每个map
          for (let k in this.keyAndValArr[i]) {
            //如有相同的val
            if (this.keyAndValArr[i][k] == val) {
              //就直接删除旧的map
              console.log("删除：", this.keyAndValArr[i]);
              this.keyAndValArr.splice(i, 1);
              console.log("删除相同map之后的数组为：", this.keyAndValArr);
            }
          }
        }
        console.log("开始新增：", key, val);
        //继续赋值给map数组
        map[key] = val;
        this.keyAndValArr.push(map);
      }
    },
    resetDatas() {
      if (this.createWorkflow.name != "") {
        this.resetForm("createWorkflow");
        if (this.createWorkflowData.params.type == "Ingress") {
          this.resetForm("createIngressHost");
          this.testarr = [1];
          this.hostsArr = [
            {
              path: "",
              path_type: "",
              service_name: "",
              service_port: 0,
            },
          ];
        }
        this.createWorkflow.node_port = "";
        this.createWorkflowData.params.node_port = 0;
        this.createWorkflow.health_check = false;
        this.createWorkflowData.params.health_check = false;
        this.createWorkflow.health_path = "";
        this.createWorkflowData.params.health_path = "";
        this.createWorkflowData.params.hosts = {};
        this.createWorkflowData.params.type = "";
      }
      this.keyAndValArr = [];
      this.stepsActive = 0;
    },
    handleClose(done) {
      this.$confirm("还有未保存的工作哦确定关闭吗？")
        .then((_) => {
          done();
          this.resetDatas();
        })
        .catch((_) => {});
    },
    addvalue() {
      this.testarr.push(1);
      // this.hostsArr[index] = this.hosts;
      //往数组内追加index+1的所有key,用来为后面的绑定数组做准备
      this.hostsArr.push({
        path: "",
        path_type: "",
        service_name: "",
        service_port: 0,
      });
      //console.log("xxx:", this.hostsArr);
    },
    alertInfo(name) {
      this.$alert("请先创建Service " + name, "提示", {
        confirmButtonText: "确定",
      });
    },
    nextDrawer1() {
      if (!this.createWorkflowData.params.type) {
        this.$alert("请先选择工作流类型", "消息提示", {
          confirmButtonText: "确定",
        });
      } else {
        if (this.drawer1 == true) {
          this.drawer1 = false;
          this.drawer2 = true;
          this.stepsActive = 1;
        } else {
          this.drawer2 = false;
          this.drawer1 = true;
        }
      }
    },
    nextDrawer2() {
      this.keysAndVal(this.createWorkflow.replicas, "副本数");
      console.log("需要展示的是：", this.keyAndValArr);
      if (this.createWorkflowData.params.type == "Ingress") {
        this.submitForm("createIngressHost");
      }
      this.submitForm("createWorkflow");
    },
    nextDrawer3() {
      if (this.drawer3 == true) {
        this.drawer3 = false;
        this.drawer2 = true;
      }
    },
    //创建前的组装数据
    assembleResourceInfo() {
      this.createWorkflowData.params.name = this.createWorkflow.name;
      this.createWorkflowData.params.namespace = this.createWorkflow.namespace;
      this.createWorkflowData.params.image = this.createWorkflow.image;
      this.createWorkflowData.params.replicas = parseInt(
        this.createWorkflow.replicas
      );
      if (this.createWorkflow.resource) {
        this.createWorkflowData.params.cpu =
          this.createWorkflow.resource.split("/")[0] + "m";
        this.createWorkflowData.params.memory =
          this.createWorkflow.resource.split("/")[1] + "Mi";
      }
      if (this.createWorkflow.port) {
        this.createWorkflowData.params.port = parseInt(
          this.createWorkflow.port
        );
      }
      if (this.createWorkflow.node_port) {
        this.createWorkflowData.params.node_port = parseInt(
          this.createWorkflow.node_port
        );
      }
      if (this.createWorkflow.container_port) {
        this.createWorkflowData.params.container_port = parseInt(
          this.createWorkflow.container_port
        );
      }
      //正则匹配，验证label
      // "(^[A-Za-z]+=[A-Za-z0-9]+).*": 表示匹配以字母开头，后跟一个或多个字母或数字的键值对形式的字符串。其中^表示匹配字符串的开始，
      // [A-Za-z]表示匹配任意一个英文字母，+表示匹配前面的模式一次或多次，[A-Za-z0-9]表示匹配任意一个英文字母或数字，.*表示匹配任意字符零次或多次。
      let reg = new RegExp("(^[A-Za-z]+=[A-Za-z0-9]+).*");
      //如果不匹配
      if (!reg.test(this.createWorkflow.label_str)) {
        this.$message.warning({
          message: "标签填写异常，请确认后重新填写",
        });
        return;
      }
      let label = new Map();
      // 将label_str字符串通过","进行分割，返回一个数组存储在a中：例如目前该字符串为："name=test,app=web",那么a就等于["name=test","app=web"]
      let a = this.createWorkflow.label_str.split(",");
      //遍历a数组中的每个元素
      a.forEach((item) => {
        let b = item.split("=");
        label[b[0]] = b[1];
      });
      this.createWorkflowData.params.label = label;
      for (let i in this.hostsArr) {
        if (this.hostsArr[i].service_port) {
          this.hostsArr[i].service_port = parseInt(
            this.hostsArr[i].service_port
          );
        }
      }
      console.log("ing数组为：", this.createWorkflow.host, this.hostsArr);
      this.createWorkflowData.params.hosts[this.createWorkflow.host] =
        this.hostsArr;
      console.log("目前是：", this.hostsArr);
      console.log("组装数据中：健康检查为", this.createWorkflow.health_check);
      this.createWorkflowData.params.health_check =
        this.createWorkflow.health_check;
      if (this.createWorkflow.health_check) {
        console.log("判断里面：", this.createWorkflowData.params.health_check);
        this.createWorkflowData.params.health_path =
          this.createWorkflow.health_path;
      } else {
        console.log("判断里面：", this.createWorkflowData.params.health_check);
        this.createWorkflowData.params.health_path = "";
      }
      console.log("组装好了：", this.createWorkflowData.params);
    },
    //获取namespace列表
    getNamespaces() {
      httpClient
        .get(this.namespaceListUrl)
        .then((res) => {
          this.namespaceList = res.data.namespaces; //res.data.namespaces 是根据后端返回时的数据名写
          // console.log("获取数据为：", res.data.namespaces);
        })
        // 异常捕获
        .catch((res) => {
          this.$message.error({
            message: res.msg,
          });
          // console.log("报错为：", res);
        });
    },
    //获取workflow列表
    getWorkflows() {
      // 组装过滤条件
      this.getWorkflowData.params.name = this.input;
      this.getWorkflowData.params.namespace = this.namespaceValue;
      this.getWorkflowData.params.page = this.currentPage;
      this.getWorkflowData.params.limit = this.pagesize;
      console.log("本次请求为：", this.getWorkflowData.params);

      // 根据过滤条件去发送get请求，重新获取dployemnt列表，为空则返回所有资源
      // params：设置请求参数，会将这些参数附加到URL的查询字符串中，例如：http://127.0.0.1:8999/api/appsv1/getworkflows?filter_name=&namespace=huiju&page=1&limit=10
      httpClient
        .get(this.getWorkflowData.url, {
          params: this.getWorkflowData.params,
        })
        .then((res) => {
          this.workflowList = res.data.items;
          this.workflowTotal = res.data.total;
          //   res.data.items.forEach((data) => {
          //     console.log("获取到workflow：", data);
          //   });
          //   console.log("获取到workflow：", this.workflowList[0].type);
          this.appLoading = false;
        })
        .catch((res) => {
          this.$message.error({
            message: res.msg,
          });
          console.log("报错为：", res);
          //this.appLoading = false;
        });
    },
    //创建workflow对象
    //创建deployment资源限制待解决
    createWorkflowFunc() {
      //先开启加载动画
      this.fullscreenLoading = true;
      //去组装数据
      this.assembleResourceInfo();
      console.log(
        "createWorkflowFunc准备创建的数据为：",
        this.createWorkflowData.params
      );
      console.log("此时workflow为", this.createWorkflow);
      //组装好数据后开始创建
      httpClient
        .post(this.createWorkflowData.url, this.createWorkflowData.params)
        .then((res) => {
          this.$message.success({
            message: res.msg,
          });
          // 创建之后重新获取下该namespace的workflow列表
          this.getWorkflows();
        })
        .catch((res) => {
          this.$message.error({
            message: res.err,
          });
        })
        .finally(() => {
          //关闭动画加载和抽屉
          this.fullscreenLoading = false;
          this.drawer3 = false;
          //重置表单，无论创建成功与否，都会重置表单
          this.resetDatas();
        });
    },
    //重置表单
    resetForm(formName) {
      //this.$refs可以获取到该表单对象所有加到Rules规则组里面的组件的值
      // resetFields方法可以重置表单字段的值
      console.log("需要重置的表单：", formName);
      //   this.$refs[formName].resetFields();
      let inner = this.$refs[formName];
      if (formName == "createIngressHost") {
        inner = this.$refs[formName][0]; //如果是第二个表单需要用refs去操作的话，必须得加上索引进行指定
        this.testarr = [1];
        this.hostsArr = [
          {
            path: "",
            path_type: "",
            service_name: "",
            service_port: 0,
          },
        ];
      }
      inner.resetFields();
      //没有加入到Rules里面的变量值需要自己重置
      this.createWorkflow.node_port = "";
      this.createWorkflowData.params.node_port = "";
      this.createWorkflow.health_check = false;
      this.createWorkflowData.params.health_check = false;
      this.createWorkflow.health_path = "";
      this.createWorkflowData.params.health_path = "";
      this.keyAndValArr = [];
    },
    //验证单个规则表单
    submitFormRules(formName) {
      this.$refs[formName][0].validate((valid) => {
        if (valid) {
          console.log("Ing规则通过：", formName);
          this.addvalue();
        } else {
          console.log("Ing规则不通过：", formName);
          return false;
        }
      });
    },
    //验证所有表单
    submitForm(formName) {
      console.log("准备校验：", this.$refs[formName]);
      //验证表单的每个规则是否通过，通过则调用createIngressFunc，反之返回false
      //this.$refs.innerForms[1];
      let inner = this.$refs[formName];
      let flag = 0;
      if (formName == "createIngressHost") {
        inner = this.$refs[formName][0]; //如果是第二个表单需要用refs去操作的话，必须得加上索引进行指定
      } else {
        flag = 1;
      }
      inner.validate((valid) => {
        if (valid) {
          console.log("规则通过：", formName);
          //当flag=1的时候代表校验的是通用规则，也就是可以进行下一步了
          if (flag == 1) {
            if (this.drawer2 == true) {
              this.drawer2 = false;
              this.drawer3 = true;
              this.stepsActive = 2;
            }
          }
        } else {
          console.log("规则不通过：", formName);
          return false;
        }
      });
    },
    //刷新页面的时候将namespace置为默认值
    resetNamespace() {
      this.namespaceValue = "";
      this.input = "";
    },
    //labels显示长度限制
    ellipsis(labels) {
      // 判断lables的长度是否大于15，为true则0-20位正常显示，之后的显示...，为false则直接返回值
      return labels.length > 15 ? labels.substring(0, 20) + "..." : labels;
    },
    //转换时间戳
    timeTrans(timestamp) {
      let date = new Date(new Date(timestamp).getTime() + 8 * 3600 * 1000);
      date = date.toJSON();
      date = date.substring(0, 19).replace("T", " ");
      return date;
    },
    //分页
    handleSizeChange(size) {
      console.log(`每页 ${size} 条`);
      this.pagesize = size;
      this.getWorkflows();
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      console.log("当前页: ", this.currentPage);
      this.getWorkflows();
    },
    //删除workflow
    deleteWorkflow(id) {
      console.log("将删除：", id);
      this.deleteWorkflowData.params.id = id;
      httpClient
        .delete(this.deleteWorkflowData.url, {
          params: this.deleteWorkflowData.params,
        })
        .then((_) => {
          this.$message({
            type: "success",
            message: name + "删除成功",
          });
          // 删除之后重新获取下该namespace的workflow列表
          this.getWorkflows();
        })
        .catch((_) => {
          this.$message({
            type: "info",
            message: name + "删除失败",
          });
        });
    },
    //操作类提示框：重启、删除..
    handleConfirm(id) {
      this.$confirm(
        "确认继续删除id为 [" + id + "] 的Workflow操作吗？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
        }
      )
        .then(() => {
          this.deleteWorkflow(id);
          this.$message({
            type: "success",
            message: "id为 [" + id + "] 的Workflow" + "已删除",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  //watch是一个选项对象，用于监听数据的变化。
  watch: {
    //监听namespace的值,若发生变化，则执行handler方法中的内容
    namespaceValue: {
      handler() {
        //将namespace的值存入本地，用于刷新页面或者path切换后依旧能获取得之前设置的namespace值
        localStorage.setItem("namespace", this.namespaceValue);
        // 页面刷新或切换的时候，把页数重新置为1并且重新获取workflow列表
        this.currentPage = 1;
        this.getWorkflows();
      },
    },
  },
  // beforeMount钩子函数里面的东西在页面实例挂载之前就调用了，用于页面数据的初始化
  beforeMount() {
    //加载页面时先获取localStorage中的namespace值，若获取不到则默认default，放在下拉框第一位显示
    if (
      localStorage.getItem("namespace") !== "undefined" &&
      localStorage.getItem("namespace") !== null
    ) {
      this.namespaceValue = localStorage.getItem("namespace");
    }
    //然后去获取namespace列表
    this.getNamespaces();
    //获取workflow列表
    this.getWorkflows();
  },
};
</script>

<style scoped>
/* 卡片属性 */
.workflow-head-card,
.workflow-body-card {
  border-radius: 1px;
  margin-bottom: 5px;
}
.workflow-create-form {
  width: 80%;
}
.workflow-head-card,
.workflow-body-card {
  border-radius: 1px;
  margin-bottom: 5px;
}

/* workflow鼠标悬停 */
/* :hover：这是一个伪类选择器，表示当鼠标悬停在元素上时应用样式。
  color: rgb(84, 138, 238);：这行代码将文本颜色设置为RGB值为(84, 138, 238)的蓝色。换句话说，当鼠标悬停在元素上时，元素的文本颜色将变为蓝色。
  cursor: pointer;：这行代码将鼠标指针的样式设置为指针形状，表示该元素可以被点击或具有交互性。 */
.workflow-body-workflowname:hover {
  color: rgb(84, 138, 238);
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
}
.time {
  font-size: 13px;
  color: rgb(145, 143, 143);
}
.workflow-create-form-item {
  font-weight: bold;
  color: black;
}
.showColor {
  font-size: 14px;
  color: rgb(145, 143, 143);
}
</style>
