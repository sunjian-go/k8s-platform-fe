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
                    filterable="true"
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
                <el-table-column label="标签" align="left">
                  <template v-slot="scope">
                    <div
                      v-for="(label, i) in scope.row.metadata.labels"
                      :key="i"
                    >
                      <el-popover
                        placement="top-start"
                        :width="400"
                        trigger="hover"
                        :content="`${i}: ${label}`"
                      >
                        <template #reference>
                          <el-tag type="warning"
                            >{{ i }}: {{ ellipsis(label) }}</el-tag
                          >
                        </template>
                      </el-popover>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="容器组" align="left">
                  <template v-slot="scope">
                    <div
                      v-for="(container, i) in scope.row.spec.containers"
                      :key="i"
                    >
                      <span>{{ container.name }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="创建时间" align="left">
                  <template v-slot="scope">
                    <span>{{
                      timeTrans(scope.row.metadata.creationTimestamp)
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="镜像" align="left">
                  <template v-slot="scope">
                    <div
                      v-for="(container, i) in scope.row.spec.containers"
                      :key="i"
                    >
                      <el-tag>{{ container.image }}</el-tag>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="状态" align="left">
                  <template v-slot="scope">
                    <el-tag class="ml-2" type="success">{{
                      scope.row.status.phase
                    }}</el-tag>
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
</template>
<script>
import common from "../common/Config";
import httpClient from "../../utils/request";
export default {
  data() {
    return {
      namespaceValue: "default",
      namespaceList: [],
      getNamespaceData: {
        url: common.k8sNamespaceList,
      },
      //搜索
      searchValue: "",
      //获取pod列表
      currentPage: 1,
      pagesize: 10,
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
    };
  },
  methods: {
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
  beforeMount() {
    this.getPodNamespace();
    this.getPodList();
  },
};
</script>
<style>
.row-col-card {
  margin-bottom: 5px;
  height: 10%;
}
</style>
