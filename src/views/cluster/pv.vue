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
              <el-table
                :data="pvList"
                style="width: 100%"
                v-loading="apploading"
              >
                <el-table-column width="20" />
                <el-table-column label="PV" align="left">
                  <template v-slot="scope">
                    <span
                      style="color: rgb(62, 165, 233)"
                      class="deploy-body-deployname"
                      >{{ scope.row.metadata.name }}</span
                    >
                  </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                  <template v-slot="scope">
                    <el-tag
                      type="success"
                      v-if="scope.row.status.phase == 'Bound'"
                      >{{ scope.row.status.phase }}</el-tag
                    >
                    <el-tag
                      type="warning"
                      v-else-if="scope.row.status.phase != 'Bound'"
                      >{{ scope.row.status.phase }}</el-tag
                    >
                  </template>
                </el-table-column>
                <el-table-column label="访问模式" align="center">
                  <template v-slot="scope">
                    <div v-for="(v, i) in scope.row.spec.accessModes" :key="i">
                      <el-tag type="">{{ v }}</el-tag>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="容量" align="center">
                  <template v-slot="scope">
                    <el-tag type="">{{
                      scope.row.spec.capacity.storage
                    }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="PVC" align="center">
                  <template v-slot="scope">
                    <span type="success">{{
                      scope.row.spec.claimRef.name
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="存储类" align="center">
                  <template v-slot="scope">
                    <span type="success">{{
                      scope.row.spec.storageClassName
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center">
                  <template v-slot="scope">
                    <span class="time">{{
                      timeTrans(scope.row.metadata.creationTimestamp)
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="200">
                  <template v-slot="scope">
                    <!-- <el-row> -->
                    <!-- <el-col :span="4"> -->
                    <el-button
                      :disabled="true"
                      type="danger"
                      icon="Delete"
                      @click="
                        handleConfirm(scope.row.metadata.name, '删除', deletePv)
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
        :total="pvtotal"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog title="创建Pv" v-model="scalestatus" width="25%" top="5%">
      <el-row>
        <el-col :span="24" style="display: flex; justify-content: center">
          <span style="display: flex; align-items: center; font-size: 16px"
            >Pv:
          </span>
          <el-input
            v-model="pv"
            style="width: 50%; padding-left: 10px"
          ></el-input>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="scalestatus = false">取 消</el-button>
          <el-button type="primary" @click="createPv">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import common from "../common/Config";
import httpClient from "../../utils/request";
export default {
  data() {
    return {
      apploading: true,
      pvValue: "",
      pvList: [],
      pvtotal: 0,
      getPvData: {
        url: common.K8sGetPvs,
        params: {
          name: "",
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
      pv: "",
      deletePvData: {
        url: common.K8sDeletePv,
        params: {
          name: "",
        },
      },
    };
  },
  methods: {
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
    //获取pv列表
    getPvs() {
      this.getPvData.params.name = this.searchValue;
      this.getPvData.params.page = this.currentPage;
      this.getPvData.params.limit = this.pagesize;
      //   this.apploading = true;
      httpClient
        .get(this.getPvData.url, {
          params: this.getPvData.params,
        })
        .then((res) => {
          this.pvList = res.data.pvs;
          this.pvtotal = res.data.total;
          console.log("获取到：", this.pvList, this.pvtotal);
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
      this.getPvs();
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      console.log("当前页: ", this.currentPage);
      this.getPvs();
    },
    //刷新
    refulshButton() {
      this.searchValue = "";
      this.getPvs();
    },
    //将创建弹出框的状态码置为true
    openbox() {
      this.scalestatus = true;
    },
    //创建pv
    createPv() {
      //this.fullscreenLoading = true;
      alert("等待后续开发");
      this.scalestatus = false;
    },
    //删除pv
    deletePv(pv) {
      console.log("要删除的namespoace是：", pv);
      this.deletePvData.params.name = pv;
      httpClient
        .delete(this.deletePvData.url, {
          params: this.deletePvData.params,
        })
        .then((res) => {
          this.$message({
            type: "success",
            message: pv + "删除成功",
          });
        })
        .catch((res) => {
          this.$message({
            type: "info",
            message: pv + "删除失败",
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
  },
  beforeMount() {
    this.getPvs();
  },
};
</script>
<style>
.time {
  font-size: 13px;
  color: rgb(145, 143, 143);
}
</style>
