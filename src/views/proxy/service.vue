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
              <!-- row-key 用来定义行数据的key，结合expand-row-keys使用，往expandKeys中增加key来展开行 ,getRowKeys方法里面自带一个参数代表当前行对象-->
              <!-- expand-row-keys 展开的行的key数组,只有在 expand-row-keys 中的行才会被默认展开 -->
              <!-- expand-change 展开触发时，调用这个方法;该方法自动传入两个参数，分别是当前行对象，和当前展开行的数组 ，属于原生功能-->
              <el-table
                :data="svcList"
                style="width: 100%"
                v-loading="apploading"
                :row-key="getRowKeys"
                :expand-row-keys="expandKeys"
                @expand-change="expandChange"
              >
                <el-table-column width="20" />
                <el-table-column label="Svc" align="left">
                  <template v-slot="scope">
                    <span
                      style="color: rgb(62, 165, 233)"
                      class="deploy-body-deployname"
                      >{{ scope.row.metadata.name }}</span
                    >
                  </template>
                </el-table-column>
                <el-table-column label="类型" align="center">
                  <template v-slot="scope">
                    <el-tag type="success">{{ scope.row.spec.type }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="CLUSTER-IP" align="center">
                  <template v-slot="scope">
                    <span type="">{{ scope.row.spec.clusterIP }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="EXTERNAL-IP" align="center">
                  <template v-slot="scope">
                    <div v-if="scope.row.spec.type == 'LoadBalancer'">
                      <div
                        v-for="(v, i) in scope.row.status.loadBalancer.ingress"
                        :key="i"
                      ></div>
                      <span>
                        {{ v }}
                      </span>
                    </div>
                    <div v-else-if="scope.row.spec.type != 'LoadBalancer'">
                      <span type="">none</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="端口" align="center">
                  <template v-slot="scope">
                    <div v-for="(v, i) in scope.row.spec.ports" :key="i">
                      <el-tag v-if="scope.row.spec.type == 'ClusterIP'" type=""
                        >{{ v.targetPort }}/{{ v.protocol }}</el-tag
                      >
                      <el-tag
                        v-else-if="scope.row.spec.type == 'NodePort'"
                        type=""
                        >{{ v.targetPort }}/{{ v.protocol }},
                        {{ v.targetPort }}:{{ v.nodePort }}/{{
                          v.protocol
                        }}</el-tag
                      >
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center">
                  <template v-slot="scope">
                    <span>{{
                      timeTrans(scope.row.metadata.creationTimestamp)
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="200">
                  <template v-slot="scope">
                    <!-- <el-row> -->
                    <!-- <el-col :span="4"> -->
                    <el-button
                      type="danger"
                      icon="Delete"
                      @click="
                        handleConfirm(
                          scope.row.metadata.name,
                          '删除',
                          deleteSvc
                        )
                      "
                      >删除</el-button
                    >
                    <!-- </el-col>
                      </el-row> -->
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
        :total="svctotal"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog title="创建Svc" v-model="scalestatus" width="25%" top="5%">
      <el-row>
        <el-col :span="24" style="display: flex; justify-content: center">
          <span style="display: flex; align-items: center; font-size: 16px"
            >Svc:
          </span>
          <el-input
            v-model="svc"
            style="width: 50%; padding-left: 10px"
          ></el-input>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="scalestatus = false">取 消</el-button>
          <el-button type="primary" @click="createSvc">确 定</el-button>
        </span>
      </template>
    </el-dialog>
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
      <template #title>
        <span style="font-weight: bold; font-size: 18px">创建Service</span>
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
              ref="createService"
              :rules="createServiceRules"
              :model="createService"
            >
              <!-- prop名字与规则里面的name保持一致 -->
              <el-form-item label="名称" prop="name" class="deploy-create-form">
                <el-input v-model="createService.name"></el-input>
              </el-form-item>
              <el-form-item
                label="命名空间"
                prop="namespace"
                class="deploy-create-form"
              >
                <el-select
                  v-model="createService.namespace"
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
              <el-form-item label="类型" prop="type" style="width: 90%">
                <el-select
                  v-model="createService.type"
                  filterable
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(v, i) in svcTypes"
                    :key="i"
                    :label="v"
                    :value="v"
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
                  v-model="createService.label_str"
                  placeholder="示例：app=test,name=test"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="容器端口"
                prop="container_port"
                class="deploy-create-form"
              >
                <el-input
                  v-model="createService.container_port"
                  placeholder="示例：80"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="pod端口"
                prop="port"
                class="deploy-create-form"
              >
                <el-input
                  v-model="createService.port"
                  placeholder="示例：80"
                ></el-input>
              </el-form-item>
              <el-form-item
                v-if="createService.type == 'NodePort'"
                label="NodePort"
                class="deploy-create-form"
              >
                <el-input
                  v-model="createService.node_port"
                  placeholder="示例：80 (不写默认随机端口)"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </template>
      <template #footer>
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="submitForm('createService')"
          >立即创建</el-button
        >
      </template>
    </el-drawer>
  </div>
</template>
<script>
import common from "../common/Config";
import httpClient from "../../utils/request";
export default {
  data() {
    return {
      apploading: true,
      namespaceValue: "",
      namespaceList: [],
      namespaceListUrl: common.k8sNamespaceList,
      svcValue: "",
      svcList: [],
      svctotal: 0,
      getSvcData: {
        url: common.K8sGetSvcs,
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
      svc: "",
      deleteSvcData: {
        url: common.K8sDeleteSvc,
        params: {
          name: "",
          namespace: "",
        },
      },
      drawer: false,
      // 定义el-form规则,只有定义了规则的input前面才会有红点,也就是必填项
      // 规则名要与结构体中的名字保持一致
      createServiceRules: {
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
        type: [
          {
            required: true,
            message: "请选择类型",
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
            message: "请填pod端口",
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
      },

      createService: {
        name: "",
        namespace: "",
        type: "",
        container_port: "0",
        port: "",
        node_port: "",
        label_str: "",
        label: {},
      },
      svcTypes: ["ClusterIP", "NodePort", "LoadBalancer"],
      createServiceData: {
        url: common.K8sCreateSvc,
        params: {
          name: "",
          namespace: "",
          type: "",
          container_port: 0,
          port: 0,
          node_port: 0,
          label: {},
        },
      },
    };
  },
  methods: {
    //创建service对象
    createServiceFunc() {
      //正则匹配，验证label
      // "(^[A-Za-z]+=[A-Za-z0-9]+).*": 表示匹配以字母开头，后跟一个或多个字母或数字的键值对形式的字符串。其中^表示匹配字符串的开始，
      // [A-Za-z]表示匹配任意一个英文字母，+表示匹配前面的模式一次或多次，[A-Za-z0-9]表示匹配任意一个英文字母或数字，.*表示匹配任意字符零次或多次。
      let reg = new RegExp("(^[A-Za-z]+=[A-Za-z0-9]+).*");
      //如果不匹配
      if (!reg.test(this.createService.label_str)) {
        this.$message.warning({
          message: "标签填写异常，请确认后重新填写",
        });
        return;
      }
      // 开启加载loading动画
      this.fullscreenLoading = true;
      let label = new Map();
      // 将label_str字符串通过","进行分割，返回一个数组存储在a中：例如目前该字符串为："name=test,app=web",那么a就等于["name=test","app=web"]
      let a = this.createService.label_str.split(",");
      //遍历a数组中的每个元素
      a.forEach((lab) => {
        // item就是每个元素，将每个元素通过"="进行分割，得到一个子字符串数组b，例如，如果当前元素是"name=test"，则b将是["name", "test"]。
        let b = lab.split("=");
        // 将分割后的子字符串数组中的第一个元素作为键，第二个元素作为值，存储在上面创建的label对象(map)中。
        label[b[0]] = b[1];
      });

      // 组装好类型一样的数据
      this.createServiceData.params.name = this.createService.name;
      this.createServiceData.params.namespace = this.createService.namespace;
      this.createServiceData.params.type = this.createService.type;
      this.createServiceData.params.container_port = parseInt(
        this.createService.container_port
      );
      this.createServiceData.params.port = parseInt(this.createService.port);
      this.createServiceData.params.node_port = parseInt(
        this.createService.node_port
      );
      this.createServiceData.params.label = label;
      console.log("组装数据：", this.createServiceData.params);

      // 组装好数据后开始创建
      httpClient
        .post(this.createServiceData.url, this.createServiceData.params)
        .then((res) => {
          this.$message.success({
            message: res.msg,
          });
          this.getSvcs();
        })
        .catch((res) => {
          this.$message.error({
            message: res.err,
          });
        });
      //重置表单，无论创建成功与否，都会重置表单
      this.resetForm("createService");
      this.fullscreenLoading = false;
      //关闭动画加载和抽屉
      this.drawer = false;
    },
    //重置表单
    resetForm(formName) {
      //this.$refs可以获取到该表单对象所有组件的值
      // resetFields方法可以重置表单字段的值
      this.$refs[formName].resetFields();
      //this.namespaceValue = "default";
    },
    //提交service参数
    submitForm(formName) {
      //验证表单的每个规则是否通过，通过则调用createServiceFunc，反之返回false
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.createServiceFunc();
          console.log("规则通过：", formName);
        } else {
          return false;
        }
      });
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
      return labels.length > 15 ? labels.substring(0, 20) + "..." : labels;
    },
    //获取svc列表
    getSvcs() {
      this.getSvcData.params.name = this.searchValue;
      this.getSvcData.params.namespace = this.namespaceValue;
      this.getSvcData.params.page = this.currentPage;
      this.getSvcData.params.limit = this.pagesize;
      //   this.apploading = true;
      httpClient
        .get(this.getSvcData.url, {
          params: this.getSvcData.params,
        })
        .then((res) => {
          this.svcList = res.data.services;
          this.svctotal = res.data.total;
          console.log("获取到：", this.svcList, this.svctotal);
          this.apploading = false;
        })
        .catch((res) => {
          console.log("报错为：", res.err);
          //this.apploading = false;
        });
    },
    //分页
    handleSizeChange(size) {
      console.log(`每页 ${size} 条`);
      this.pagesize = size;
      this.getSvcs();
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      console.log("当前页: ", this.currentPage);
      this.getSvcs();
    },
    //刷新
    refulshButton() {
      this.searchValue = "";
      this.namespaceValue = "";
      this.getSvcs();
    },
    //将创建弹出框的状态码置为true
    openbox() {
      this.drawer = true;
    },
    //创建svc
    createSvc() {
      //this.fullscreenLoading = true;
      alert("等待后续开发");
      this.scalestatus = false;
    },
    //处理抽屉的关闭，double check 增加体验
    handleClose(done) {
      this.$confirm("还有未保存的工作哦确定关闭吗？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    //删除svc
    deleteSvc(svc) {
      console.log("要删除的namespoace是：", svc);
      this.deleteSvcData.params.name = svc;
      this.deleteSvcData.params.namespace = this.namespaceValue;
      console.log("要删除的是：", this.deleteSvcData.params);
      //return;
      httpClient
        .delete(this.deleteSvcData.url, {
          params: this.deleteSvcData.params,
        })
        .then((res) => {
          this.$message({
            type: "success",
            message: svc + "删除成功",
          });
          this.getSvcs();
        })
        .catch((res) => {
          this.$message({
            type: "info",
            message: svc + "删除失败",
          });
        });
    },
    //操作类提示框：重启、删除..
    handleConfirm(name, play, playFunc) {
      this.$confirm(
        "确认继续" + play + "Service [" + name + "] 操作吗？",
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
  },
  beforeMount() {
    this.getNamespaces();
    this.getSvcs();
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
    //获取service列表
    this.getSvcs();
  },
  //watch是一个选项对象，用于监听数据的变化。
  watch: {
    //监听namespace的值,若发生变化，则执行handler方法中的内容
    namespaceValue: {
      handler() {
        //将namespace的值存入本地，用于刷新页面或者path切换后依旧能获取得之前设置的namespace值
        localStorage.setItem("namespace", this.namespaceValue);
        // 页面刷新或切换的时候，把页数重新置为1并且重新获取service列表
        this.currentPage = 1;
        this.getSvcs();
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
</style>
