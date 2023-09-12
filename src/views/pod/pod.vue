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
                <el-button type="" @click="refulshButton">
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
              <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="date" label="Date" width="180" />
                <el-table-column prop="name" label="Name" width="180" />
                <el-table-column prop="address" label="Address" />
                <el-table-column>
                  <template #header>
                    <el-row :gutter="3">
                      <el-col :span="6"
                        ><el-input
                          placeholder="请输入"
                          v-model="searchValue"
                        ></el-input
                      ></el-col>
                      <el-col :span="2"
                        ><el-button type="">搜索</el-button></el-col
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
      namespaceValue: "",
      namespaceList: [],
      getNamespaceData: {
        url: common.k8sNamespaceList,
      },
      //搜索
      searchValue: "",
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
    //刷新按钮
    refulshButton() {
      this.namespaceValue = "";
    },
  },
  beforeMount() {
    this.getPodNamespace();
  },
};
</script>
<style>
.row-col-card {
  margin-bottom: 5px;
  height: 10%;
}
</style>
