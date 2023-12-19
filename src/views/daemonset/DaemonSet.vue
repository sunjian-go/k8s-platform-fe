<template>
  <!-- 头部区域 -->
  <div>
    <el-row class="deploy">
      <!-- 头部1 -->
      <el-col :span="24">
        <div>
          <!-- 包一层卡片 -->
          <!-- shadow 属性设置卡片阴影出现的时机 -->
          <el-card
            class="deploy-head-card"
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
      <el-col :span="24">
        <div>
          <el-card
            shadow="never"
            body-style="{padding:'10px'}"
            class="deploy-body-card"
          >
            <el-row :gutter="15">
              <!-- 创建按钮 -->
              <el-col :span="1.5" style="margin-left: -10px">
                <div>
                  <!-- v-loading.fullscreen.lock： 指定全屏加载 -->
                  <!-- <el-button
                    icon="Edit"
                    type="primary"
                    style="border-radius: 4px"
                    @click="drawer = true"
                    v-loading.fullscreen.lock="fullscreenLoading"
                    >创建</el-button
                  > -->
                  <!-- @click="drawer=true;getCreateData()"
                    v-loading.fullscreen.lock="fullscreenLoading" -->
                  <el-button
                    icon="Edit"
                    type="primary"
                    style="border-radius: 4px"
                    @click="openCreateWindow()"
                    >创建</el-button
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
                    @click="getDaemonSets()"
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
            class="deploy-body-card"
          >
            <el-table
              :data="daemonsetList"
              style="width: 100%; fint-size: 12px"
              v-loading="appLoading"
            >
              <!-- 此空列相当于第一列前面的占位符，为了美观 -->
              <el-table-column width="20" />
              <!-- align="left"  往左排列 -->
              <el-table-column label="DaemonSet" align="left">
                <!-- v-slot 定义一个插槽，用来接父组件的data值 -->
                <template v-slot="scope">
                  <!-- scope.row  表示当前循环项的 metadata 对象中的 name 属性，也就是一行的数据-->
                  <span
                    style="color: rgb(62, 165, 233)"
                    class="deploy-body-deployname"
                    >{{ scope.row.metadata.name }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column label="标签" align="left">
                <template v-slot="scope">
                  <div
                    v-for="(val, key) in scope.row.metadata.labels"
                    :key="key"
                  >
                    <!-- :content="`${key}: ${val}`" 要想给参数赋值一个变量，必须前面用：绑定该变量才可以用 -->
                    <!-- el-popover: 弹出框 -->
                    <el-popover
                      style="width: 100%"
                      placement="top"
                      :width="300"
                      trigger="hover"
                      :content="`${key}: ${val}`"
                    >
                      <template #reference>
                        <el-tag type="warning">{{
                          ellipsis(key + ": " + val)
                        }}</el-tag>
                      </template>
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="容器组" align="left">
                <!-- 显示：2/1：web 2/2: nginx -->
                <template v-slot="scope">
                  <div
                    v-for="(val, index) in scope.row.spec.template.spec
                      .containers"
                    :key="index"
                  >
                    <span
                      >{{ scope.row.spec.template.spec.containers.length }}/{{
                        index + 1
                      }}: {{ len }}{{ val.name }}</span
                    >
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" align="center">
                <template v-slot="scope">
                  <span class="time">{{
                    timeTrans(scope.row.metadata.creationTimestamp)
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="镜像" align="center">
                <template v-slot="scope">
                  <div
                    v-for="(val, index) in scope.row.spec.template.spec
                      .containers"
                    :key="index"
                  >
                    <el-popover
                      style="width: 100%"
                      placement="top"
                      :width="400"
                      trigger="hover"
                      :content="val.image"
                    >
                      <template #reference>
                        <el-tag>{{ ellipsis(val.image) }}</el-tag>
                      </template>
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="390">
                <template v-slot="scope">
                  <div>
                    <el-button
                      type="primary"
                      icon="Edit"
                      plain
                      @click="
                        getDaemonSetDetail(scope.row), (yamlDialog = true)
                      "
                      >YAML</el-button
                    >
                    <el-button
                      type="danger"
                      icon="Delete"
                      @click="
                        handleConfirm(
                          scope.row.metadata.name,
                          '删除',
                          deleteDaemonSet
                        )
                      "
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
            :current-page="getDaemonSetData.params.page"
            :page-size="getDaemonSetData.params.limit"
            :page-sizes="pageList"
            :small="small"
            :disabled="disabled"
            :background="background"
            layout="total, sizes, prev, pager, next, jumper"
            :total="daemonsetTotal"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>
    <!-- 抽屉包括其他dialog都可以放在代码块的最后 -->
    <!-- 创建里面的抽屉 -->
    <!-- v-model="drawer"：绑定该值用于显示(true)与隐藏(false) -->
    <!-- :direction 设置显示的位置 -->
    <!-- :before-close 关闭时触发，点击关闭或者空白区域都会触发 -->
    <el-drawer
      v-model="drawer"
      :direction="direction"
      :before-close="handleClose"
      size="60%"
    >
      <!-- 插槽：抽屉标题  -->
      <template #header>
        <span style="font-weight: bold; font-size: 18px">创建DaemonSet</span>
      </template>
      <!-- 插槽，抽屉body，填写表单属性 -->
      <template #default>
        <!-- type="flex"  布局模式，可选 flex -->
        <!-- justify="center"  flex布局下的水平排列方式 -->
        <el-row type="flex" justify="center">
          <el-col :span="20">
            <!-- ref绑定控件后，js中才能用this.$ref获取该控件 -->
            <!-- rules 定义form表单校验规则 -->
            <!-- label-width 限制左侧标题的宽度 -->
            <!-- :model 与对象进行绑定，用来赋值和修改值 -->
            <el-form
              label-width="80px"
              ref="createDaemonSet"
              :rules="createDaemonSetRules"
              :model="createDaemonSet"
            >
              <el-row :span="10">
                <el-col :span="12">
                  <el-form-item label="名称" prop="name" class="deploy-create-form">
                      <el-input v-model="createDaemonSet.name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="命名空间"
                    prop="namespace"
                    class="deploy-create-form"
                  >
                    <el-select
                      v-model="createDaemonSet.namespace"
                      filterable
                      placeholder="请选择"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="(item, index) in namespaceList"
                        :key="index"
                        :label="item.metadata.name"
                        :value="item.metadata.name"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="标签"
                    class="deploy-create-form"
                  >
                    <!-- placeholder: 用来在输入框显示提示信息 -->
                    <el-input
                      v-model="createDaemonSet.label_str"
                      placeholder="示例: project=ms,app=gateway"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item
                    label="主机调度"
                    class="deploy-create-form"
                  >
                  <d-collapse v-model="activeNames1">
                    <d-collapse-item title="配置 Pod 对应的主机调度规则" name="immersive">
                      <el-row :gutter="10">
                        <el-col :span="24">
                          <el-radio v-model="baseChoose1" label="true" @change="baseChoose2=false">指定主机运行所有 Pods</el-radio>
                            <div v-if="baseChoose1">
                              <el-select
                                v-model="createDaemonSet.nodeName"
                                style="width: 100%"
                                placeholder="请选择节点"
                              >
                                <el-option
                                  v-for="(node, nindex) in nodes"
                                  :key="nindex"
                                  :label="node"
                                  :value="node"
                                >
                                </el-option>
                              </el-select>
                            </div>
                        </el-col>
                        <el-col :span="24">
                          <el-radio v-model="baseChoose2" label="true" @change="baseChoose1=false">每个 Pod 自动匹配主机</el-radio>
                            <div v-if="baseChoose2">
                              <el-input
                                v-model="createDaemonSet.nodeSelectorLabel"
                                placeholder="示例: project=ms,app=gateway"
                              ></el-input>
                            </div>
                        </el-col>
                      </el-row> 
                    </d-collapse-item>
                  </d-collapse>                    
                  </el-form-item>
                </el-col>
                <el-col :span="24" >                 
                    <div style=" font-weight: bold; font-size: 16px;margin-left: 30px;">容器组</div>
                </el-col>
                <el-col :span="24">
                  <!-- 容器组 -->
                  <div v-for="v,cindex in createDaemonSet.containerArr.length" :key="cindex" >
                    <div style="height: 10px;"></div>
                    <el-card body-style="{padding:'1px'}"> 
                       <el-row :gutter="10">
                          <el-col :span="12">
                            <el-form-item
                              label="容器名"
                              class="deploy-create-form"
                            >
                              <el-input v-model="createDaemonSet.containerArr[cindex].name"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item
                              label="镜像"
                              class="deploy-create-form"
                            >
                              <el-input v-model="createDaemonSet.containerArr[cindex].image"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="下载策略"  class="deploy-create-form">
                              <el-select v-model="createDaemonSet.containerArr[cindex].imagePullPolicy"  style="width: 100%" placeholder="选择镜像下载策略">
                                  <el-option
                                    v-for="(policy, ipindex) in imgPullPolicys"
                                    :key="ipindex"
                                    :label="policy"
                                    :value="policy"
                                    >
                                  </el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item
                              label="资源配额"
                              class="deploy-create-form"
                            >
                              <el-select
                                v-model="createDaemonSet.containerArr[cindex].resource"
                                style="width: 100%"
                                placeholder="cpu/mem"
                              >
                                <el-option
                                  v-for="(data, rindex) in resources"
                                  :key="rindex"
                                  :label="data"
                                  :value="data"
                                >
                                </el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="健康检查" class="deploy-create-form">
                              <!-- el-switch 开关按钮 -->
                              <el-switch v-model="createDaemonSet.containerArr[cindex].healthCheck" />
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item v-if="createDaemonSet.containerArr[cindex].healthCheck" label="检查路径" class="deploy-create-form">
                              <el-input v-model="createDaemonSet.containerArr[cindex].healthPath" placeholder="目前仅支持http请求状态检查"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="24">
                            <el-form-item label="环境变量" class="deploy-create-form">
                              <div v-for="e,eindex in createDaemonSet.containerArr[cindex].envArr.length" :key="eindex">
                                <div>
                                  <el-row :gutter="10">
                                    <el-col :span="10">
                                    <el-input placeholder="Key" v-model="createDaemonSet.containerArr[cindex].envArr[eindex].name"></el-input>
                                    </el-col>
                                    <el-col :span="2" style="text-align: center;">
                                      <span>=</span>
                                    </el-col>
                                    <el-col :span="10">
                                      <el-input placeholder="Value" v-model="createDaemonSet.containerArr[cindex].envArr[eindex].value"></el-input>
                                    </el-col>
                                    <el-col :span="2">
                                      <el-icon @click="addvalue(createDaemonSet.containerArr[cindex].envArr)"><Plus /></el-icon>
                                      <el-icon @click="rmvalue(createDaemonSet.containerArr[cindex].envArr)"><Minus /></el-icon>
                                    </el-col>
                                  </el-row>
                                </div>
                              </div>
                            </el-form-item>
                          </el-col>
                          <el-col :span="24">
                          </el-col>
                          <el-col :span="24">
                          </el-col>
                       </el-row>
                      <el-form-item label="数据卷" class="deploy-create-form" >
                        <d-collapse v-model="activeNames2"  style="width:100%;">
                          <d-collapse-item :name="createDaemonSet.containerArr[cindex].dataVolumes" title="持久化和共享独立于单个客器生命周期的数据">
                            <div v-for="vm,vindex in createDaemonSet.containerArr[cindex].volumeArr.length" :key="vindex">
                              <el-row :gutter="10">
                                <el-col :span="12" style="padding-bottom: 5px;">
                                  <span>卷名</span>
                                  <el-input v-model="createDaemonSet.containerArr[cindex].volumeArr[vindex].volumeName"></el-input>
                                </el-col >
                                <el-col :span="12" style="padding-bottom: 5px;" v-if="createDaemonSet.containerArr[cindex].volumeArr[vindex].type=='configMap'||
                                createDaemonSet.containerArr[cindex].volumeArr[vindex].type=='Secret'">
                                  <span>默认模式</span>
                                  <el-input v-model="createDaemonSet.containerArr[cindex].volumeArr[vindex].mode"></el-input>
                                </el-col>
                                <el-col :span="12" style="padding-bottom: 5px;">
                                  <span>选择类型</span>
                                    <el-select
                                    v-model="createDaemonSet.containerArr[cindex].volumeArr[vindex].type"
                                    style="width: 100%"
                                    placeholder="请选择卷类型"
                                    @change="getVolumes(createDaemonSet.containerArr[cindex].volumeArr[vindex].type)"
                                  >
                                    <el-option
                                      v-for="(type, tindex) in volume_types"
                                      :key="tindex"
                                      :label="type"
                                      :value="type"
                                    >
                                    </el-option>
                                  </el-select>
                                </el-col>
                                <el-col :span="12" v-if="createDaemonSet.containerArr[cindex].volumeArr[vindex].type!='HostPath'&&
                                createDaemonSet.containerArr[cindex].volumeArr[vindex].type!='EmptyDir'" style="padding-bottom: 5px;">
                                  <span>选择卷</span>
                                    <el-select
                                    v-model="createDaemonSet.containerArr[cindex].volumeArr[vindex].context"
                                    style="width: 100%"
                                    placeholder="选择数据卷"
                                    >
                                    <el-option
                                      v-for="(volume, vmindex) in volumes"
                                      :key="vmindex"
                                      :label="volume"
                                      :value="volume"
                                    >
                                    </el-option>
                                  </el-select>
                                </el-col>
                                <div v-if="createDaemonSet.containerArr[cindex].volumeArr[vindex].type=='configMap'" style="width: 100%;">
                                  <el-col :span="24" >
                                      <span>项目</span>
                                  </el-col>
                                  <el-col :span="24" style="padding-bottom: 5px;">
                                    <el-radio v-model="createDaemonSet.containerArr[cindex].volumeArr[vindex].radio" label="1">所有键</el-radio>
                                    <el-radio v-model="createDaemonSet.containerArr[cindex].volumeArr[vindex].radio" label="2" @change="getCMKeys(createDaemonSet.namespace,
                                   createDaemonSet.containerArr[cindex].volumeArr[vindex].context)">选择特定的键</el-radio>
                                  </el-col>
                                  <el-col :span="24" v-if="createDaemonSet.containerArr[cindex].volumeArr[vindex].radio==2">
                                    <div v-for="v,iindex in createDaemonSet.containerArr[cindex].volumeArr[vindex].itemArr.length" :key="iindex" >
                                      <div style="padding-top: 10px;">
                                        <el-row :gutter="10">
                                          <el-col :span="9" style="padding-top: 5px;">
                                            <el-select style="width:100%;" v-model="createDaemonSet.containerArr[cindex].volumeArr[vindex].itemArr[iindex].key" placeholder="选择键：例如username">
                                              <el-option
                                                v-for="v,k in tsKeys"
                                                :key="k"
                                                :label="v"
                                                :value="v">
                                              </el-option>
                                            </el-select>
                                          </el-col>
                                          <el-col :span="9"> 
                                            <el-input style="padding-top: 5px;" v-model="createDaemonSet.containerArr[cindex].volumeArr[vindex].itemArr[iindex].path" placeholder="路径：my-group/my-username"></el-input>
                                          </el-col>
                                          <el-col :span="6">
                                            <el-input style="padding-top: 5px;" v-model="createDaemonSet.containerArr[cindex].volumeArr[vindex].itemArr[iindex].mode" placeholder="模式：例如400"></el-input>
                                          </el-col>
                                        </el-row>  
                                      </div>
                                    </div>
                                    <div style="width: 100%;display: flex;justify-content: flex-end;padding-top: 10px;padding-bottom: 10px;">
                                      <!-- <el-button type="primary" @click="addItems(containerArr[cindex].volumeArr[vindex].itemArr)">添加项目</el-button> -->
                                      <d-button-group size="sm">
                                        <d-button  icon="delete" color="danger" @click="rmItems(createDaemonSet.containerArr[cindex].volumeArr[vindex].itemArr)" variant="solid">删除项目</d-button>
                                        <d-button  icon="add" color="primary" @click="addItems(createDaemonSet.containerArr[cindex].volumeArr[vindex].itemArr)" variant="solid">添加项目</d-button>
                                      </d-button-group>
                                    </div>
                                  </el-col>
                                </div>
                                <el-col :span="24">
                                  <el-divider></el-divider>
                                  <el-row :gutter="10">
                                    <el-col :span="11">
                                      <span>容器路径</span>
                                    </el-col>
                                    <el-col :span="11">
                                      <span>子路径(仅适用于数据卷挂载)</span>
                                    </el-col>
                                    <el-col :span="2">
                                      <span>只读</span>
                                    </el-col>
                                    <el-col :span="24">
                                      <div v-for="v,mindex in createDaemonSet.containerArr[cindex].volumeArr[vindex].mountVolumeArr.length" :key="mindex">
                                        <div style="padding-bottom: 10px;">
                                          <el-row :gutter="10">
                                            <el-col :span="11">                                          
                                                <el-input v-model="createDaemonSet.containerArr[cindex].volumeArr[vindex].mountVolumeArr[mindex].mountPath" 
                                                @blur="createDaemonSet.containerArr[cindex].volumeArr[vindex].volumeName=''?_:
                                                createDaemonSet.containerArr[cindex].volumeArr[vindex].mountVolumeArr[mindex].name=createDaemonSet.containerArr[cindex].volumeArr[vindex].volumeName"
                                                ></el-input>                                          
                                            </el-col>
                                            <el-col :span="11">                                                 
                                                <el-input v-model="createDaemonSet.containerArr[cindex].volumeArr[vindex].mountVolumeArr[mindex].subPath"></el-input>
                                            </el-col>
                                            <el-col :span="2" style="text-align: center;">   
                                              <el-checkbox v-model="createDaemonSet.containerArr[cindex].volumeArr[vindex].mountVolumeArr[mindex].readOnly"></el-checkbox>
                                            </el-col>
                                          </el-row>
                                         </div>
                                       </div>
                                    </el-col>
                                  </el-row>
                                  <div style="width: 100%;display: flex;justify-content: flex-end;padding-top: 10px;padding-bottom: 10px;">
                                    <!-- <el-button type="primary" @click="rmMount(containerArr[cindex].volumeArr[vindex].mountVolumeArr)">删除挂载</el-button>
                                    <el-button type="primary" @click="addMount(containerArr[cindex].volumeArr[vindex].mountVolumeArr)">添加挂载</el-button> -->
                                    <d-button-group size="sm">
                                      <d-button color="danger" icon="delete" @click="rmMount(createDaemonSet.containerArr[cindex].volumeArr[vindex].mountVolumeArr)" variant="solid"> 删除映射</d-button>
                                      <d-button color="primary" icon="add" @click="addMount(createDaemonSet.containerArr[cindex].volumeArr[vindex].mountVolumeArr)" variant="solid"> 添加映射</d-button>
                                    </d-button-group>
                                  </div>
                                  
                                </el-col>
                              </el-row>
                            </div>
                            <div style="width: 100%;display: flex;justify-content: flex-end;padding-top: 10px;padding-bottom: 10px;">
                              <!-- <el-button type="primary" @click="rmVolumes(containerArr[cindex].volumeArr)">删除卷</el-button>
                              <el-button type="primary" @click="addVolumes(containerArr[cindex].volumeArr)">添加卷</el-button> -->
                              <d-button-group size="sm">
                                <d-button color="danger" icon="delete" @click="rmVolumes(createDaemonSet.containerArr[cindex].volumeArr)" variant="solid"> 删除卷</d-button>
                                <d-button color="primary" icon="add" @click="addVolumes(createDaemonSet.containerArr[cindex].volumeArr)" variant="solid"> 添加卷</d-button>
                              </d-button-group>
                            </div>
                          </d-collapse-item>
                        </d-collapse>
                      </el-form-item>
                      <el-form-item label="端口映射" class="deploy-create-form" >
                        <d-collapse v-model="activeNames3">
                          <d-collapse-item  :name="createDaemonSet.containerArr[cindex].portsArr" title="添加规则">
                            <div>
                              <el-row :gutter="10">
                                <el-col :span="7">
                                  <span>端口名称</span>
                                </el-col>
                                <el-col :span="7">
                                  <span>容器端口</span>
                                </el-col>
                                <el-col :span="5">
                                  <span>协议</span>
                                </el-col>
                                <el-col :span="5">
                                  <span>HostPort模式</span>
                                </el-col>
                              </el-row>
                            </div>
                            <div v-for="port,pindex in createDaemonSet.containerArr[cindex].portArr.length" :key="pindex">
                                <div style="width: 100%; padding-top: 15px;padding-bottom: 15px;">
                                  <el-row :gutter="10">
                                    <el-col :span="7"> 
                                      <el-input v-model="createDaemonSet.containerArr[cindex].portArr[pindex].portName" placeholder="例如：myport"></el-input>
                                    </el-col>
                                    <el-col :span="7">                                      
                                      <el-input v-model="createDaemonSet.containerArr[cindex].portArr[pindex].containerPort" placeholder="例如：8080"></el-input>
                                    </el-col>
                                    <el-col :span="5">                                     
                                      <el-select
                                          v-model="createDaemonSet.containerArr[cindex].portArr[pindex].protocol"
                                          filterable
                                          placeholder="请选择协议"
                                          style="width: 100%;"
                                        >
                                          <el-option
                                            v-for="(p, i) in proctols"
                                            :key="i"
                                            :label="p"
                                            :value="p"
                                          >
                                          </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="5">
                                      <div>                        
                                        <d-switch v-model="createDaemonSet.containerArr[cindex].portArr[pindex].hostportStatus">
                                        </d-switch>
                                      </div>
                                    </el-col>
                                    <el-col :span="12" v-if="createDaemonSet.containerArr[cindex].portArr[pindex].hostportStatus" style="padding-top: 5px;">
                                      <span>请输入HostPort</span>
                                      <el-input v-model="createDaemonSet.containerArr[cindex].portArr[pindex].hostPort" placeholder="仅 Pod 所在主机端口可访问"></el-input>
                                    </el-col>
                                    <el-col :span="12" v-if="createDaemonSet.containerArr[cindex].portArr[pindex].hostportStatus" style="padding-top: 5px;">
                                      <span>请输入HostIP</span>
                                      <el-input v-model="createDaemonSet.containerArr[cindex].portArr[pindex].hostIP" placeholder="例如：127.0.0.1"></el-input>
                                    </el-col>
                                  </el-row>
                                </div>
                            </div>
                            <div style="width: 100%;display: flex;justify-content: flex-end;padding-top: 10px;padding-bottom: 10px;">
                              <!-- <el-button type="primary" @click="rmCPorts(containerArr[cindex].portArr)">去除端口组</el-button>
                              <el-button type="primary" @click="addPorts(containerArr[cindex].portArr)">添加端口组</el-button> -->
                              <d-button-group size="sm">
                                <d-button color="danger" icon="delete" @click="rmCPorts(createDaemonSet.containerArr[cindex].portArr)" variant="solid"> 删除端口组</d-button>
                                <d-button color="primary" icon="add" @click="addPorts(createDaemonSet.containerArr[cindex].portArr)" variant="solid"> 添加端口组</d-button>
                              </d-button-group>
                            </div>
                          </d-collapse-item>
                        </d-collapse>
                      </el-form-item>
                    <!-- </div> -->
                    </el-card> 
                  </div>
                  <div style="width: 100%;display: flex;justify-content: flex-end;padding-top: 10px;padding-bottom: 10px;">
                    <d-button-group >
                      <d-button color="danger" icon="delete" @click="rmContainers" variant="solid">删除容器</d-button>
                      <d-button color="primary" icon="add" @click="addContainers(createDaemonSet.containerArr)" variant="solid">添加容器</d-button>
                    </d-button-group>
                    <!-- <el-button type="primary" @click="rmContainers">去除容器</el-button>
                    <el-button type="primary" @click="addContainers(containerArr)">添加容器</el-button> -->
                  </div>   
                </el-col>
              </el-row>                     
            
            </el-form>
          </el-col>
        </el-row>
      </template>
      <template #footer>
        <!-- <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="submitForm('createDaemonSet')"
          >立即创建</el-button
        > -->
        <div style="width: 100%;display: flex;justify-content: flex-end;padding-top: 10px;padding-bottom: 10px;">
          <d-button-group size="lg">
            <d-button  @click="drawer = false" >取消</d-button>
            <d-button color="primary" @click="submitForm('createDaemonSet')" variant="solid">立即创建</d-button>
          </d-button-group>
        </div>
      </template>
    </el-drawer>
    <!-- yaml编辑器 -->
    <el-dialog title="YAML信息" v-model="yamlDialog" width="70%" top="5%">
      <!-- DevUI里面的编辑器 -->
      <d-code-editor v-model="contentYaml" :options="{ language: 'yaml' }" style="height: 500px;"></d-code-editor>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="yamlDialog = false">取 消</el-button>
          <el-button type="primary" @click="updatePVC()">更 新</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getNamespacesReq, getNodes } from "@/api/cluster/cluster";
import {
getConfigMapsDetailReq,
getConfigMapsReq,
} from "@/api/configMap/configMap";
import {
deleteDaemonSetReq,
getDaemonSetsDetailReq,
getDaemonSetsReq,
updateDaemonSetsReq,
} from "@/api/daemonset/daemonset";
import { getPvcsReq } from "@/api/pvc/pvc";
import { getSecretsReq } from "@/api/secret/secret";
import yaml2obj from "js-yaml";
import json2yaml from "json2yaml";
import common from "../common/Config";

export default {
  //components: { codemirror },
  data() {
    return {
      tsKeys:[],
      baseChoose1:false,
      baseChoose2:false,
      sindex:0,
      activeNames1: "",
      activeNames2:"",
      activeNames3:"",
      restartBool: true, //重启按钮禁止
      namespaceValue: "",
      namespaceList: [],
      namespaceListUrl: common.k8sNamespaceList,
      input: "",
      drawer: false,
      direction: "rtl",
      resources: ["250/512", "500/1024", "750/2048", "1000/4096"],
      fullscreenLoading: false,
     
      //创建daemonSet
      label_str:"",
      resource:"",
      nodes:[],
      volume_types:["configMap","HostPath","EmptyDir","PersistentVolumeClaim","Secret"],
      volumes:[],
      imgPullPolicys:["IfNotPresent","Always","Never"],
      containerindex:[1],
      //参数组索引数组
      envIndex:[1],
      proctols:["TCP", "UDP"],
      //创建daemonset对象
      createDaemonSetData: {
        name: "",
        namespace: "",
        label: {},
        nodeName: "",
        nodeSelectorLabel: {},
        containers: [
          {
            name: "",
            image: "",
            ports: [
              {
                portName: "",
                containerPort: 0,
                protocol: "",
                hostportStatus: false,
                hostPort: "",
                hostIP: ""
              }
            ],
            montVolume: [
              {
                name: "",
                mountPath: "",
                readOnly: false,
                subPath: ""
              }
            ],
            envs: [
              {
                name: "",
                value: ""
              }
            ],
            imagePullpolicy: "",
            cpu: "",
            mem: "",
            healthCheck: false,
            healthPath: ""
          }
        ],
        volume: [
          {
            volumeName: "",
            type: "",
            context: "",
            mode: 0,
            items: [
              {
                key: "",
                path: "",
                mode: 0
              }
            ]
          }
        ]
      },
      nodeSelectors:"",
      //用于表单中的接收值
      createDaemonSet: {
        name: "",
        namespace: "",
        label_str:"",
        nodeName: "",
        nodeSelectorLabel: "",
        containerArr: [
          {
            dataVolumes:"",
            portsArr:"",
            name: '',
            image: '',
            imagePullPolicy: '',
            resource:"",
            healthCheck: false,
            healthPath: '',
            portArr: [
              {
                portName:"",
                containerPort:"",
                protocol:"",
                hostportStatus:false,
                hostPort:"",
                hostIP:""
              }
            ],
            envArr: [
              {
                name: '',
                value: ''
              }
            ],
            volumeArr: [
              {
                //是否选择特定键
                radio:"1",
                volumeName:"",
                type:"",
                context:"",
                mode: 400,
                itemArr: [
                  {
                    key: '',
                    path: '',
                    mode: ''
                  }
                ],
                mountVolumeArr: [
                  {
                    name: '',
                    mountPath: '',
                    readOnly: false,
                    subPath: ''
                  }
                ]
              }
            ]
          }
        ]
        },
      
      // 定义el-form规则,只有定义了规则的input前面才会有红点,也就是必填项
      createDaemonSetRules: {
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
        containername:[
          {
              required: true,
              message: "请填写容器名",
              trigger: "change",
          },
        ],
        containerPort:[
        {
            required: true,
            message: "请填写容器端口",
            trigger: "change",
        },
        ],
      },
      //列表
      daemonsetList: [],
      appLoading: true,
      daemonsetTotal: 0,
      getDaemonSetData: {
        url: common.K8sGetDaemonSetList,
        params: {
          name: "",
          namespace: "",
          limit: 10,
          page: 1,
        },
      },
      //分页
      currentPage: 1,
      pagesize: 10,
      small: true,
      disabled: false,
      background: true,
      pageList: [10, 20, 30, 40],
      //重启
      restartDaemonSetData: {
        url: common.K8sRestartDaemonSet,
        params: {
          name: "",
          namespace: "",
        },
      },
      //删除
      deleteDaemonSetData: {
        url: common.K8sDeleteDaemonSet,
        params: {
          name: "",
          namespace: "",
        },
      },
      //编辑器配置
      cmOptions: common.cmOptions,
      contentYaml: "",
      //详情
      yamlDialog: false,
      daemonsetDetail: {},
      daemonsetDetailData: {
        url: common.K8sGetDaemonSetDetail,
        params: {
          name: "",
          namespace: "",
        },
      },
      //更新
      updateDaemonSetData: {
        url: common.K8sUpdateDaemonSet,
        params: {
          namespace: "",
          content: "",
        },
      },
      
      
    
    };
  },
  methods: {
    //打开创建页面
    openCreateWindow() {
      this.$router.push({
        path:"/workload/create",
        query: {
            obj: "DaemonSet",
            // obj: "Deployment",
            // obj: "StatefulSet",
          }
        })
    },
    getCMKeys(namespace,configmap){
        let getCmData = {
          name: configmap,
          namespace: namespace
        }
        getConfigMapsDetailReq(getCmData).
        then(res=>{
          for(let key in res.data.data){
            this.tsKeys.push(key)
            // console.log("获取到：",key)
          }
        }).catch(res=>{
          console.log(res.err)
        })
    },
    getCreateData(){
        getNodes().then(res=>{
          for(let i in res.data.items){
            this.nodes.push(res.data.items[i].metadata.name)
          }
          // console.log(res.data.items[0].metadata.name)
          // this.nodes=[]
        }).catch((_)=>{
          this.nodes=[]
        })
    },
    addPorts(ports){
        ports.push(
          {
                portName:"",
                containerPort:"",
                protocol:"",
                hostportStatus:false,
                hostPort:"",
                hostIP:""
          }
        )
      
    },
    rmCPorts(ports){
      if(ports.length>1){
        ports.pop()
      }
    },
    addVolumes(volumes){
        volumes.push(
          {
              //是否选择特定键
              radio:"1",
              volumeName:"",
              type:"",
              context:"",
              mode: 400,
              itemArr: [
                {
                  key: '',
                  path: '',
                  mode: ''
                }
              ],
              mountVolumeArr: [
                {
                  name: '',
                  mountPath: '',
                  readOnly: false,
                  subPath: ''
                }
              ]
            }
        )
        console.log("挂载卷长度为：",this.volumess)
    },
    rmVolumes(volumes){
      if(volumes.length>1){
        volumes.pop()
      }
    },
    addMount(mounts){
        mounts.push({
                name: "",
                mountPath: "",
                readOnly: false,
                subPath: ""
        })
        
    },
    rmMount(mounts){
      if(mounts.length>1){
        mounts.pop()
      }
    },
    addItems(items){
        items.push(
          {
              key: "",
              path: "",
              mode:"",
          }
        )
    },
    rmItems(items){
      if(items.length>1){
        items.pop()
      }
    },
    rmContainers(){
      if(this.containerArr.length > 1){
        this.containerArr.pop()
      }
    },
    addContainers(containers){
        console.log("当前容器组为：",this.containerArr)
        containers.push(
          {
          dataVolumes: Math.random().toString(36).substring(2, 10),  //8位随机字符串
          portsArr:Math.random().toString(36).substring(2, 10),
          name: '',
          image: '',
          imagePullPolicy: '',
          resource:"",
          healthCheck: false,
          healthPath: '',
          portArr: [
            {
                portName:"",
                containerPort:"",
                protocol:"",
                hostportStatus:false,
                hostPort:"",
                hostIP:""
              }
          ],
          envArr: [
            {
              name: '',
              value: ''
            }
          ],
          volumeArr: [
            {
              //是否选择特定键
              radio:"1",
              volumeName:"",
              type:"",
              context:"",
              mode: 400,
              itemArr: [
                {
                  key: '',
                  path: '',
                  mode: ''
                }
              ],
              mountVolumeArr: [
                {
                  name: '',
                  mountPath: '',
                  readOnly: false,
                  subPath: ''
                }
              ]
            }
          ]
        }
        )
    },
      //根据类型获取数据卷
    getVolumes(type){
        this.volumes=[]
        let getVolumeData = {
          name:"",
          namespace:this.createDaemonSet.namespace,
          limit:"",
          page:"",
        }
        switch (type) {
        case 'configMap':
          console.log("cm的namespace:",)
          getConfigMapsReq(getVolumeData).then(res=>{
            for(let key in res.data.items){
              this.volumes.push(res.data.items[key].metadata.name)
            }
          }).catch(res=>{
            console.log(res.err)
          })
          break;
        case 'PersistentVolumeClaim':
          getPvcsReq(getVolumeData).then(res=>{
            for(let key in res.data.items){
              this.volumes.push(res.data.items[key].metadata.name)
            }
          }).catch(res=>{
            console.log(res.err)
          })
          break;
        case 'Secret':
          getSecretsReq(getVolumeData).then(res=>{
            // console.log("aaaaaa",res.data.Items)
              for(let key in res.data.Items){
                this.volumes.push(res.data.Items[key].metadata.name)
                // console.log("aaaaaa",res)
              }
            }).catch(res=>{
              console.log(res.err)
            })
          break;
        default:
      }
    },
      //组装data
    addvalue(envs){
        this.envIndex.push(1)
        envs.push(
          {
            name: "",
            value: ""
          }
        )
      console.log("环境变量为：",envs)
    },
    rmvalue(envs){
      if(envs.length>1){
        envs.pop()
      }
      console.log(envs)
    },
    //处理抽屉的关闭，double check 增加体验
    handleClose(done) {
      this.$confirm("还有未保存的工作哦确定关闭吗？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    //获取namespace列表
    getNamespaces() {
      getNamespacesReq()
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
    //获取daemonset列表
    getDaemonSets() {
      // 组装过滤条件
      this.getDaemonSetData.params.name = this.input;
      this.getDaemonSetData.params.namespace = this.namespaceValue;
      this.getDaemonSetData.params.page = this.currentPage;
      this.getDaemonSetData.params.limit = this.pagesize;
      console.log("本次请求为：", this.getDaemonSetData.params);

      // 根据过滤条件去发送get请求，重新获取dployemnt列表，为空则返回所有资源
      // params：设置请求参数，会将这些参数附加到URL的查询字符串中，例如：http://127.0.0.1:8999/api/appsv1/getdaemonsets?filter_name=&namespace=huiju&page=1&limit=10
      getDaemonSetsReq(this.getDaemonSetData.params)
        .then((res) => {
          this.daemonsetList = res.data.items;
          this.daemonsetTotal = res.data.total;
          res.data.items.forEach((data) => {
            console.log("获取到：", data);
          });
          // console.log("获取到：", res.data.items.metadata);
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
    //重置表单
    resetForm(formName) {
      //this.$refs可以获取到该表单对象所有组件的值
      // resetFields方法可以重置表单字段的值
      this.$refs[formName].resetFields();
      //this.namespaceValue = "default";
    },
    //提交daemonset参数
    submitForm(formName) {
      this.createDaemonSetFunc();
      //验证表单的每个规则是否通过，通过则调用createDaemonSetFunc，反之返回false
      console.log("容器组为：",this.containerArr)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.createDaemonSetFunc();
        } else {
          return false;
        }
      });
    },
    authLabels(label){
      let reg = new RegExp("(^[A-Za-z]+=[A-Za-z0-9]+).*");
      //如果不匹配
      if (!reg.test(label)) {
        return 2;
      }else{
        let lab = new Map();
        // 将label_str字符串通过","进行分割，返回一个数组存储在a中：例如目前该字符串为："name=test,app=web",那么a就等于["name=test","app=web"]
        let a = label.split(",");
        //遍历a数组中的每个元素
        a.forEach((item) => {
          // item就是每个元素，将每个元素通过"="进行分割，得到一个子字符串数组b，例如，如果当前元素是"name=test"，则b将是["name", "test"]。
          let b = item.split("=");
          // 将分割后的子字符串数组中的第一个元素作为键，第二个元素作为值，存储在上面创建的label对象(map)中。
          lab[b[0]] = b[1];
        });
        return lab
      }
    },
    //创建daemonset
    createDaemonSetFunc(){
      //组装基本数据
      this.createDaemonSetData.name=this.createDaemonSet.name
      this.createDaemonSetData.namespace=this.createDaemonSet.namespace
      this.createDaemonSetData.nodeName=this.createDaemonSet.nodeName
      //组装label
      let label=this.authLabels(this.createDaemonSet.label_str)
      if(label==2){
           console.log("标签填写异常，请确认后重新填写") 
        }else{
          this.createDaemonSetData.label=label
          console.log("标签为：",this.createDaemonSetData.label)
        }
      //组装nodeSelectorLabel
      if(this.createDaemonSet.nodeSelectorLabel!=""){
        let nodelabel=this.authLabels(this.createDaemonSet.nodeSelectorLabel)
        if(nodelabel==2){
          //  this.$message.error({
          //   message: "标签填写异常，请确认后重新填写",
          //   title: "警告"
          //  })
           console.log("节点标签填写异常，请确认后重新填写")
        }else{
          this.createDaemonSetData.nodeSelectorLabel=nodelabel
          console.log("节点标签为：",this.createDaemonSetData.nodeSelectorLabel)
        }
      }
      let vindex=0
      for(let i in this.createDaemonSet.containerArr){
          if(i > 0){
            this.createDaemonSetData.containers[i]={
                 name: "",
                image: "",
                ports: [
                  {
                    portName: "",
                    containerPort: 0,
                    protocol: "",
                    hostportStatus: false,
                    hostPort: "",
                    hostIP: ""
                  }
                ],
                montVolume: [
                  {
                    name: "",
                    mountPath: "",
                    readOnly: false,
                    subPath: ""
                  }
                ],
                envs: [
                  {
                    name: "",
                    value: ""
                  }
                ],
                imagePullpolicy: "",
                cpu: "",
                mem: "",
                healthCheck: false,
                healthPath: ""
            }
          }
          this.createDaemonSetData.containers[i].name=this.createDaemonSet.containerArr[i].name
          this.createDaemonSetData.containers[i].image=this.createDaemonSet.containerArr[i].image
          this.createDaemonSetData.containers[i].imagePullpolicy=this.createDaemonSet.containerArr[i].imagePullPolicy
          this.createDaemonSetData.containers[i].healthCheck=this.createDaemonSet.containerArr[i].healthCheck
          this.createDaemonSetData.containers[i].healthPath=this.createDaemonSet.containerArr[i].healthPath
          if(this.createDaemonSet.containerArr[i].resource!=""){
            console.log("资源值：",this.createDaemonSet.containerArr[i].resource)
            let resourceList = this.createDaemonSet.containerArr[i].resource.split("/");
            let cpu,memory=""
            cpu = resourceList[0];
            memory = resourceList[1] + "Gi";
            this.createDaemonSetData.containers[i].cpu=cpu
            this.createDaemonSetData.containers[i].mem=memory
          }
          for(let j in this.createDaemonSet.containerArr[i].portArr){
            this.createDaemonSetData.containers[i].ports[j]=this.createDaemonSet.containerArr[i].portArr[j]
          }
          for(let j in this.createDaemonSet.containerArr[i].envArr){
            this.createDaemonSetData.containers[i].envs[j]=this.createDaemonSet.containerArr[i].envArr[j]
          }
          console.log("卷数据为：",this.createDaemonSet.containerArr[i].volumeArr)
          for(let v in this.createDaemonSet.containerArr[i].volumeArr){
            if(vindex > 0){
              this.createDaemonSetData.volume[vindex]=
                {
                  volumeName: "",
                  type: "",
                  context: "",
                  mode: 0,
                  items: [
                    {
                      key: "",
                      path: "",
                      mode: 0
                    }
                  ]
                }
            }
            console.log("卷名为：",this.createDaemonSet.containerArr[i].volumeArr[v].volumeName)
            //组装卷组
            this.createDaemonSetData.volume[vindex].volumeName=this.createDaemonSet.containerArr[i].volumeArr[v].volumeName
            this.createDaemonSetData.volume[vindex].type=this.createDaemonSet.containerArr[i].volumeArr[v].type
            this.createDaemonSetData.volume[vindex].context=this.createDaemonSet.containerArr[i].volumeArr[v].context
            this.createDaemonSetData.volume[vindex].mode=this.createDaemonSet.containerArr[i].volumeArr[v].mode
            this.createDaemonSetData.volume[vindex].items=this.createDaemonSet.containerArr[i].volumeArr[v].itemArr
            vindex++
          }
           //组装挂载组
          let mindex = 0
          for(let vv in this.createDaemonSet.containerArr[i].volumeArr){
            for(let m in this.createDaemonSet.containerArr[i].volumeArr[vv].mountVolumeArr){
              this.createDaemonSetData.containers[i].montVolume[mindex]=this.createDaemonSet.containerArr[i].volumeArr[vv].mountVolumeArr[m]
              mindex++
            }
          }

      }
      console.log("创建的daemonset为：",this.createDaemonSetData)
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
      this.getDaemonSets();
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      console.log("当前页: ", this.currentPage);
      this.getDaemonSets();
    },
    //删除daemonset
    deleteDaemonSet(obj) {
      console.log("将删除：", obj, "namespace为：", this.namespaceValue);
      this.deleteDaemonSetData.params.name = obj;
      this.deleteDaemonSetData.params.namespace = this.namespaceValue;
      deleteDaemonSetReq(this.deleteDaemonSetData.params)
        .then((res) => {
          this.$message({
            type: "success",
            message: name + "删除成功",
          });
          // 删除之后重新获取下该namespace的daemonset列表
          this.getDaemonSets();
        })
        .catch((res) => {
          this.$message({
            type: "info",
            message: name + "删除失败",
          });
        });
    },
    //操作类提示框：重启、删除..
    handleConfirm(name, play, playFunc) {
      this.$confirm(
        "确认继续" + play + "DaemonSet [" + name + "] 操作吗？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
        }
      )
        .then(() => {
          playFunc(name);
          this.$message({
            type: "success",
            message: name + "已" + play,
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消" + play,
          });
        });
    },
    //扩缩容之前获取到的当前daemonset的副本数
    getreplcanum(objnum, name) {
      this.scaleDaemonSetData.params.name = name;
      this.scaleDaemonSetData.params.namespace = this.namespaceValue;
      this.num = objnum;
    },
    //获取daemonset详情
    getDaemonSetDetail(obj) {
      this.daemonsetDetailData.params.name = obj.metadata.name;
      if (this.namespaceValue != "") {
        this.daemonsetDetailData.params.namespace = this.namespaceValue;
      }
      this.daemonsetDetailData.params.namespace = obj.metadata.namespace;
      getDaemonSetsDetailReq(this.daemonsetDetailData.params)
        .then((res) => {
          console.log("daemonset详情为：", res.data);
          this.contentYaml = this.jsontoyaml(res.data);
          this.yamlDialog = true;
        })
        .catch((res) => {
          console.log("获取详情失败：", res.err);
        });
    },
    //更新daemonset
    updateDaemonSet() {
      this.updateDaemonSetData.params.namespace = this.namespaceValue;
      // 先将yaml转为对象，再将对象通过JSON.stringify转为json类型数据
      this.updateDaemonSetData.params.content = JSON.stringify(
        yaml2obj.load(this.contentYaml)
      );
      updateDaemonSetsReq(this.updateDaemonSetData.params)
        .then((res) => {
          this.$message({
            type: "success",
            message: name + res.msg,
          });
          // 更新完yaml之后，获取最新的数据
          this.getDaemonSets();
          this.yamlDialog = false;
        })
        .catch((res) => {
          this.$message({
            type: "info",
            message: name + res.err,
          });
          this.yamlDialog = false;
        });
    },
    //json转yaml
    jsontoyaml(jsondata) {
      return json2yaml.stringify(jsondata);
    },
    //yaml转对象
    yamltoObj(yamldata) {
      return yaml2obj.load(yaml2obj);
    },
    //yaml内容变化后调用,val不用传入，自动会获取更新后的yaml内容
    onChange(val) {
      this.contentYaml = val;
    },
  },
  //watch是一个选项对象，用于监听数据的变化。
  watch: {
    //监听namespace的值,若发生变化，则执行handler方法中的内容
    namespaceValue: {
      handler() {
        //将namespace的值存入本地，用于刷新页面或者path切换后依旧能获取得之前设置的namespace值
        localStorage.setItem("namespace", this.namespaceValue);
        // 页面刷新或切换的时候，把页数重新置为1并且重新获取daemonset列表
        this.currentPage = 1;
        this.getDaemonSets();
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

    //获取daemonset列表
    if (this.namespaceValue == "") {
      this.getDaemonSets();
    }
  },
};
</script>

<style scoped>
/* 卡片属性 */
.deploy-head-card,
.deploy-body-card {
  border-radius: 1px;
  margin-bottom: 5px;
}
.deploy-create-form {
  width: 100%;
}
.deploy-head-card,
.deploy-body-card {
  border-radius: 1px;
  margin-bottom: 5px;
}

/* daemonset鼠标悬停 */
/* :hover：这是一个伪类选择器，表示当鼠标悬停在元素上时应用样式。
    color: rgb(84, 138, 238);：这行代码将文本颜色设置为RGB值为(84, 138, 238)的蓝色。换句话说，当鼠标悬停在元素上时，元素的文本颜色将变为蓝色。
    cursor: pointer;：这行代码将鼠标指针的样式设置为指针形状，表示该元素可以被点击或具有交互性。 */
.deploy-body-deployname:hover {
  color: rgb(84, 138, 238);
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
}
.time {
  font-size: 13px;
  color: rgb(145, 143, 143);
}
.deploy-create-form{
  width: 100%;
}
.allFont{
  font-size: 16px;
}
</style>
