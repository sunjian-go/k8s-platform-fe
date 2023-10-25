<template>
  <div>
    <el-row>
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
                <el-button type="" @click="refulshButton()">
                  <el-icon><RefreshLeft /></el-icon>
                  <span>刷新</span>
                </el-button>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-col>
      <!-- 头部2 -->
      <el-col :span="24">
        <div>
          <el-card
            class="deploy-body-card"
            shadow="never"
            :body-style="{ padding: '10px' }"
          >
            <el-row>
              <el-col :span="6">
                <div>
                  <el-button
                    icon="Edit"
                    type="primary"
                    style="border-radius: 4px"
                    v-loading.fullscreen.lock="fullscreenLoading"
                    @click="openbox"
                    >创建</el-button
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
          <el-card shadow="never" :body-style="{ padding: '10px' }">
            <div>
              <el-table
                :data="ingList"
                style="width: 100%"
                v-loading="apploading"
              >
                <el-table-column width="20" />
                <el-table-column label="Ingress" align="left">
                  <template v-slot="scope">
                    <span
                      style="color: rgb(62, 165, 233)"
                      class="deploy-body-deployname"
                      >{{ scope.row.metadata.name }}</span
                    >
                  </template>
                </el-table-column>
                <el-table-column label="类" align="center">
                  <template v-slot="scope">
                    <el-tag
                      type="success"
                      v-if="scope.row.spec.ingressClassName"
                      >{{ scope.row.spec.ingressClassName }}</el-tag
                    >
                  </template>
                </el-table-column>
                <el-table-column label="hosts" align="center">
                  <template v-slot="scope">
                    <div v-for="(v, i) in scope.row.spec.rules" :key="i">
                      <!-- :content="`${key}: ${val}`" 要想给参数赋值一个变量，必须前面用：绑定该变量才可以用 -->
                      <!-- el-popover: 弹出框 -->
                      <el-popover
                        style="width: 100%"
                        placement="top"
                        :width="300"
                        trigger="hover"
                        :content="`${v.host}`"
                      >
                        <template #reference>
                          <el-tag type="warning">{{ ellipsis(v.host) }}</el-tag>
                        </template>
                      </el-popover>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="address" align="center">
                  <template v-slot="scope">
                    <div v-for="(v, k) in scope.row.metadata" :key="k">
                      <div v-if="k == 'annotations'">
                        <div
                          v-for="(cv, ck) in scope.row.metadata.annotations"
                          :key="ck"
                        >
                          <div v-if="ck == 'field.cattle.io/publicEndpoints'">
                            <span type="">{{
                              strToObj(
                                scope.row.metadata.annotations[
                                  "field.cattle.io/publicEndpoints"
                                ]
                              )[0].addresses[0]
                            }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="端口" align="center">
                  <template v-slot="scope">
                    <div v-for="(v, k) in scope.row.metadata" :key="k">
                      <div v-if="k == 'annotations'">
                        <div
                          v-for="(cv, ck) in scope.row.metadata.annotations"
                          :key="ck"
                        >
                          <div v-if="ck == 'field.cattle.io/publicEndpoints'">
                            <el-tag
                              type=""
                              v-if="
                                strToObj(
                                  scope.row.metadata.annotations[
                                    'field.cattle.io/publicEndpoints'
                                  ]
                                )[0].port != 80
                              "
                              >80,
                              {{
                                strToObj(
                                  scope.row.metadata.annotations[
                                    "field.cattle.io/publicEndpoints"
                                  ]
                                )[0].port
                              }}</el-tag
                            >
                            <el-tag type="" v-else>80</el-tag>
                          </div>
                        </div>
                      </div>
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
                <el-table-column label="操作" align="center" width="300">
                  <template v-slot="scope">
                    <!-- <el-row> -->
                    <!-- <el-col :span="4"> -->
                    <div>
                      <el-button
                        type="primary"
                        icon="Edit"
                        plain
                        @click="
                          getIngressDetail(scope.row), (yamlDialog = true)
                        "
                        >YAML</el-button
                      >
                      <el-button
                        type="danger"
                        icon="Delete"
                        @click="handleConfirm(scope.row, '删除', deleteIng)"
                        >删除</el-button
                      >
                      <!-- </el-col>
                        </el-row> -->
                    </div>
                  </template>
                </el-table-column>
                <el-table-column>
                  <template #header>
                    <el-row :gutter="150">
                      <el-col :span="6"
                        ><el-input
                          placeholder="请输入"
                          v-model="searchValue"
                          style="width: 145px"
                        ></el-input
                      ></el-col>
                      <el-col :span="2"
                        ><el-button type="" @click="getPvs()"
                          >搜索</el-button
                        ></el-col
                      >
                    </el-row>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
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
        :current-page="currentPage"
        :page-size="pagesize"
        :page-sizes="pageList"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="ingtotal"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

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
        <span style="font-weight: bold; font-size: 18px">创建Ingress</span>
      </template>
      <!-- 插槽，抽屉body，填写表单属性 -->
      <template #default>
        <!-- type="flex"  布局模式，可选 flex -->
        <!-- justify="center"  flex布局下的水平排列方式 -->
        <el-row type="flex" justify="center">
          <el-col>
            <!-- ref绑定控件后，js中才能用this.$ref获取该控件 -->
            <!-- rules 定义form表单校验规则 -->
            <!-- label-width 限制左侧标题的宽度 -->
            <el-form
              label-width="80px"
              ref="createIngress"
              :rules="createIngressRules"
              :model="createIngress"
            >
              <!-- prop名字与规则里面的name保持一致 -->
              <el-form-item label="名称" prop="name" class="deploy-create-form">
                <el-input v-model="createIngress.name"></el-input>
              </el-form-item>
              <el-form-item
                label="命名空间"
                prop="namespace"
                class="deploy-create-form"
              >
                <el-select
                  v-model="createIngress.namespace"
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

              <el-form-item
                label="标签"
                prop="label_str"
                class="deploy-create-form"
              >
                <!-- placeholder: 用来在输入框显示提示信息 -->
                <el-input
                  v-model="createIngress.label_str"
                  placeholder="示例：app=test,name=test"
                ></el-input>
              </el-form-item>
              <el-form-item label="域名" prop="host" style="width: 100%">
                <el-input v-model="createIngress.host"></el-input>
              </el-form-item>
            </el-form>
            <div v-for="(v, i) in testarr" :key="i" style="background: #f8f8f5">
              <div style="height: 10px; background: #ffffff"></div>
              <div style="height: 10px; background: #f8f8f5"></div>
              <el-form
                label-width="80px"
                ref="createIngressHost"
                :rules="createIngressRules"
                :model="hostsArr[i]"
              >
                <el-form-item label="主机路径" prop="path" style="width: 95%">
                  <el-input v-model="hostsArr[i].path"></el-input>
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
                    @blur="getSvcs(hostsArr[i].service_name)"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="SVC端口"
                  prop="service_port"
                  style="width: 95%"
                >
                  <el-input v-model="hostsArr[i].service_port"></el-input>
                </el-form-item>
              </el-form>
              <div style="margin-left: 420px">
                <el-button
                  @click="
                    addvalue();
                    submitForm('createIngressHost');
                  "
                  >添加规则</el-button
                >
              </div>
              <div style="height: 15px"></div>
            </div>
          </el-col>
        </el-row>
      </template>
      <template #footer>
        <el-button
          @click="
            drawer = false;
            resetForm('createIngress');
            resetForm('createIngressHost');
          "
          >取消</el-button
        >
        <el-button type="primary" @click="submitForm('createIngress')"
          >立即创建</el-button
        >
      </template>
    </el-drawer>
    <!-- <el-dialog title="创建Ing" v-model="scalestatus" width="25%" top="5%">
      <el-row>
        <el-col :span="24" style="display: flex; justify-content: center">
          <span style="display: flex; align-items: center; font-size: 16px"
            >Ing:
          </span>
          <el-input
            v-model="ing"
            style="width: 50%; padding-left: 10px"
          ></el-input>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="scalestatus = false">取 消</el-button>
          <el-button type="primary" @click="createIng">确 定</el-button>
        </span>
      </template>
    </el-dialog> -->
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
          <el-button type="primary" @click="updateIngress()">更 新</el-button>
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
      direction: "rtl",
      testarr: [1],
      apploading: false,
      namespaceValue: "",
      namespaceList: [],
      namespaceListUrl: common.k8sNamespaceList,
      ingValue: "",
      ingList: [],
      ingtotal: 0,
      getIngData: {
        url: common.K8sGetIngresses,
        params: {
          name: "",
          namespace: "",
          limit: 10,
          page: 1,
        },
      },
      currentPage: 1,
      pagesize: 10,
      pageList: [10, 20, 30, 40],
      small: true,
      disabled: false,
      background: true,
      searchValue: "",
      //创建的时候置为true
      fullscreenLoading: false,
      //弹出框状态码
      scalestatus: false,
      ing: "",
      deleteIngData: {
        url: common.K8sDeleteIngress,
        params: {
          name: "",
          namespace: "",
        },
      },

      createIngressRules: {
        name: [
          {
            required: true,
            message: "请填写名称",
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
        label_str: [
          {
            required: true,
            message: "请填写标签",
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
            message: "请填写Service名字",
            trigger: "change",
          },
        ],
        service_port: [
          {
            required: true,
            message: "请填写Service端口",
            trigger: "change",
          },
        ],
      },
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
          path_type: "ImplementationSpecific",
          service_name: "",
          service_port: "",
        },
      ],
      ingressHosts: [],
      createIngressData: {
        url: common.K8sCreateIngress,
        params: {
          name: "",
          namespace: "",
          label: {},
          hosts: {},
        },
      },
      drawer: false,
      //更新
      updateIngressData: {
        url: common.K8sUpdateIngress,
        params: {
          namespace: "",
          content: "",
        },
      },
      //编辑器配置
      cmOptions: common.cmOptions,
      //详情
      contentYaml: "",
      yamlDialog: false,
      ingressDetail: {},
      ingressDetailData: {
        url: common.K8sGetIngressDetail,
        params: {
          name: "",
          namespace: "",
        },
      },
      getSvcData: {
        url: common.K8sGetSvcs,
        params: {
          name: "",
          namespace: "",
          limit: 10,
          page: 1,
        },
      },
    };
  },
  methods: {
    handleClose(done) {
      this.$confirm("还有未保存的工作哦确定关闭吗？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    alertInfo(name) {
      this.$alert("请先创建Service " + name, "提示", {
        confirmButtonText: "确定",
        // callback: (action) => {
        //   // this.$message({
        //   //   type: "info",
        //   //   message: `action: ${action}`,
        //   // });
        // },
      });
    },
    //获取svc列表
    getSvcs(name) {
      this.getSvcData.params.name = name;
      this.getSvcData.params.namespace = this.createIngress.namespace;
      this.getSvcData.params.page = this.currentPage;
      this.getSvcData.params.limit = this.pagesize;
      this.apploading = true;
      console.log("需要获取的svc是：", this.getSvcData.params);

      httpClient
        .get(this.getSvcData.url, {
          params: this.getSvcData.params,
        })
        .then((res) => {
          // this.svcList = res.data.services;
          // this.svctotal = res.data.total;
          console.log("获取到svc个数为：", this.svctotal);
          this.apploading = false;
          if (res.data.total < 1) {
            this.alertInfo(name);
          }
        })
        .catch((res) => {
          console.log("报错为：", res.err);
          //this.apploading = false;
        });
    },
    //yaml内容变化后调用,val不用传入，自动会获取更新后的yaml内容
    onChange(val) {
      this.contentYaml = val;
    },
    //json转yaml
    jsontoyaml(jsondata) {
      return json2yaml.stringify(jsondata);
    },
    //yaml转对象
    yamltoObj(yamldata) {
      return yaml2obj.load(yamldata);
    },
    //更新ingress
    updateIngress() {
      console.log("准备更新了：", this.contentYaml);
      this.updateIngressData.params.namespace = this.namespaceValue;
      // 先将yaml转为对象，再将对象通过JSON.stringify转为json类型数据
      this.updateIngressData.params.content = JSON.stringify(
        yaml2obj.load(this.contentYaml)
      );
      httpClient
        .put(this.updateIngressData.url, this.updateIngressData.params)
        .then((res) => {
          this.$message({
            type: "success",
            message: name + res.msg,
          });
          // 更新完yaml之后，获取最新的数据
          this.getIngs();
        })
        .catch((res) => {
          this.$message({
            type: "info",
            message: name + res.err,
          });
        })
        .finally(() => {
          this.yamlDialog = false;
        });
    },
    //获取ingress详情
    getIngressDetail(obj) {
      //console.log("获取详情的为：", obj.metadata.name);
      this.ingressDetailData.params.name = obj.metadata.name;
      if (this.namespaceValue != "") {
        this.ingressDetailData.params.namespace = this.namespaceValue;
      }
      this.ingressDetailData.params.namespace = obj.metadata.namespace;
      console.log("准备获取详情的是：", this.ingressDetailData.params);
      httpClient
        .get(this.ingressDetailData.url, {
          params: this.ingressDetailData.params,
        })
        .then((res) => {
          console.log("ingress详情为：", res.data);
          this.contentYaml = this.jsontoyaml(res.data);
          this.yamlDialog = true;
          console.log("ingress详情YAML为：", this.jsontoyaml(res.data));
        })
        .catch((res) => {
          console.log("获取详情失败：", res.err);
        });
    },
    submitForm2(name) {
      console.log("获取到ref: ", this.$refs[name]);
      this.$refs[name][0].validate((valid) => {
        if (valid) {
          //this.createIngressFunc();
          console.log("规则通过：", name);
        } else {
          console.log("规则不通过：", name);
          return false;
        }
      });
    },
    addvalue() {
      this.testarr.push(1);
      // this.hostsArr[index] = this.hosts;
      //往数组内追加index+1的所有key,用来为后面的绑定数组做准备
      this.hostsArr.push({
        path: "",
        path_type: "ImplementationSpecific",
        service_name: "",
        service_port: "",
      });
      //console.log("xxx:", this.hostsArr);
    },
    //提交ingress参数
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
          //this.createIngressFunc();
          this.rulesActions(flag);
          console.log("规则通过：", formName);
        } else {
          console.log("规则不通过：", formName);
          return false;
        }
      });
    },
    rulesActions(flag, hosts) {
      if (flag == 1) {
        this.createIngressFunc();
      }
    },
    hostsArrUpdate(hosts) {
      hosts.service_port = parseInt(hosts.service_port, 10);

      // this.ingressHosts.push(hosts);
      // console.log("插入数组：", this.ingressHosts);
    },
    //创建ingress对象
    createIngressFunc() {
      console.log("准备创建ingress规则为：", this.hostsArr);
      //正则匹配，验证label
      // "(^[A-Za-z]+=[A-Za-z0-9]+).*": 表示匹配以字母开头，后跟一个或多个字母或数字的键值对形式的字符串。其中^表示匹配字符串的开始，
      // [A-Za-z]表示匹配任意一个英文字母，+表示匹配前面的模式一次或多次，[A-Za-z0-9]表示匹配任意一个英文字母或数字，.*表示匹配任意字符零次或多次。
      let reg = new RegExp("(^[A-Za-z]+=[A-Za-z0-9]+).*");
      //如果不匹配
      if (!reg.test(this.createIngress.label_str)) {
        this.$message.warning({
          message: "标签填写异常，请确认后重新填写",
        });
        return;
      }
      // 开启加载loading动画
      this.fullscreenLoading = true;
      let label = new Map();
      // 将label_str字符串通过","进行分割，返回一个数组存储在a中：例如目前该字符串为："name=test,app=web",那么a就等于["name=test","app=web"]
      let a = this.createIngress.label_str.split(",");
      //遍历a数组中的每个元素
      a.forEach((lab) => {
        // item就是每个元素，将每个元素通过"="进行分割，得到一个子字符串数组b，例如，如果当前元素是"name=test"，则b将是["name", "test"]。
        let b = lab.split("=");
        // 将分割后的子字符串数组中的第一个元素作为键，第二个元素作为值，存储在上面创建的label对象(map)中。
        label[b[0]] = b[1];
      });

      // 组装好类型一样的数据
      this.createIngressData.params.name = this.createIngress.name;
      this.createIngressData.params.namespace = this.createIngress.namespace;
      this.createIngressData.params.label = label;
      this.createIngressData.params.hosts[this.createIngress.host] =
        this.hostsArr;
      for (let i in this.createIngressData.params.hosts[
        this.createIngress.host
      ]) {
        this.createIngressData.params.hosts[this.createIngress.host][
          i
        ].service_port = parseInt(
          this.createIngressData.params.hosts[this.createIngress.host][i]
            .service_port,
          10
        );
      }
      console.log("组装好数据为：", this.createIngressData.params);

      // 组装好数据后开始创建
      httpClient
        .post(this.createIngressData.url, this.createIngressData.params)
        .then((res) => {
          this.$message.success({
            message: res.msg,
          });
          this.getIngs();
        })
        .catch((res) => {
          this.$message.error({
            message: res.err,
          });
        })
        //.finally无论成功与否都会执行
        .finally(() => {
          //重置表单，无论创建成功与否，都会重置表单
          this.resetForm("createIngress");
          this.resetForm("createIngressHost");
          this.fullscreenLoading = false;
          //关闭动画加载和抽屉
          this.drawer = false;
        });
    },
    //重置表单
    resetForm(formName) {
      //this.$refs可以获取到该表单对象所有组件的值
      // resetFields方法可以重置表单字段的值
      // this.$refs[formName].resetFields();
      let inner = this.$refs[formName];
      if (formName == "createIngressHost") {
        inner = this.$refs[formName][0];
      }
      inner.resetFields();
      this.testarr = [1];
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
    //转换时间戳
    timeTrans(timestamp) {
      let date = new Date(new Date(timestamp).getTime() + 8 * 3600 * 1000);
      date = date.toJSON();
      date = date.substring(0, 19).replace("T", " ");
      return date;
    },
    //labels显示长度限制
    ellipsis(labels) {
      // 判断lables的长度是否大于15，为true则0-20位正常显示，之后的显示...，为false则直接返回值
      return labels.length > 20 ? labels.substring(0, 25) + "..." : labels;
    },
    //获取ing列表
    getIngs() {
      this.getIngData.params.name = this.searchValue;
      this.getIngData.params.namespace = this.namespaceValue;
      this.getIngData.params.limit = this.pagesize;
      this.getIngData.params.page = this.currentPage;
      console.log("开始获取：", this.getIngData.params);
      this.apploading = true;
      httpClient
        .get(this.getIngData.url, {
          params: this.getIngData.params,
        })
        .then((res) => {
          this.ingList = res.data.items;
          this.ingtotal = res.data.total;
          console.log("获取到：", this.ingList, this.ingtotal);
        })
        .catch((res) => {
          console.log("报错为：", res.err);
        })
        .finally(() => {
          this.apploading = false;
        });
    },
    //分页
    handleSizeChange(size) {
      console.log(`每页 ${size} 条`);
      this.pagesize = size;
      this.getIngs();
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      console.log("当前页: ", this.currentPage);
      this.getIngs();
    },
    //刷新
    refulshButton() {
      this.searchValue = "";
      this.namespaceValue = "";
      this.getIngs();
    },
    //将创建弹出框的状态码置为true
    openbox() {
      this.drawer = true;
    },
    //创建ing
    createIng() {
      //this.fullscreenLoading = true;
      alert("等待后续开发");
      this.scalestatus = false;
    },
    //删除ing
    deleteIng(row) {
      console.log("要删除的name是：", row.metadata.name);
      this.deleteIngData.params.name = row.metadata.name;
      this.deleteIngData.params.namespace = row.metadata.namespace;
      httpClient
        .delete(this.deleteIngData.url, {
          params: this.deleteIngData.params,
        })
        .then((res) => {
          this.$message({
            type: "success",
            message: row.metadata.name + "删除成功",
          });
          this.getIngs();
        })
        .catch((res) => {
          this.$message({
            type: "error",
            message: row.metadata.name + "删除失败",
          });
        });
    },
    //操作类提示框：重启、删除..
    handleConfirm(row, play, playFunc) {
      this.$confirm(
        "确认继续" + play + "Ingress [" + row.metadata.name + "] 操作吗？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
        }
      )
        .then(() => {
          playFunc(row);
          this.$message({
            type: "success",
            message: row.metadata.name + "已" + play,
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消" + play,
          });
        });
    },
    //字符串转对象
    strToObj(str) {
      console.log("debug: ", str);
      return JSON.parse(str);
    },
  },
  beforeMount() {
    this.getNamespaces();
    this.getIngs();
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
    this.getIngs();
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
        this.getIngs();
      },
    },
  },
};
</script>
<style>
/* 卡片属性 */
.deploy-head-card,
.deploy-body-card {
  border-radius: 1px;
  margin-bottom: 5px;
}
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
