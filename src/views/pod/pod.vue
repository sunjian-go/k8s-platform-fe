<template>
  <div>
    <el-row>
      <!-- 头部1 -->
      <el-col :span="24">
        <div>
          <el-card
            class="row-col-card"
            shadow="never"
            :body-style="{ padding: '10px' }"
          >
            <el-row>
              <el-col :span="6">
                <div>
                  <span>命名空间：</span>
                  <!-- filterable: 可以输入 -->
                  <el-select
                    v-model="namespaceValue"
                    placeholder="请选择"
                    :filterable="true"
                  >
                    <el-option
                      v-for="(scope, i) in namespaceList"
                      :key="i"
                      :label="scope.metadata.name"
                      :value="scope.metadata.name"
                    />
                  </el-select>
                </div>
              </el-col>
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
      <!-- 数据表格 -->
      <el-col :span="24">
        <div>
          <el-card shadow="never" :body-style="{ padding: '10px' }">
            <div>
              <el-table :data="podList" style="width: 100%">
                <el-table-column width="20" />
                <el-table-column label="Pod" align="left">
                  <template v-slot="scope">
                    <span>{{ scope.row.metadata.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="节点" align="center">
                  <template v-slot="scope">
                    <el-tag>{{ scope.row.spec.nodeName }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                  <template v-slot="scope">
                    <el-tag
                      type="success"
                      v-if="scope.row.status.phase == 'Running'"
                      >{{ scope.row.status.phase }}</el-tag
                    >
                    <el-tag
                      type="warning"
                      v-else-if="scope.row.status.phase == 'Pending'"
                      >{{ scope.row.status.phase }}</el-tag
                    >
                    <el-tag
                      type="delete"
                      v-else-if="
                        scope.row.status.phase != 'Pending' || 'Running'
                      "
                      >{{ scope.row.status.phase }}</el-tag
                    >
                  </template>
                </el-table-column>
                <el-table-column label="重启数" align="center">
                  <template v-slot="scope">
                    <span>{{ getPodRestartNum(scope.row) }}</span>
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
                    <el-row :gutter="100">
                      <el-col :span="4">
                        <el-button
                          type="primary"
                          icon="Edit"
                          plain
                          @click="
                            getPodDetail(scope.row.metadata.name),
                              (yamlDialog = true)
                          "
                          >YAML</el-button
                        >
                      </el-col>
                      <el-col :span="4">
                        <el-button type="danger" icon="Delete" @click="handleConfirm(scope.row.metadata.name,'删除',deletePod)">删除</el-button>
                      </el-col>
                    </el-row>
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
                        ><el-button type="" @click="getPodList()"
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
      :current-page="currentPage"
      :page-size="pagesize"
      :page-sizes="pageList"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="podTotal"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
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
        <el-button type="primary" @click="updatePod()">更 新</el-button>
      </span>
    </template>
  </el-dialog>
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
      getNamespaceData: {
        url: common.k8sNamespaceList,
      },
      //搜索
      searchValue: "",
      //获取pod列表
      podList: [],
      getPodListData: {
        url: common.K8sGetPodList,
        params: {
          filter_name: "",
          namespace: "",
          limit: 0,
          page: 0,
        },
      },
      //分页
      currentPage: 1,
      pagesize: 10,
      small: true,
      pageList: [10, 20, 30, 40],
      podTotal: 0,
      disabled: false,
      background: true,
      //yaml编辑器
      yamlDialog: false,
      contentYaml: "",
      cmOptions: common.cmOptions,
      //获取pod详情
      getPodDetailData: {
        url: common.K8sGetPodDetail,
        params: {
          name: "",
          namespace: "",
        },
      },
      //更新pod
      updatePodData: {
        url: common.K8sUpdatePod,
        params: {
          namespace: "",
          context: "",
        },
      },
      //删除pod
      deletePodData:{
        url: common.K8sDeletePod,
        params:{
          name:'',
          namespace:'',
        },
      },
    };
  },
  beforeMount() {
    //加载页面时先获取localStorage中的namespace值，若获取不到则默认default，放在下拉框第一位显示
    if (
      localStorage.getItem("namespace") !== "undefined" &&
      localStorage.getItem("namespace") !== null
    ) {
      this.namespaceValue = localStorage.getItem("namespace");
    }
    this.getPodNamespace();
    this.getPodList();
    console.log("hello world");
  },
  methods: {
    //操作类提示框：重启、删除..
    handleConfirm(name, play, playFunc) {
      this.$confirm(
        "确认继续" + play + "Pod [" + name + "] 操作吗？",
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
    //获取namespace
    getPodNamespace() {
      httpClient
        .get(this.getNamespaceData.url)
        .then((res) => {
          this.namespaceList = res.data.namespaces;
          //console.log("获取到：", this.namespaceList);
        })
        .catch((res) => {
          console.log("报错为：", res.err);
        });
    },
    //获取pod列表
    getPodList() {
      this.getPodListData.params.filter_name = this.searchValue;
      this.getPodListData.params.namespace = this.namespaceValue;
      this.getPodListData.params.page = this.currentPage;
      this.getPodListData.params.limit = this.pagesize;
      httpClient
        .get(this.getPodListData.url, {
          params: this.getPodListData.params,
        })
        .then((res) => {
          console.log("获取pod列表为: ", res.data);
          this.podList = res.data.items;
          this.podTotal = res.data.total;
        })
        .catch((res) => {
          console.log("报错为：", res.err);
        });
    },
    //刷新按钮
    refulshButton() {
      this.namespaceValue = "";
      this.searchValue = "";
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
    //分页
    handleSizeChange(size) {
      console.log(`每页 ${size} 条`);
      this.pagesize = size;
      this.getPodList();
    },
    handleCurrentChange(page) {
      console.log("当前页: ", page);
      this.currentPage = page;
      this.getPodList();
    },
    //计算重启次数（所有容器重启次数总和）
    getPodRestartNum(podRestarts) {
      let num = 0;
      let i = 0;
      let restarts = podRestarts.status.containerStatuses;
      for (i in restarts) {
        num = num + restarts[i].restartCount;
      }
      //console.log("pod重启次数为：", num);
      return num;
    },
    //yaml
    onChange(yaml) {
      this.contentYaml = yaml;
      console.log("修改后的为：", this.contentYaml);
    },
    //更新
    updatePod() {
      //console.log("修改后为：", JSON.stringify(yaml2obj.load(this.contentYaml)));
      this.updatePodData.params.namespace = this.namespaceValue;
      this.updatePodData.params.context = JSON.stringify(
        yaml2obj.load(this.contentYaml)
      );
      
      httpClient.put(this.updatePodData.url,this.updatePodData.params).then(res=>{
        this.$message({
            type: "success",
            message: name + res.msg,
          });
          this.getPodList();
          this.yamlDialog=false;
          
      }).catch(res=>{
        this.$message({
            type: "info",
            message: name + res.err,
          });
          this.getPodList();
          this.yamlDialog=false;
      })
    },
    //获取pod详情
    getPodDetail(e) {
      this.getPodDetailData.params.name = e;
      this.getPodDetailData.params.namespace = this.namespaceValue;
      console.log("传进来的的为：", this.getPodDetailData.params);
      httpClient
        .get(this.getPodDetailData.url, this.getPodDetailData)
        .then((res) => {
          //console.log("pod详情为：", res.data);
          this.contentYaml = this.jsontoyaml(res.data);
          // console.log("pod详情为：", this.contentYaml);
        })
        .catch((res) => {
          console.log("报错为：", res.err);
        });
    },
    //删除pod
    deletePod(podName){
      this.deletePodData.params.name=podName,
      this.deletePodData.params.namespace=this.namespaceValue,
      httpClient.delete(this.deletePodData.url,{params:this.deletePodData.params}).then(res=>{
        this.$message({
            type: "success",
            message: name + res.msg,
          });
          this.getPodList();
      }).catch(res=>{
        this.$message({
            type: "error",
            message: name + res.err,
          });
          this.getPodList()
      })
    },
    //json转yaml
    jsontoyaml(jsondata) {
      return json2yaml.stringify(jsondata);
    },
    //yaml转对象
    yamltoObj(yamldata) {
      return yaml2obj.load(yaml2obj);
    },
  },
  watch: {
    //监听namespace的值,若发生变化，则执行handler方法中的内容
    namespaceValue: {
      handler() {
        //将namespace的值存入本地，用于刷新页面或者path切换后依旧能获取得之前设置的namespace值
        localStorage.setItem("namespace", this.namespaceValue);
        // 页面刷新或切换的时候，把页数重新置为1并且重新获取deployment列表
        this.currentPage = 1;
        this.getPodList();
      },
    },
  },
};
</script>
<style>
.row-col-card {
  margin-bottom: 5px;
  height: 10%;
}
</style>
