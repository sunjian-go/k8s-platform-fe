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
                  <el-button
                    icon="Edit"
                    type="primary"
                    style="border-radius: 4px"
                    @click="drawer = true"
                    v-loading.fullscreen.lock="fullscreenLoading"
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
                    @click="getDeployments()"
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
              :data="deploymentList"
              style="width: 100%; fint-size: 12px"
              v-loading="appLoading"
            >
              <!-- 此空列相当于第一列前面的占位符，为了美观 -->
              <el-table-column width="20" />
              <!-- align="left"  往左排列 -->
              <el-table-column label="Deployment" align="left">
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
                      }}: {{ val.name }}</span
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
                        getDeploymentDetail(scope.row), (yamlDialog = true)
                      "
                      >YAML</el-button
                    >

                    <el-button
                      type="primary"
                      icon="Plus"
                      @click="
                        getreplcanum(
                          scope.row.spec.replicas,
                          scope.row.metadata.name
                        ),
                          (scalestatus = true)
                      "
                      >扩缩</el-button
                    >
                    <el-button
                      type="primary"
                      icon="RefreshLeft"
                      @click="
                        handleConfirm(
                          scope.row.metadata.name,
                          '重启',
                          restartDeployment
                        )
                      "
                      >重启</el-button
                    >
                    <el-button
                      type="danger"
                      icon="Delete"
                      @click="
                        handleConfirm(
                          scope.row.metadata.name,
                          '删除',
                          deleteDeployment
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
            :current-page="getDeploymentData.params.page"
            :page-size="getDeploymentData.params.limit"
            :page-sizes="pageList"
            :small="small"
            :disabled="disabled"
            :background="background"
            layout="total, sizes, prev, pager, next, jumper"
            :total="deploymentTotal"
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
    >
      <!-- 插槽：抽屉标题  -->
      <template #header>
        <span style="font-weight: bold; font-size: 18px">创建Deployment</span>
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
            <el-form
              label-width="80px"
              ref="createDeployment"
              :rules="createDeploymentRules"
              :model="createDeployment"
            >
              <el-form-item label="名称" prop="name" class="deploy-create-form">
                <el-input v-model="createDeployment.name"></el-input>
              </el-form-item>
              <el-form-item
                label="命名空间"
                prop="namespace"
                class="deploy-create-form"
              >
                <el-select
                  v-model="createDeployment.namespace"
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
              <el-form-item label="副本数" prop="replicas" style="width: 90%">
                <el-input-number
                  v-model="createDeployment.replicas"
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
                    <el-icon style="width: 2em; font-size: 18px; color: #4795ee"
                      ><WarningFilled
                    /></el-icon>
                  </template>
                </el-popover>
              </el-form-item>
              <el-form-item
                label="镜像"
                prop="image"
                class="deploy-create-form"
              >
                <el-input v-model="createDeployment.image"></el-input>
              </el-form-item>
              <el-form-item
                label="标签"
                prop="label_str"
                class="deploy-create-form"
              >
                <!-- placeholder: 用来在输入框显示提示信息 -->
                <el-input
                  v-model="createDeployment.label_str"
                  placeholder="示例: project=ms,app=gateway"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="资源配额"
                prop="resource"
                class="deploy-create-form"
              >
                <el-select
                  v-model="createDeployment.resource"
                  style="width: 100%"
                  placeholder="cpu/mem"
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
              <el-form-item
                label="容器端口"
                prop="container_port"
                class="deploy-create-form"
              >
                <el-input
                  v-model="createDeployment.container_port"
                  placeholder="示例：80"
                ></el-input>
              </el-form-item>
              <el-form-item label="健康检查" class="deploy-create-form">
                <!-- el-switch 开关按钮 -->
                <el-switch v-model="createDeployment.health_check" />
              </el-form-item>
              <el-form-item label="检查路径" class="deploy-create-form">
                <el-input v-model="createDeployment.health_path"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </template>
      <template #footer>
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="submitForm('createDeployment')"
          >立即创建</el-button
        >
      </template>
    </el-drawer>
    <!-- yaml编辑器 -->
    <el-dialog title="YAML信息" v-model="yamlDialog" width="45%" top="5%">
      <!--:options 编辑器的配置  -->
      <!-- @change 内容变化后会触发 -->
      <codemirror
        :value="contentYaml"
        border
        :options="cmOptions"
        height="500"
        style="font-size: 14px"
        @change="onChange"
      ></codemirror>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="yamlDialog = false">取 消</el-button>
          <el-button type="primary" @click="updateDeployment()"
            >更 新</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- 扩缩容弹出框 -->
    <el-dialog title="副本数调整" v-model="scalestatus" width="25%" top="5%">
      <el-row>
        <el-col :span="24" style="display: flex; justify-content: center">
          <span style="display: flex; align-items: center; font-size: 16px"
            >实例数：</span
          >
          <el-input-number
            v-model="num"
            :min="0"
            :max="10"
            style="width: 50%"
          ></el-input-number>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="scalestatus = false">取 消</el-button>
          <el-button type="primary" @click="scaleDeployment">确 定</el-button>
        </span>
      </template>
    </el-dialog>
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
      namespaceValue: "",
      namespaceList: [],
      namespaceListUrl: common.k8sNamespaceList,
      input: "",
      drawer: false,
      direction: "rtl",
      resources: ["0.5/1", "1/2", "2/4", "4/8"],
      fullscreenLoading: false,
      createDeployment: {
        name: "",
        namespace: "",
        replicas: 1,
        image: "",
        resource: "",
        health_check: false,
        health_path: "",
        label_str: "",
        label: {},
        container_port: "",
      },
      //发送请求时的参数
      createDeploymentData: {
        url: common.K8sCreateDeployment,
        params: {
          name: "",
          namespace: "",
          img: "",
          replicas: 0,
          label: {},
          cpu: "",
          mem: "",
          containerPort: 0,
          healthCheck: false,
          healthPath: "",
        },
        deploymentList: [],
      },

      // 定义el-form规则,只有定义了规则的input前面才会有红点,也就是必填项
      createDeploymentRules: {
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
      },
      //列表
      deploymentList: [],
      appLoading: true,
      deploymentTotal: 0,
      getDeploymentData: {
        url: common.K8sDeploymentList,
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
      //重启
      restartDeploymentData: {
        url: common.K8sRestartDeployment,
        params: {
          name: "",
          namespace: "",
        },
      },
      //删除
      deleteDeploymentData: {
        url: common.K8sDeleteDeployment,
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
      deploymentDetail: {},
      deploymentDetailData: {
        url: common.K8sDeploymentDetail,
        params: {
          name: "",
          namespace: "",
        },
      },
      //更新
      updateDeploymentData: {
        url: common.K8sUpdateDeployment,
        params: {
          namespace: "",
          content: "",
        },
      },
      //扩缩容
      scalestatus: false,
      num: 0,
      scale_Name: "",
      dialogVisible: false,
      scaleDeploymentData: {
        url: common.K8sScaleDeployment,
        params: {
          name: "",
          namespace: "",
          replca: 0,
        },
      },
    };
  },
  methods: {
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
    //获取deployment列表
    getDeployments() {
      // 组装过滤条件
      this.getDeploymentData.params.name = this.input;
      this.getDeploymentData.params.namespace = this.namespaceValue;
      this.getDeploymentData.params.page = this.currentPage;
      this.getDeploymentData.params.limit = this.pagesize;
      console.log("本次请求为：", this.getDeploymentData.params);

      // 根据过滤条件去发送get请求，重新获取dployemnt列表，为空则返回所有资源
      // params：设置请求参数，会将这些参数附加到URL的查询字符串中，例如：http://127.0.0.1:8999/api/appsv1/getdeployments?filter_name=&namespace=huiju&page=1&limit=10
      httpClient
        .get(this.getDeploymentData.url, {
          params: this.getDeploymentData.params,
        })
        .then((res) => {
          this.deploymentList = res.data.items;
          this.deploymentTotal = res.data.total;
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
    //创建deployment对象
    createDeployFunc() {
      //正则匹配，验证label
      // "(^[A-Za-z]+=[A-Za-z0-9]+).*": 表示匹配以字母开头，后跟一个或多个字母或数字的键值对形式的字符串。其中^表示匹配字符串的开始，
      // [A-Za-z]表示匹配任意一个英文字母，+表示匹配前面的模式一次或多次，[A-Za-z0-9]表示匹配任意一个英文字母或数字，.*表示匹配任意字符零次或多次。
      let reg = new RegExp("(^[A-Za-z]+=[A-Za-z0-9]+).*");
      //如果不匹配
      if (!reg.test(this.createDeployment.label_str)) {
        this.$message.warning({
          message: "标签填写异常，请确认后重新填写",
        });
        return;
      }
      // 开启加载loading动画
      this.fullscreenLoading = true;
      let label = new Map();
      let cpu, memory;
      // 将label_str字符串通过","进行分割，返回一个数组存储在a中：例如目前该字符串为："name=test,app=web",那么a就等于["name=test","app=web"]
      let a = this.createDeployment.label_str.split(",");
      //遍历a数组中的每个元素
      a.forEach((item) => {
        // item就是每个元素，将每个元素通过"="进行分割，得到一个子字符串数组b，例如，如果当前元素是"name=test"，则b将是["name", "test"]。
        let b = item.split("=");
        // 将分割后的子字符串数组中的第一个元素作为键，第二个元素作为值，存储在上面创建的label对象(map)中。
        label[b[0]] = b[1];
      });
      let resourceList = this.createDeployment.resource.split("/");
      cpu = resourceList[0];
      memory = resourceList[1] + "Gi";
      // 先组装好类型一样的数据
      this.createDeploymentData.params.name = this.createDeployment.name;
      this.createDeploymentData.params.namespace =
        this.createDeployment.namespace;
      this.createDeploymentData.params.img = this.createDeployment.image;
      this.createDeploymentData.params.replicas =
        this.createDeployment.replicas;
      //然后开始把个别特殊的数据重新组装一遍
      // parseInt：将字符串转为整数
      this.createDeploymentData.params.containerPort = parseInt(
        this.createDeployment.container_port
      );
      //把上面调好的数据进行组装
      this.createDeploymentData.params.label = label;
      this.createDeploymentData.params.cpu = cpu;
      this.createDeploymentData.params.mem = memory;
      console.log("发送前：", this.createDeploymentData.params);
      //组装好数据后开始创建
      httpClient
        .post(this.createDeploymentData.url, this.createDeploymentData.params)
        .then((res) => {
          this.$message.success({
            message: res.msg,
          });
          // 创建之后重新获取下该namespace的deployment列表
          this.getDeployments();
        })
        .catch((res) => {
          this.$message.error({
            message: res.err,
          });
        });
      //重置表单，无论创建成功与否，都会重置表单
      this.resetForm("createDeployment");
      //关闭动画加载和抽屉
      this.fullscreenLoading = false;
      this.drawer = false;
    },
    //重置表单
    resetForm(formName) {
      //this.$refs可以获取到该表单对象所有组件的值
      // resetFields方法可以重置表单字段的值
      this.$refs[formName].resetFields();
      //this.namespaceValue = "default";
    },
    //提交deployment参数
    submitForm(formName) {
      //验证表单的每个规则是否通过，通过则调用createDeployFunc，反之返回false
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.createDeployFunc();
        } else {
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
      this.getDeployments();
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      console.log("当前页: ", this.currentPage);
      this.getDeployments();
    },
    //重启deployment
    restartDeployment(obj) {
      console.log("将重启：", obj, "namespace为：", this.namespaceValue);
      this.restartDeploymentData.params.name = obj;
      this.restartDeploymentData.params.namespace = this.namespaceValue;
      httpClient
        .put(this.restartDeploymentData.url, this.restartDeploymentData.params)
        .then((res) => {
          this.$message({
            type: "success",
            message: name + "重启成功",
          });
          // 重启之后重新获取下该namespace的deployment列表
          this.getDeployments();
        })
        .catch((res) => {
          this.$message({
            type: "info",
            message: name + "重启失败",
          });
        });
    },
    //删除deployment
    deleteDeployment(obj) {
      console.log("将删除：", obj, "namespace为：", this.namespaceValue);
      this.deleteDeploymentData.params.name = obj;
      this.deleteDeploymentData.params.namespace = this.namespaceValue;
      httpClient
        .delete(this.deleteDeploymentData.url, {
          params: this.deleteDeploymentData.params,
        })
        .then((res) => {
          this.$message({
            type: "success",
            message: name + "删除成功",
          });
          // 删除之后重新获取下该namespace的deployment列表
          this.getDeployments();
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
        "确认继续" + play + "Deployment [" + name + "] 操作吗？",
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
    //扩缩容之前获取到的当前deployment的副本数
    getreplcanum(objnum, name) {
      this.scaleDeploymentData.params.name = name;
      this.scaleDeploymentData.params.namespace = this.namespaceValue;
      this.num = objnum;
    },
    //扩缩容deployment
    scaleDeployment() {
      this.scaleDeploymentData.params.replca = this.num;
      console.log("扩缩容的对象为：", this.scaleDeploymentData.params);
      httpClient
        .put(this.scaleDeploymentData.url, this.scaleDeploymentData.params)
        .then((res) => {
          this.$message({
            type: "success",
            message: res.msg,
          });
          this.getDeployments();
          this.scalestatus = false;
        })
        .catch((res) => {
          this.$message({
            type: "info",
            message: res.err,
          });
          this.scalestatus = false;
        });
    },
    //获取deployment详情
    getDeploymentDetail(obj) {
      this.deploymentDetailData.params.name = obj.metadata.name;
      if (this.namespaceValue != "") {
        this.deploymentDetailData.params.namespace = this.namespaceValue;
      }
      this.deploymentDetailData.params.namespace = obj.metadata.namespace;
      httpClient
        .get(this.deploymentDetailData.url, {
          params: this.deploymentDetailData.params,
        })
        .then((res) => {
          console.log("deployment详情为：", res.data);
          this.contentYaml = this.jsontoyaml(res.data);
          this.yamlDialog = true;
        })
        .catch((res) => {
          console.log("获取详情失败：", res.err);
        });
    },
    //更新deployment
    updateDeployment() {
      this.updateDeploymentData.params.namespace = this.namespaceValue;
      // 先将yaml转为对象，再将对象通过JSON.stringify转为json类型数据
      this.updateDeploymentData.params.content = JSON.stringify(
        yaml2obj.load(this.contentYaml)
      );
      httpClient
        .put(this.updateDeploymentData.url, this.updateDeploymentData.params)
        .then((res) => {
          this.$message({
            type: "success",
            message: name + res.msg,
          });
          // 更新完yaml之后，获取最新的数据
          this.getDeployments();
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
      return yaml2obj.load(yamldata);
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
        // 页面刷新或切换的时候，把页数重新置为1并且重新获取deployment列表
        this.currentPage = 1;
        this.getDeployments();
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
    //获取deployment列表
    this.getDeployments();
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
  width: 80%;
}
.deploy-head-card,
.deploy-body-card {
  border-radius: 1px;
  margin-bottom: 5px;
}

/* deployment鼠标悬停 */
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
</style>
