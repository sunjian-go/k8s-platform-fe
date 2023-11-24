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
                :data="secretList"
                style="width: 100%"
                v-loading="apploading"
              >
                <el-table-column width="20" />
                <el-table-column label="Secret" align="left">
                  <template v-slot="scope">
                    <span
                      style="color: rgb(62, 165, 233)"
                      class="deploy-body-deployname"
                      >{{ scope.row.metadata.name }}</span
                    >
                  </template>
                </el-table-column>
                <el-table-column label="标签" align="center">
                  <template v-slot="scope">
                    <!-- <el-tag type="success">{{ scope.row.spec.type }}</el-tag> -->
                    <div v-for="(val, key) in scope.row.metadata" :key="key">
                      <div v-if="key == 'labels'">
                        <div
                          v-for="(v, k) in scope.row.metadata.labels"
                          :key="k"
                        >
                          <el-popover
                            style="width: 100%"
                            placement="top"
                            :width="300"
                            trigger="hover"
                            :content="`${k}: ${v}`"
                          >
                            <template #reference>
                              <el-tag type="warning">{{
                                ellipsis(k + ": " + v)
                              }}</el-tag>
                            </template>
                          </el-popover>
                          <!-- <el-tag type="warning">{{ k }}: {{ v }}</el-tag> -->
                        </div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="DATA" align="center">
                  <template v-slot="scope">
                    <el-popover
                      placement="right-start"
                      title="Data"
                      :width="500"
                      trigger="hover"
                      :content="jsontoyaml(scope.row.data)"
                    >
                      <template #reference>
                        <!-- <el-button class="m-2">Hover to activate</el-button> -->
                        <el-icon style="font-size: 18px"><Reading /></el-icon>
                      </template>
                    </el-popover>
                    <!-- <el-tooltip
                        class="boxitem"
                        effect="light"
                        :content="scope.row.data"
                        placement="right"
                      >
                        <el-button>right-start</el-button>
                      </el-tooltip> -->
                    <!-- <span type="">{{ scope.row.data }}</span> -->
                  </template>
                </el-table-column>
                <el-table-column label="类型" align="center">
                  <template v-slot="scope">
                    <!-- <span class="time">{{
                      timeTrans(scope.row.metadata.creationTimestamp)
                    }}</span> -->
                    <!-- <el-tag>{{ scope.row.type }}</el-tag> -->
                    <el-popover
                      style="width: 100%"
                      placement="top"
                      :width="300"
                      trigger="hover"
                      :content="scope.row.type"
                    >
                      <template #reference>
                        <el-tag type="">{{ ellipsis(scope.row.type) }}</el-tag>
                      </template>
                    </el-popover>
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
                    <div>
                      <el-button
                        type="primary"
                        icon="Edit"
                        plain
                        @click="getSecretDetail(scope.row), (yamlDialog = true)"
                        >YAML</el-button
                      >
                      <el-button
                        type="danger"
                        icon="Delete"
                        @click="
                          handleConfirm(
                            scope.row.metadata.name,
                            '删除',
                            deleteSecret
                          )
                        "
                        >删除</el-button
                      >
                    </div>
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
        :total="secrettotal"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog title="创建Secret" v-model="scalestatus" width="25%" top="5%">
      <el-row>
        <el-col :span="24" style="display: flex; justify-content: center">
          <span style="display: flex; align-items: center; font-size: 16px"
            >Secret:
          </span>
          <el-input
            v-model="secret"
            style="width: 50%; padding-left: 10px"
          ></el-input>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="scalestatus = false">取 消</el-button>
          <el-button type="primary" @click="createSecret">确 定</el-button>
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
      <template #header>
        <span style="font-weight: bold; font-size: 18px">创建Secret</span>
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
              ref="createSecret"
              :rules="createSecretRules"
              :model="createSecretData"
            >
              <!-- prop名字与规则里面的name保持一致 -->
              <el-form-item label="名称" prop="name" class="deploy-create-form">
                <el-input v-model="createSecretData.name"></el-input>
              </el-form-item>
              <el-form-item
                label="命名空间"
                prop="namespace"
                class="deploy-create-form"
              >
                <el-select
                  v-model="createSecretData.namespace"
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
              <el-form-item  class="deploy-create-form">
                <div style="padding-left: 45%;padding-right: 45%;font-weight: bold;"><span>Data</span></div>
              </el-form-item>
              <el-form-item  class="deploy-create-form">
                <div v-for="v,i in indexArr" :key="i">
                  <el-row :gutter="10">
                    <el-col :span="11">
                    <el-input placeholder="Key" v-model="secdatas[i].key"></el-input>
                    </el-col>
                    <el-col :span="11">
                      <el-input placeholder="Value" v-model="secdatas[i].value"></el-input>
                    </el-col>
                    <el-col :span="2">
                      <el-icon @click="addvalue()"><Plus /></el-icon>
                    </el-col>
                  </el-row>
                </div>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </template>
      <template #footer>
        <el-button
          @click="
            handleClose()
          "
          >取消</el-button
        >
        <el-button type="primary" @click="submitForm('createSecret')"
          >立即创建</el-button
        >
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
import { getNamespacesReq } from "@/api/cluster/cluster";
import {
createSecretReq,
deleteSecretReq,
getSecretsDetailReq,
getSecretsReq,
updateSecretReq
} from "@/api/secret/secret";
import yaml2obj from "js-yaml";
import json2yaml from "json2yaml";
import common from "../common/Config";

