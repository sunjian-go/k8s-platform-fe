<template>
  <div>
    <el-row>
      <!-- 数据表格 -->
      <el-col :span="24">
        <div>
          <el-card shadow="never" :body-style="{ padding: '10px' }">
            <div>
              <el-table
                :data="nodeList"
                style="width: 100%"
                v-loading="apploading"
              >
                <el-table-column width="20" />
                <!-- 展开框 -->
                <el-table-column label="Node名" align="left">
                  <template v-slot="scope">
                    <span
                      style="color: rgb(62, 165, 233)"
                      class="deploy-body-deployname"
                      >{{ scope.row.metadata.name }}</span
                    >
                  </template>
                </el-table-column>
                <el-table-column label="IP" align="center">
                  <template v-slot="scope">
                    <span>{{ scope.row.status.addresses[0].address }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                  <template v-slot="scope">
                    <el-tag
                      type="success"
                      v-if="scope.row.status.conditions[4].status == 'True'"
                      >Ready</el-tag
                    >

                    <el-tag
                      type="warning"
                      v-else-if="
                        scope.row.status.conditions[4].status != 'True'
                      "
                      >NotReady</el-tag
                    >
                  </template>
                </el-table-column>
                <el-table-column label="规格" align="center">
                  <template v-slot="scope">
                    <el-tag
                      >{{ scope.row.status.capacity.cpu }}核{{
                        jsmem(scope.row.status.capacity.memory)
                      }}G</el-tag
                    >
                  </template>
                </el-table-column>
                <el-table-column label="POD-CIDR" align="center">
                  <template v-slot="scope">
                    <el-tag type="info">{{ scope.row.spec.podCIDR }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="版本" align="center">
                  <template v-slot="scope">
                    <span>{{ scope.row.status.nodeInfo.kubeletVersion }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" width="200">
                  <template v-slot="scope">
                    <span>{{
                      timeTrans(scope.row.metadata.creationTimestamp)
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="200">
                  <template v-slot="scope">
                    <el-button
                      type="primary"
                      icon="InfoFilled"
                      @click="openNewWindow(scope.row)"
                      >详情</el-button
                    >
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
      :total="nodeTotal"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import common from "../common/Config";
import httpClient from "../../utils/request";
export default {
  data() {
    return {
      apploading: true,
      //获取node列表
      nodeList: [],
      getNodeListData: {
        url: common.K8sGetNodeList,
      },
      //分页
      currentPage: 1,
      pagesize: 10,
      small: true,
      pageList: [10, 20, 30, 40],
      nodeTotal: 0,
      disabled: false,
      background: true,
    };
  },
  methods: {
    //获取node列表
    getNodeList() {
      httpClient
        .get(this.getNodeListData.url)
        .then((res) => {
          console.log("获取到node信息：", res.data);
          this.nodeList = res.data.items;
          this.nodeTotal = res.data.total;
          this.apploading = false;
        })
        .catch((res) => {
          console.log("报错为：", res.err);
          this.apploading = false;
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
    //分页
    handleSizeChange(size) {
      console.log(`每页 ${size} 条`);
      this.pagesize = size;
      this.getNodeList();
    },
    handleCurrentChange(page) {
      console.log("当前页: ", page);
      this.currentPage = page;
      this.getNodeList();
    },

    //换算内存信息
    jsmem(memnum) {
      let mem = memnum.replace("Ki", "");
      //console.log("整理好的内存为：", mem);
      return Math.round(mem / 1024 / 1024);
    },
    openNewWindow(nodeinfo) {
      //通过路由传输参数给新页面
      const url = `/nodedetail?name=${encodeURIComponent(
        nodeinfo.metadata.name
      )}`;
      window.open(url, "_blank");
    },
  },
  mounted() {
    // 设置终端字符编码为 UTF-8
    process.env.LANG = "en_US.UTF-8";
  },
  beforeMount() {
    this.getNodeList();
  },
};
</script>
<style>
.row-col-card {
  margin-bottom: 5px;
  height: 10%;
}
.deploy-body-deployname:hover {
  color: rgb(84, 138, 238);
  cursor: pointer;
  font-weight: bold;
  font-size: 15px;
}
.log-card {
  background-color: rgb(83, 79, 82);
  color: rgb(3, 184, 3);
  padding: 5px;
}
.node-body-shell-card {
  border-radius: 1px;
  height: 600px;
  overflow: auto;
  background-color: rgb(12, 12, 12);
}
</style>