export default {
  data() {
    return {
      direction: "rtl",
      apploading: true,
      namespaceValue: "",
      namespaceList: [],
      namespaceListUrl: common.k8sNamespaceList,
      secretValue: "",
      secretList: [],
      secrettotal: 0,
      getSecretData: {
        url: common.K8sGetSecrets,
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
      secret: "",
      deleteSecretData: {
        url: common.K8sDeleteSecret,
        params: {
          name: "",
          namespace: "",
        },
      },
      drawer: false,
      // 定义el-form规则,只有定义了规则的input前面才会有红点,也就是必填项
      // 规则名要与结构体中的名字保持一致
      createSecretRules: {
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
      },
      secretTypes: ["ClusterIP", "NodePort", "LoadBalancer"],
      //创建secret所需
      secdatas:[
      {
        key:"",
        value:""
      },
      ],
      dataIndex:0,
      createSecretData: {
        name:"",
        namespace:"",
        data:{},
      },
      indexArr:[1],
      secretDetailData: {
        url: common.K8sGetSecretDetail,
        params: {
          name: "",
          namespace: "",
        },
      },
      //详情
      contentYaml: "",
      yamlDialog: false,
      updateSecretData: {
        url: common.K8sUpdateSecret,
        params: {
          namespace: "",
          content: "",
        },
      },
      //编辑器配置
      secretOptions: common.cmOptions,
    };
  },
  methods: {
    //yaml内容变化后调用,val不用传入，自动会获取更新后的yaml内容
    onChange(val) {
      this.contentYaml = val;
    },
    //更新secret
    updateSecret() {
      console.log("准备更新了：", this.contentYaml);
      this.updateSecretData.params.namespace = this.namespaceValue;
      // 先将yaml转为对象，再将对象通过JSON.stringify转为json类型数据
      this.updateSecretData.params.content = JSON.stringify(
        yaml2obj.load(this.contentYaml)
      );
      updateSecretReq(this.updateSecretData.params)
        .then((res) => {
          this.$message({
            type: "success",
            message: name + res.msg,
          });
          // 更新完yaml之后，获取最新的数据
          this.getSecrets();
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
    //获取secret详情
    getSecretDetail(obj) {
      console.log("获取详情的为：", obj.metadata.name);
      this.secretDetailData.params.name = obj.metadata.name;
      if (this.namespaceValue != "") {
        this.secretDetailData.params.namespace = this.namespaceValue;
      }
      this.secretDetailData.params.namespace = obj.metadata.namespace;
      console.log("准备获取详情的是：", this.secretDetailData.params);

      getSecretsDetailReq(this.secretDetailData.params)
        .then((res) => {
          console.log("secret详情为：", res.data);
          this.contentYaml = this.jsontoyaml(res.data);
          this.yamlDialog = true;
          //   console.log("secret详情YAML为：", this.jsontoyaml(res.data));
        })
        .catch((res) => {
          console.log("获取详情失败：", res.err);
        });
    },
    //labels显示长度限制
    ellipsis(labels) {
      // 判断lables的长度是否大于15，为true则0-20位正常显示，之后的显示...，为false则直接返回值
      return labels.length > 20 ? labels.substring(0, 25) + "..." : labels;
    },
    //换行函数
    lines(str) {
      let lines = str.split("\n");
      return lines.join("<br>");
    },
    jsontoyaml(jsondata) {
      return json2yaml.stringify(jsondata);
    },
    //重置表单
    resetForm(formName) {
      //this.$refs可以获取到该表单对象所有组件的值
      // resetFields方法可以重置表单字段的值
      this.$refs[formName].resetFields();
      //this.namespaceValue = "default";
    },
    //提交secret参数
    submitForm(formName) {
      //验证表单的每个规则是否通过，通过则调用createSecretFunc，反之返回false
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.createSecretFunc();
          console.log("规则通过：", formName);
        } else {
          return false;
        }
      });
    },
    resetData(){
        this.resetForm("createSecret")
        this.indexArr=[1]
        this.createSecretData.data={}
        this.secdatas= [
       {
        key:"",
        value:""
       },
        ]
    },
    createSecretFunc(){
      for(let i in this.secdatas){
        this.createSecretData.data[this.secdatas[i].key]=this.secdatas[i].value
      }
      console.log("组装好的data为: ",this.createSecretData)
       createSecretReq(this.createSecretData).then(res=>{
        this.$message.success({
          message:res.msg
        })
        this.getSecrets()
       }).catch(res=>{
        this.$message.error({
          message:res.err
        })
       }).finally((_)=>{
        this.drawer=false
        this.resetData()
       })
    },
    //组装data
    addvalue(){
      this.indexArr.push(1)
      this.secdatas.push(
        {
        key:"",
        value:"",
      },
      )
      console.log("data为：",this.secdatas)
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
    //获取secret列表
    getSecrets() {
      this.getSecretData.params.name = this.searchValue;
      this.getSecretData.params.namespace = this.namespaceValue;
      this.getSecretData.params.page = this.currentPage;
      this.getSecretData.params.limit = this.pagesize;
      //   this.apploading = true;
      getSecretsReq(this.getSecretData.params)
        .then((res) => {
          this.secretList = res.data.Items;
          this.secrettotal = res.data.Total;
          console.log("获取到：", this.secretList);
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
      this.getSecrets();
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      console.log("当前页: ", this.currentPage);
      this.getSecrets();
    },
    //刷新
    refulshButton() {
      this.searchValue = "";
      this.namespaceValue = "";
      this.getSecrets();
    },
    //将创建弹出框的状态码置为true
    openbox() {
      this.drawer = true;
    },
    //处理抽屉的关闭，double check 增加体验
    handleClose(done) {
      this.$confirm("还有未保存的工作哦确定关闭吗？")
        .then((_) => {
          this.drawer=false
          this.resetData()
          done();
        })
        .catch((_) => {});
    },
    //删除secret
    deleteSecret(secret) {
      console.log("要删除的namespoace是：", secret);
      this.deleteSecretData.params.name = secret;
      this.deleteSecretData.params.namespace = this.namespaceValue;
      console.log("要删除的是：", this.deleteSecretData.params);
      //return;
      deleteSecretReq(this.deleteSecretData.params)
        .then((res) => {
          this.$message({
            type: "success",
            message: secret + "删除成功",
          });
         
        })
        .catch((res) => {
          this.$message({
            type: "info",
            message: secret + "删除失败",
          });
        }).finally((_)=>{
          this.getSecrets();
        })
    },
    //操作类提示框：重启、删除..
    handleConfirm(name, play, playFunc) {
      this.$confirm(
        "确认继续" + play + "Secret [" + name + "] 操作吗？",
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
    //获取secret列表
    if (this.namespaceValue == "") {
      this.getSecrets();
    }
  },
  //watch是一个选项对象，用于监听数据的变化。
  watch: {
    //监听namespace的值,若发生变化，则执行handler方法中的内容
    namespaceValue: {
      handler() {
        //将namespace的值存入本地，用于刷新页面或者path切换后依旧能获取得之前设置的namespace值
        localStorage.setItem("namespace", this.namespaceValue);
        // 页面刷新或切换的时候，把页数重新置为1并且重新获取secret列表
        this.currentPage = 1;
        this.getSecrets();
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
.boxitem {
  float: right;
  width: 10px;
}
</style>
